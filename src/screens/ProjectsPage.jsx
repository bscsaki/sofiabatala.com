import { useState } from 'react'
import DAY_LINKS from '../config/dayLinks'

// day 0 is the series README, then days 1-33
const DAYS = Array.from({ length: 34 }, (_, i) => i)

function DaysGrid({ onBack }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        padding: '72px 40px 40px',
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 16,
          left: 120,
          zIndex: 10,
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '6px 14px',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        ← Projects
      </button>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontFamily: "'Helvetihand', sans-serif" }}>
        33 Days of Certified Vibe Hacker
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 14, opacity: 0.75, maxWidth: 760, lineHeight: 1.5 }}>
        Hacker Sidekick&apos;s Certified Vibe Hacker Workshop is a CTF-style challenge, one
        problem a day for 33 days. I write up how I actually solved each one, reaching for the
        AI only when I&apos;m genuinely stuck &mdash; for questions and explanations, never for
        finished answers. The point is to slow down and understand <i>how</i> a problem gets
        solved instead of racing to a flag, so it doubles as a beginner-friendly way to learn
        the fundamentals without racking up cognitive debt. Start at Day 0.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 18,
        }}
      >
        {DAYS.map((day) => {
          const href = DAY_LINKS[day]
          const card = (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity: href ? 1 : 0.55,
              }}
            >
              <img
                src={`/projects/33-days/day-${String(day).padStart(2, '0')}.png`}
                alt={`Day ${day}`}
                style={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  objectFit: 'cover',
                  borderRadius: 8,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
                }}
              />
              <div style={{ fontSize: 13, fontFamily: "'Helvetihand', sans-serif" }}>
                {href ? `Day ${day}` : `Day ${day} — coming soon`}
              </div>
            </div>
          )
          return href ? (
            <a key={day} href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              {card}
            </a>
          ) : (
            <div key={day}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [openFolder, setOpenFolder] = useState(null)

  if (openFolder === '33-days') {
    return <DaysGrid onBack={() => setOpenFolder(null)} />
  }

  const tileStyle = {
    background: 'none',
    border: 'none',
    color: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    width: 190,
    textDecoration: 'none',
  }
  const imgStyle = {
    width: 120,
    aspectRatio: '3 / 4',
    objectFit: 'cover',
    borderRadius: 8,
    boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
  }

  return (
    <div style={{ padding: '80px 48px 40px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 22, fontFamily: "'Helvetihand', sans-serif" }}>Projects</h2>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <button onClick={() => setOpenFolder('33-days')} style={tileStyle}>
          <img src="/projects/33-days/cover.png" alt="33 Days of Certified Vibe Hacker" style={imgStyle} />
          <div style={{ fontSize: 15, lineHeight: 1.35, textAlign: 'center' }}>
            33 Days of Certified Vibe Hacker
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>by Hacker Sidekick · 33 articles</div>
          </div>
        </button>

        <a
          href="https://github.com/bscsaki/The-Well-App"
          target="_blank"
          rel="noreferrer"
          style={tileStyle}
        >
          <img
            src="/images/sleepwell_logo.png"
            alt="The Well"
            style={{ ...imgStyle, objectFit: 'contain', background: 'rgba(255,255,255,0.04)' }}
          />
          <div style={{ fontSize: 15, lineHeight: 1.35, textAlign: 'center' }}>
            The Well
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>habit-tracking app · GitHub</div>
          </div>
        </a>
      </div>
    </div>
  )
}
