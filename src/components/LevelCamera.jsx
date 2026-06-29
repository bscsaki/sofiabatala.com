import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function LevelCamera({ position, target, roll = 0 }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.up.set(0, 1, 0)
    camera.position.set(...position)
    camera.lookAt(new THREE.Vector3(...target))
    camera.rotateZ(roll)
  }, [])
  return null
}
