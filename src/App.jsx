import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Model } from './components/putall'
import CameraController from './components/CameraController'
import ErrorBoundary from './ErrorBoundary'
import LaptopScreen from './screens/LaptopScreen'
import useStore from './store/useStore'

export default function App() {
  const dotRef = useRef()
  const labelRef = useRef()
  const hovered = useStore((s) => s.hovered)
  const viewState = useStore((s) => s.viewState)
  const isAnimating = useStore((s) => s.isAnimating)
  const openApp = useStore((s) => s.openApp)
  const setView = useStore((s) => s.setView)
  const setOpenApp = useStore((s) => s.setOpenApp)
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
          fontFamily: 'sans-serif',
          color: '#222',
        }}
      >
        Please access from a laptop or desktop.
      </div>
    )
  }

  const labels = {
    laptop: 'Open laptop',
    notebook: 'Book contents coming soon',
    frame: 'About me',
    lamp: 'Toggle lamp',
  }

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
        style={{ color: dayMode ? '#1a1a1a' : '#fff' }}
      >
        {labels[hovered] || ''}
      </div>
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
            background: dayMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
            color: dayMode ? '#1a1a1a' : '#fff',
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
            top: '30%',
            right: '6%',
            zIndex: 4000,
            color: dayMode ? '#1a1a1a' : '#fff',
            fontFamily: "'Helvetihand', sans-serif",
            textShadow: dayMode ? 'none' : '0 1px 4px rgba(0,0,0,0.8)',
            maxWidth: 320,
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
            I'm actively seeking entry-level roles in application security, let's connect!
          </p>
        </div>
      )}
      <div style={{ width: '100vw', height: '100vh' }}>
        <ErrorBoundary>
          <Canvas camera={{ fov: 60, position: [1.796, 2.418, 4.725] }}>
            <color attach="background" args={[dayMode ? '#d6d6d6' : '#b0b0b0']} />
            <ambientLight intensity={dayMode ? 1.2 : 0.6} />
            <hemisphereLight intensity={dayMode ? 0.3 : 0.15} groundColor="#444444" />
            <directionalLight position={[3, 3, 5]} intensity={dayMode ? 1.5 : 0.75} color="#ffffff" />
            <directionalLight position={[-3, 2, -3]} intensity={dayMode ? 0.8 : 0.4} color="#ffffff" />
            <pointLight position={[1.7, 1.8, -1.3]} intensity={dayMode ? 4 : 0} distance={0} decay={0} color="#ffffff" />
            <CameraController />
            <Model />
          </Canvas>
        </ErrorBoundary>
      </div>
    </>
  )
}
