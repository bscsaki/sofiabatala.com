const BASE = '/icons/conferences'

const CONFERENCES = [
  { date: 'Apr 2025', name: 'CTF', logo: `${BASE}/ctf1.png`, status: 'Attended' },
  { date: 'May 2025', name: 'THOTCON', logo: `${BASE}/thocon.png`, status: 'Volunteered' },
  { date: 'May 2025', name: 'BSides 312', logo: `${BASE}/bsides312.png`, status: 'Attended' },
  { date: 'Jun 2025', name: 'Hak4Kidz', logo: `${BASE}/hak4kidz.png`, status: 'Volunteered' },
  { date: 'Sep 2025', name: 'BlueTeamCon', logo: `${BASE}/blueteamcon.png`, status: 'Attended' },
  { date: 'Oct 2025', name: 'GrrCON', logo: `${BASE}/grrcon.png`, status: 'Volunteered' },
  { date: 'Oct 2025', name: 'BSides Chicago', logo: `${BASE}/bsideschicago.png`, status: 'Volunteered' },
  { date: 'Nov 2025', name: 'GCSI', logo: `${BASE}/gcsi.png`, status: 'Volunteered' },
  { date: 'Feb 2026', name: 'ChiBrrCon', logo: `${BASE}/chibrrcon.png`, status: 'Volunteered' },
  { date: 'Feb 2026', name: 'BSides Seattle', logo: `${BASE}/bsidesseattle.png`, status: 'Attended' },
  { date: 'Mar 2026', name: 'WiCyS', logo: `${BASE}/wicys.png`, status: 'Attended' },
  { date: 'Apr 2026', name: 'CypherCon', logo: `${BASE}/cyphercon.png`, status: 'Volunteered' },
  { date: 'Apr 2026', name: 'CTF', logo: `${BASE}/ctf2.png`, status: 'Volunteered' },
  { date: 'Apr 2026', name: 'GCSI', logo: `${BASE}/gcsi.png`, status: 'Volunteered' },
  { date: 'May 2026', name: 'BSides 312', logo: `${BASE}/bsides312.png`, status: 'Volunteered' },
  { date: 'May 2026', name: 'BSides Detroit', logo: `${BASE}/bsidesdetroit.png`, status: 'Attended' },
  { date: 'Jun 2026', name: 'SecretCon', logo: `${BASE}/secretcon.png`, status: 'Attended' },
  { date: 'Jun 2026', name: 'Hak4Kidz', logo: `${BASE}/hak4kidz.png`, status: 'Volunteered' },
  { date: 'Aug 2026', name: 'Black Hat', logo: `${BASE}/blackhat.png`, status: 'Coming Up' },
  { date: 'Aug 2026', name: 'DEF CON', logo: `${BASE}/defcon.png`, status: 'Coming Up' },
  { date: 'Sep 2026', name: 'BlueTeamCon', logo: `${BASE}/blueteamcon.png`, status: 'Coming Up' },
]

export default function ConferencesPage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#d8d2b8',
        color: '#2a2a22',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: 32,
        paddingBottom: 56,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h2 style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: 22 }}>Conferences</h2>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 36, overflowX: 'auto', maxWidth: '100%', paddingBottom: 24, boxSizing: 'border-box' }}>
        {CONFERENCES.map((conf, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 150,
              opacity: conf.status === 'Coming Up' ? 0.6 : 1,
            }}
          >
            <img src={conf.logo} alt={conf.name} style={{ width: 160, height: 160, objectFit: 'contain' }} />
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 10, textAlign: 'center' }}>{conf.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{conf.date}</div>
            <div style={{ fontSize: 14, fontStyle: 'italic', marginTop: 2 }}>{conf.status}</div>
          </div>
        ))}
      </div>

      <p style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: '90%', textAlign: 'center', fontSize: 11, opacity: 0.7 }}>
        **Logos are property of their respective owners and are used here solely to reference events attended or volunteered at.
      </p>
    </div>
  )
}
