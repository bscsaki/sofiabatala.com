import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import cameraTargets from '../config/cameraTargets'
import useStore from '../store/useStore'

const tempPos = new THREE.Vector3()
const tempTarget = new THREE.Vector3()
const currentTarget = new THREE.Vector3()
const basePos = new THREE.Vector3(1.699, 2.418, 4.725)

export default function CameraController() {
  const { camera } = useThree()
  const viewState = useStore((s) => s.viewState)
  const setIsAnimating = useStore((s) => s.setIsAnimating)
  const arrived = useRef(false)
  const mouse = useRef({ x: 0, y: 0 })
  const parallax = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useFrame(() => {
    const t = cameraTargets[viewState] || cameraTargets.overview
    tempPos.set(...t.position)
    tempTarget.set(...t.target)

    // subtle mouse parallax in overview: the room gently tracks the cursor
    const wantX = viewState === 'overview' ? mouse.current.x * 0.16 : 0
    const wantY = viewState === 'overview' ? -mouse.current.y * 0.1 : 0
    parallax.current.x += (wantX - parallax.current.x) * 0.05
    parallax.current.y += (wantY - parallax.current.y) * 0.05

    camera.up.set(0, 1, 0)
    basePos.lerp(tempPos, 0.03)
    camera.position.set(
      basePos.x + parallax.current.x,
      basePos.y + parallax.current.y,
      basePos.z
    )
    currentTarget.lerp(tempTarget, 0.03)
    camera.lookAt(currentTarget)
    camera.rotateZ(t.roll || 0)

    const targetFov = t.fov || 60
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.1
      camera.updateProjectionMatrix()
    }

    // Self-correcting: compare against the store each frame rather than a local
    // "arrived" latch. A latch could leave isAnimating stuck true forever if the
    // flag was raised while the camera was already parked at the target, which
    // would silently block every click in the scene.
    const dist = basePos.distanceTo(tempPos)
    const animatingNow = useStore.getState().isAnimating
    if (dist < 0.01) {
      arrived.current = true
      if (animatingNow) setIsAnimating(false)
    } else {
      arrived.current = false
      if (!animatingNow) setIsAnimating(true)
    }
  })

  return null
}
