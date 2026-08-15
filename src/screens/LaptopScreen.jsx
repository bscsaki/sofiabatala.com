import ResumePage from './ResumePage'
import ConferencesPage from './ConferencesPage'
import ProjectsPage from './ProjectsPage'
import useStore from '../store/useStore'

const ICONS = [
  { id: 'resume', label: 'Resume', icon: '/icons/resume.jpg' },
  { id: 'projects', label: 'Projects', icon: '/icons/projects.jpg' },
  { id: 'conferences', label: 'Conferences', icon: '/icons/conferences.jpg' },
]

// desktop shortcuts to my profiles, laid out horizontally beside Resume.
// These are full-bleed badge logos, so they're rendered smaller than the
// 80px app-icon slot (zoomed out, never cropped) and given rounded corners
// so the square ones match the badges that already have them.
// medium_icon.png is the supplied logo with its empty white margin trimmed
// away - the badge itself is untouched.
const SOCIAL_ICON = 58
const SOCIALS = [
  { id: 'medium', label: 'Medium', icon: '/images/medium_icon.png', href: 'https://medium.com/@bscsaki' },
  { id: 'github', label: 'GitHub', icon: '/images/github_logo.png', href: 'https://github.com/bscsaki' },
  { id: 'linkedin', label: 'LinkedIn', icon: '/images/linkedin_logo.png', href: 'https://www.linkedin.com/in/batalasofia/' },
]

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
        <>
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

          {/* profile shortcuts: top row, starting right beside the Resume icon */}
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 32 + 130 + 24,
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#f5f5f5',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  width: 130,
                }}
              >
                <span
                  style={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={s.icon}
                    alt={s.label}
                    style={{
                      width: SOCIAL_ICON,
                      height: SOCIAL_ICON,
                      objectFit: 'contain',
                      borderRadius: 12,
                    }}
                  />
                </span>
                <div style={{ fontSize: 16 }}>{s.label}</div>
              </a>
            ))}
          </div>
        </>
      )}

      {openApp === 'resume' && <ResumePage />}
      {openApp === 'projects' && <ProjectsPage />}
      {openApp === 'conferences' && <ConferencesPage />}
    </div>
  )
}
