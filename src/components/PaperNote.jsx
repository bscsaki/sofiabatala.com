import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useStore from '../store/useStore'

// Intro / help note, fully procedural: a plane with the journal-paper texture
// is crumpled by layered vertex noise and smoothly unfolds. Ball, motion and
// open note are the same mesh + texture, so there is no video-to-image swap
// and no visual seam. Lit by real lights that follow day / night mode.

const FLAT_SRC = '/images/paper-flat.png'
const SEG_X = 72
const SEG_Y = 54
const PLANE_W = 4
const PLANE_H = 3

// deterministic layered sin-noise, cheap and smooth
function wrinkle(x, y) {
  return (
    Math.sin(x * 2.1 + y * 3.7) * 0.55 +
    Math.sin(x * 5.3 - y * 2.2 + 1.7) * 0.28 +
    Math.sin(x * 9.1 + y * 7.9 + 4.2) * 0.17
  )
}
function wrinkleFine(x, y) {
  return Math.sin(x * 14.3 + y * 11.7 + 2.4) * 0.6 + Math.sin(x * 23.1 - y * 17.3) * 0.4
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInCubic = (t) => t * t * t

export default function PaperNote({ dayMode }) {
  // phases: hidden -> unfolding -> open -> crunching -> parking -> ball
  const [phase, setPhase] = useState('hidden')
  const phaseRef = useRef('hidden')
  const mountRef = useRef(null)
  const stateRef = useRef({ c: 1, target: 1, t0: 0, from: 1 })
  const sceneRef = useRef(null)
  const dayRef = useRef(dayMode)

  // mirror props/state into refs after commit so the rAF loop can read the
  // latest values without re-subscribing (writing refs during render is unsafe)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  useEffect(() => {
    dayRef.current = dayMode
  }, [dayMode])

  useEffect(() => {
    const t = setTimeout(() => setPhase('unfolding'), 900)
    return () => clearTimeout(t)
  }, [])

  // build the mini three.js scene once the note becomes visible
  const visible = phase !== 'hidden'
  useEffect(() => {
    const mount = mountRef.current
    if (!visible || !mount) return
    const W = 760
    const H = 570
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 50)
    camera.position.set(0, 0, 7.2)

    const ambient = new THREE.AmbientLight('#ffffff', 0.75)
    const key = new THREE.DirectionalLight('#fff2dc', 1.1)
    key.position.set(-2.5, 3, 4)
    const rim = new THREE.DirectionalLight('#dfe8ff', 0.25)
    rim.position.set(3, -2, 2.5)
    scene.add(ambient, key, rim)

    const geo = new THREE.PlaneGeometry(PLANE_W, PLANE_H, SEG_X, SEG_Y)
    const base = geo.attributes.position.array.slice()
    const mat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.94,
      metalness: 0,
      transparent: true,
      alphaTest: 0.5,
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // paper texture with the note text baked in, so text unfolds with the sheet
    const texCanvas = document.createElement('canvas')
    texCanvas.width = 1184
    texCanvas.height = 864
    const drawTexture = () => {
      const ctx = texCanvas.getContext('2d', { willReadFrequently: true })
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, texCanvas.width, texCanvas.height)
        // key out the black surround so the mesh silhouette is the paper
        const id = ctx.getImageData(0, 0, texCanvas.width, texCanvas.height)
        const d = id.data
        for (let i = 0; i < d.length; i += 4) {
          const m = Math.max(d[i], d[i + 1], d[i + 2])
          d[i + 3] = m <= 30 ? 0 : m >= 70 ? 255 : Math.round(((m - 30) / 40) * 255)
        }
        ctx.putImageData(id, 0, 0)
        ctx.fillStyle = '#3b3129'
        const cx = 150
        ctx.font = "bold 46px 'Helvetihand', cursive"
        ctx.fillText('Welcome to my portfolio,', cx, 160)
        ctx.font = "32px 'Helvetihand', cursive"
        ctx.fillText('my name is Sofia Batala and I am passionate about', cx, 218)
        ctx.fillText('web application security and penetration testing.', cx, 262)
        ctx.font = "bold 34px 'Helvetihand', cursive"
        ctx.fillText('How to navigate this page:', cx, 348)
        ctx.font = "31px 'Helvetihand', cursive"
        const lines = [
          '— the laptop has my resume & projects',
          '— flip through the journal to know me',
          "— the picture frame, that's me!",
          '— the lamp & day/night set the mood',
        ]
        lines.forEach((l, i) => ctx.fillText(l, cx, 406 + i * 54))
        ctx.font = "33px 'Helvetihand', cursive"
        const socials = [
          ['github', cx],
          ['linkedin', cx + 170],
          ['email', cx + 360],
          ['medium', cx + 530],
        ]
        socials.forEach(([label, x]) => {
          ctx.fillText(label, x, 700)
          const w = ctx.measureText(label).width
          ctx.fillRect(x, 710, w, 2.5)
        })
        ctx.globalAlpha = 0.7
        ctx.font = "29px 'Helvetihand', cursive"
        ctx.fillText('crumple it ↩', texCanvas.width - 260, 700)
        ctx.globalAlpha = 1
        tex.needsUpdate = true
      }
      img.src = FLAT_SRC
    }
    const tex = new THREE.CanvasTexture(texCanvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    mat.map = tex
    // make sure the handwriting font is ready before baking
    if (document.fonts && document.fonts.load) {
      document.fonts.load("31px 'Helvetihand'").then(drawTexture)
    } else {
      drawTexture()
    }

    // precompute per-vertex crumple targets
    const count = geo.attributes.position.count
    const crumpleZ = new Float32Array(count)
    const fineZ = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      crumpleZ[i] = wrinkle(x, y)
      fineZ[i] = wrinkleFine(x, y)
    }

    const pos = geo.attributes.position
    const applyCrumple = (c) => {
      // c: 0 flat sheet -> 1 crumpled wad
      const shrink = 1 - 0.68 * c
      const amp = 1.05 * c
      const fine = 0.22 * c
      for (let i = 0; i < count; i++) {
        const bx = base[i * 3]
        const by = base[i * 3 + 1]
        pos.array[i * 3] = bx * shrink + crumpleZ[i] * 0.16 * c * Math.sign(bx || 1)
        pos.array[i * 3 + 1] = by * shrink + fineZ[i] * 0.1 * c
        pos.array[i * 3 + 2] = crumpleZ[i] * amp + fineZ[i] * fine
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
    }
    applyCrumple(1)

    const clock = new THREE.Clock()
    let raf = 0
    let lastStep = performance.now()
    const dayCol = { amb: 0.85, key: 1.25, keyCol: new THREE.Color('#fff2dc') }
    const nightCol = { amb: 0.38, key: 0.6, keyCol: new THREE.Color('#cdd8ef') }
    const step = () => {
      lastStep = performance.now()
      const st = stateRef.current
      const dt = Math.min(clock.getDelta(), 0.05)
      const now = clock.elapsedTime
      // morph progress advances by frame delta toward the target
      if (st.target !== st.c) {
        const dur = st.target === 0 ? 1.7 : 1.15
        st.p = Math.min(1, (st.p || 0) + dt / dur)
        const e = st.target === 0 ? easeOutCubic(st.p) : easeInCubic(st.p)
        st.c = st.from + (st.target - st.from) * e
        if (st.p >= 1) {
          st.c = st.target
          const ph = phaseRef.current
          if (ph === 'unfolding' && st.target === 0) setPhase('open')
          if (ph === 'crunching' && st.target === 1) setPhase('parking')
        }
      }
      // idle: gentle paper breathing when open, slow tumble when balled
      const idle = phaseRef.current === 'open' ? Math.sin(now * 0.8) * 0.012 : 0
      applyCrumple(Math.max(0, Math.min(1, st.c + idle)))
      mesh.rotation.z = st.c * -0.35
      mesh.rotation.x = st.c * 0.3 + (phaseRef.current === 'ball' ? Math.sin(now * 0.6) * 0.1 : 0)
      // day / night lighting follows the room
      const target = dayRef.current ? dayCol : nightCol
      ambient.intensity += (target.amb - ambient.intensity) * 0.06
      key.intensity += (target.key - key.intensity) * 0.06
      key.color.lerp(target.keyCol, 0.06)
      renderer.render(scene, camera)
    }
    const animate = () => {
      raf = requestAnimationFrame(animate)
      step()
    }
    animate()
    // fallback: when rAF is suspended (tab hidden / pane occluded) keep the
    // morph progressing so the note never freezes mid-animation
    const fallback = setInterval(() => {
      if (performance.now() - lastStep > 400) step()
    }, 250)
    // deterministic hook for automated tests (harmless in production)
    window.__paperStep = (n = 1) => { for (let i = 0; i < n; i++) step() }
    sceneRef.current = { renderer }

    return () => {
      clearInterval(fallback)
      cancelAnimationFrame(raf)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      tex.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [visible])

  // phase -> morph target
  useEffect(() => {
    const st = stateRef.current
    if (phase === 'unfolding') {
      st.from = st.c
      st.target = 0
      st.p = 0
    }
    if (phase === 'crunching') {
      st.from = st.c
      st.target = 1
      st.p = 0
    }
    if (phase === 'parking') {
      const t = setTimeout(() => setPhase('ball'), 600)
      return () => clearTimeout(t)
    }
  }, [phase])

  if (phase === 'hidden') return null

  const isBall = phase === 'ball' || phase === 'parking'
  const lightShadow = dayMode
    ? 'drop-shadow(0 16px 22px rgba(60,40,10,0.35))'
    : 'drop-shadow(0 16px 26px rgba(0,0,0,0.6))'

  return (
    <>
      {phase === 'open' && (
        <div
          onClick={() => setPhase('crunching')}
          style={{ position: 'fixed', inset: 0, zIndex: 4790 }}
        />
      )}
      <div
        onClick={
          isBall && phase === 'ball'
            ? () => {
                useStore.getState().setHovered(null)
                setPhase('unfolding')
              }
            : undefined
        }
        onMouseEnter={isBall && phase === 'ball' ? () => useStore.getState().setHovered('paper') : undefined}
        onMouseLeave={isBall && phase === 'ball' ? () => useStore.getState().setHovered(null) : undefined}
        style={{
          position: 'fixed',
          zIndex: 4800,
          left: '50%',
          top: '50%',
          width: 'min(62vw, 760px)',
          aspectRatio: '4 / 3',
          transformOrigin: '0 0',
          // single positioning scheme, transform-only animation: interpolates
          // smoothly with no auto-value jumps and no canvas reflow
          transform: isBall
            ? 'translate(calc(50vw - 170px), calc(50vh - 135px)) scale(0.2)'
            : 'translate(-50%, -50%) scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.45, 0, 0.25, 1)',
          filter: lightShadow,
          cursor: 'none',
          pointerEvents: isBall && phase === 'ball' ? 'auto' : 'none',
        }}
      >
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
        {/* clicking anywhere on the paper crumples it; the social links sit on
            top and stop propagation. Hitboxes are in screen space over the
            projected plane (the paper fills ~73% of the canvas, centered). */}
        {phase === 'open' && (
          <div
            onClick={() => setPhase('crunching')}
            aria-label="crumple"
            role="button"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'auto', cursor: 'none' }}
          >
            <a href="https://github.com/bscsaki" target="_blank" rel="noreferrer" aria-label="github"
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', left: '21%', top: '68%', width: '10%', height: '10%' }} />
            <a href="https://www.linkedin.com/in/batalasofia/" target="_blank" rel="noreferrer" aria-label="linkedin"
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', left: '32.5%', top: '68%', width: '10%', height: '10%' }} />
            <a href="mailto:sofia@sofiabatala.com" aria-label="email"
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', left: '44%', top: '68%', width: '9%', height: '10%' }} />
            <a href="https://medium.com/@bscsaki" target="_blank" rel="noreferrer" aria-label="medium"
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', left: '54.5%', top: '68%', width: '11%', height: '10%' }} />
          </div>
        )}
      </div>
    </>
  )
}
