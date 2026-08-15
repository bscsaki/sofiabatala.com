import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Model } from './components/putall'
import CameraController from './components/CameraController'
import ErrorBoundary from './ErrorBoundary'
import LaptopScreen from './screens/LaptopScreen'
import PaperNote from './components/PaperNote'
import LoadingScreen from './components/LoadingScreen'
import useStore from './store/useStore'

const PAGE_MAX = 12
const DEBUG_MIN = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('min')

export default function App() {
  const dotRef = useRef()
  const labelRef = useRef()
  const hovered = useStore((s) => s.hovered)
  const viewState = useStore((s) => s.viewState)
  const isAnimating = useStore((s) => s.isAnimating)
  const openApp = useStore((s) => s.openApp)
  const setView = useStore((s) => s.setView)
  const setOpenApp = useStore((s) => s.setOpenApp)
  const pageIndex = useStore((s) => s.pageIndex)
  const turnPage = useStore((s) => s.turnPage)
  const dayMode = useStore((s) => s.dayMode)
  const toggleDayMode = useStore((s) => s.toggleDayMode)
  const errRef = useRef()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleBack = () => {
    if (viewState === 'laptop' && openApp) {
      setOpenApp(null)
    } else {
      setView('overview')
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (errRef.current) {
        errRef.current.textContent = (e.error && e.error.stack) || e.message || String(e)
      }
    }
    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])

  useEffect(() => {
    const move = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      if (labelRef.current) {
        labelRef.current.style.left = e.clientX + 'px'
        labelRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleBack()
      if (e.key === 'ArrowRight' && viewState === 'notebook') turnPage(1)
      if (e.key === 'ArrowLeft' && viewState === 'notebook') turnPage(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewState])

  if (isMobile) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 24,
          fontFamily: "'Helvetihand', sans-serif",
          color: '#222',
        }}
      >
        Rotate your phone horizonaly or access from a laptop or desktop.
      </div>
    )
  }

  const labels = {
    laptop: 'Open laptop',
    notebook: 'Read my journal',
    frame: 'About me',
    lamp: 'Toggle lamp',
    horse: 'the trojan horse',
    head: 'Aphrodite (probably)',
    paper: '?',
  }

  const uiColor = dayMode ? '#1a1a1a' : '#fff'
  const uiBg = dayMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'

  return (
    <>
      <pre ref={errRef} style={{position:'fixed', top:0, left:0, color:'red', background:'white', zIndex:99999, fontSize:14, whiteSpace:'pre-wrap', maxWidth:'100vw'}} />
      <div
        id="cursor-dot"
        ref={dotRef}
        className={hovered ? 'hovered' : ''}
        style={hovered && dayMode ? { borderColor: '#1a1a1a' } : undefined}
      />
      <div
        id="hover-label"
        ref={labelRef}
        className={hovered ? 'visible' : ''}
        style={{ color: uiColor }}
      >
        {labels[hovered] || ''}
      </div>
      <LoadingScreen />
      <PaperNote dayMode={dayMode} />
      {viewState !== 'overview' && !openApp && (
        <button
          id="back-btn"
          onClick={handleBack}
        >
          ← Back
        </button>
      )}
      {viewState === 'overview' && !isAnimating && (
        <button
          onClick={toggleDayMode}
          style={{
            position: 'fixed',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4500,
            background: uiBg,
            color: uiColor,
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontFamily: "'Helvetihand', sans-serif",
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          {dayMode ? 'Night' : 'Day'}
        </button>
      )}
      {viewState === 'notebook' && !isAnimating && (
        <div
          style={{
            position: 'fixed',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4500,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: "'Helvetihand', sans-serif",
          }}
        >
          <button
            onClick={() => turnPage(-1)}
            disabled={pageIndex === 0}
            style={{
              background: uiBg,
              color: uiColor,
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontFamily: "'Helvetihand', sans-serif",
              fontSize: 18,
              cursor: 'pointer',
              opacity: pageIndex === 0 ? 0.35 : 1,
            }}
          >
            ← flip back
          </button>
          <span
            style={{
              color: uiColor,
              fontSize: 16,
              textShadow: dayMode ? 'none' : '0 1px 4px rgba(0,0,0,0.8)',
              minWidth: 70,
              textAlign: 'center',
            }}
          >
            {pageIndex === 0 ? 'page 1' : `pages ${pageIndex * 2}–${pageIndex * 2 + 1}`}
          </span>
          <button
            onClick={() => turnPage(1)}
            disabled={pageIndex === PAGE_MAX}
            style={{
              background: uiBg,
              color: uiColor,
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontFamily: "'Helvetihand', sans-serif",
              fontSize: 18,
              cursor: 'pointer',
              opacity: pageIndex === PAGE_MAX ? 0.35 : 1,
            }}
          >
            flip forward →
          </button>
        </div>
      )}
      {viewState === 'laptop' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 5000,
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: isAnimating ? 'none' : 'auto',
          }}
        >
          <LaptopScreen />
        </div>
      )}
      {viewState === 'frame' && (
        <div
          style={{
            position: 'fixed',
            top: '26%',
            right: '2%',
            zIndex: 4000,
            color: uiColor,
            fontFamily: "'Helvetihand', sans-serif",
            textShadow: dayMode ? 'none' : '0 1px 4px rgba(0,0,0,0.8)',
            // the desk's right edge projects at ~73.4% screen-x in the frame
            // view; keep the whole text block to the right of it
            width: 'min(280px, 22vw)',
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            Hi! I'm Sofia, a Security Research Fellow at Hacker Sidekick, a Chicago-based AI
            startup building tools for pentesters, where I hunt for CVEs in open-source
            codebases.
            <br /><br />
            Four years ago I moved from Greece to the U.S. to pursue my BS in Computer
            Science. Along the way I completed a Cybersecurity Bootcamp, earned my CompTIA
            Security+, and built hands-on experience by competing in CTFs and volunteering at
            conferences.
            <br /><br />
            I am currently studying for the CPTS by HTB, so if you have any advice let me know (:
            <br /><br />
            I'm actively seeking entry-level roles in application security, let's connect!
          </p>
        </div>
      )}
      <div style={{ width: '100vw', height: '100vh' }}>
        <ErrorBoundary>
          <Canvas
            camera={{ fov: 60, position: [1.796, 2.418, 4.725] }}
            onCreated={(state) => {
              window.__r3f = state
            }}
          >
            <color attach="background" args={[dayMode ? '#e3d2b8' : '#151b29']} />
            <fog attach="fog" args={[dayMode ? '#e3d2b8' : '#151b29', 9, 20]} />
            {/* LiS golden-hour grade by day, cool moonlit grade by night */}
            <ambientLight intensity={dayMode ? 0.85 : 0.3} color={dayMode ? '#ffe9cd' : '#8fa3c7'} />
            <hemisphereLight
              intensity={dayMode ? 0.4 : 0.2}
              color={dayMode ? '#ffdcae' : '#39496b'}
              groundColor={dayMode ? '#8a6a4a' : '#1c2233'}
            />
            {/* sun / moon coming in through the windows (from behind the sky plane) */}
            <directionalLight
              position={[1.2, 3.4, -3]}
              intensity={dayMode ? 2.3 : 0.5}
              color={dayMode ? '#ffc37e' : '#8fa8d8'}
            />
            {/* soft fill from the camera side so the room never goes fully black */}
            <directionalLight
              position={[3, 3, 5]}
              intensity={dayMode ? 0.75 : 0.35}
              color={dayMode ? '#ffe7c8' : '#aab8d8'}
            />
            <pointLight
              position={[1.7, 1.8, -1.3]}
              intensity={dayMode ? 2.6 : 0}
              distance={0}
              decay={0}
              color="#ffdca6"
            />
            {DEBUG_MIN ? (
              <mesh position={[1.7, 1.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#c084fc" />
              </mesh>
            ) : (
              <>
                <CameraController />
                <Model />
              </>
            )}
          </Canvas>
        </ErrorBoundary>
      </div>
    </>
  )
}
