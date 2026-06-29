import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import cameraTargets from '../config/cameraTargets'
import useStore from '../store/useStore'

const tempPos = new THREE.Vector3()
const tempTarget = new THREE.Vector3()
const currentTarget = new THREE.Vector3()

export default function CameraController() {
  const { camera } = useThree()
  const viewState = useStore((s) => s.viewState)
  const setIsAnimating = useStore((s) => s.setIsAnimating)
  const arrived = useRef(false)

  useFrame(() => {
    const t = cameraTargets[viewState] || cameraTargets.overview
    tempPos.set(...t.position)
    tempTarget.set(...t.target)

    camera.up.set(0, 1, 0)
    camera.position.lerp(tempPos, 0.03)
    currentTarget.lerp(tempTarget, 0.03)
    camera.lookAt(currentTarget)
    camera.rotateZ(t.roll || 0)

    const targetFov = t.fov || 60
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.1
      camera.updateProjectionMatrix()
    }

    const dist = camera.position.distanceTo(tempPos)
    if (dist < 0.01) {
      if (!arrived.current) {
        arrived.current = true
        setIsAnimating(false)
      }
    } else {
      arrived.current = false
      setIsAnimating(true)
    }
  })

  return null
}
