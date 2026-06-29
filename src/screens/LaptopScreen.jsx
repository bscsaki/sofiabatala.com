import ResumePage from './ResumePage'
import ConferencesPage from './ConferencesPage'
import useStore from '../store/useStore'

const ICONS = [
  { id: 'resume', label: 'Resume', icon: '/icons/resume.jpg' },
  { id: 'projects', label: 'Projects', icon: '/icons/projects.jpg' },
  { id: 'conferences', label: 'Conferences', icon: '/icons/conferences.jpg' },
]

function ProjectsPage() {
  return <div style={{ padding: 40, fontSize: 24 }}>Project contents coming soon.</div>
}

export default function LaptopScreen() {
  const openApp = useStore((s) => s.openApp)
  const setOpenApp = useStore((s) => s.setOpenApp)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0d0d12',
        color: '#f5f5f5',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {openApp && (
        <button
          onClick={() => setOpenApp(null)}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            background: openApp === 'resume' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            color: openApp === 'resume' ? '#000' : '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          ← Desktop
        </button>
      )}

      {!openApp && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: 32,
          }}
        >
          {ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => setOpenApp(icon.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                width: 130,
              }}
            >
              <img src={icon.icon} alt={icon.label} style={{ width: 80, height: 80 }} />
              <div style={{ fontSize: 16 }}>{icon.label}</div>
            </button>
          ))}
        </div>
      )}

      {openApp === 'resume' && <ResumePage />}
      {openApp === 'projects' && <ProjectsPage />}
      {openApp === 'conferences' && <ConferencesPage />}
    </div>
  )
}
