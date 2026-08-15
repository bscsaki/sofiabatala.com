import { useEffect, useState } from 'react'
import useStore from '../store/useStore'

const PHRASES = [
  'Loading',
  'unlocking the door',
  'Setting up the table',
  'Setting up the scene',
  'Working on the ambience',
  'Setting up the vibes',
  'Try turning the lamp on',
  'Try flipping through my journal',
  'Try opening my laptop',
  'Take a look at the picture',
]

// picked once per page load, at module scope so render stays pure
const PHRASE = PHRASES[Math.floor(Math.random() * PHRASES.length)]

// full-screen cover while the room loads: one random phrase, centered, with
// its trailing dots bouncing until the scene is ready
export default function LoadingScreen() {
  const sceneReady = useStore((s) => s.sceneReady)
  const [gone, setGone] = useState(false)
  const [fading, setFading] = useState(false)
  const phrase = PHRASE

  useEffect(() => {
    if (!sceneReady) return
    // hold a beat so the screen never just flickers away
    const t1 = setTimeout(() => setFading(true), 500)
    const t2 = setTimeout(() => setGone(true), 1300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [sceneReady])

  if (gone) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9500,
        background: '#141a27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Helvetihand', sans-serif",
        color: '#e8dcc2',
        fontSize: 'clamp(22px, 3vw, 34px)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease',
        pointerEvents: fading ? 'none' : 'auto',
        cursor: 'none',
      }}
    >
      <span>{phrase}</span>
      <span aria-hidden style={{ display: 'inline-flex', marginLeft: 4 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              animation: `loading-dot-bounce 1.1s ease-in-out ${i * 0.18}s infinite`,
            }}
          >
            .
          </span>
        ))}
      </span>
    </div>
  )
}
