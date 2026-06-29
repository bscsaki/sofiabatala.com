const serif = "'Georgia', 'Times New Roman', serif"

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          fontVariant: 'small-caps',
          fontSize: 16,
          fontWeight: 'bold',
          borderBottom: '1px solid #000',
          paddingBottom: 2,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function Heading({ left, right, subLeft, subRight }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold', fontSize: 13.5 }}>{left}</span>
        <span style={{ fontSize: 13 }}>{right}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontStyle: 'italic', fontSize: 12.5 }}>{subLeft}</span>
        <span style={{ fontStyle: 'italic', fontSize: 12.5 }}>{subRight}</span>
      </div>
    </div>
  )
}

function ProjectHeading({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13 }}>{left}</span>
      <span style={{ fontSize: 13 }}>{right}</span>
    </div>
  )
}

function Bullets({ items }) {
  return (
    <ul style={{ margin: '0 0 10px 0', paddingLeft: 18 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 12.5, marginBottom: 3, lineHeight: 1.35 }}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function ResumePage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: '#fff',
        color: '#000',
        fontFamily: serif,
        padding: '50px 60px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ fontVariant: 'small-caps', fontSize: 30, fontWeight: 'bold' }}>
          Sofia Batala
        </div>
        <div style={{ fontSize: 12.5, marginTop: 4 }}>
          331-806-0095 &nbsp;|&nbsp;{' '}
          <a href="mailto:sofia@sofiabatala.com" style={{ color: '#000' }}>
            sofia@sofiabatala.com
          </a>{' '}
          &nbsp;|&nbsp;{' '}
          <a href="https://www.linkedin.com/in/batalasofia/" style={{ color: '#000' }}>
            linkedin.com/in/batalasofia
          </a>{' '}
          &nbsp;|&nbsp;{' '}
          <a href="https://github.com/bscsaki" style={{ color: '#000' }}>
            github.com/bscsaki
          </a>
        </div>
      </div>

      <Section title="Education">
        <Heading
          left="Elmhurst University"
          right="Elmhurst, IL"
          subLeft="Bachelor of Science in Computer Science, Minor in Spanish"
          subRight="Aug. 2022 – May 2026"
        />
        <Heading
          left="EdX & Columbia University"
          right="Online"
          subLeft="Cybersecurity Bootcamp Certificate, CompTIA Security+ Certificate"
          subRight="2024, 2026"
        />
      </Section>

      <Section title="Experience">
        <Heading
          left="Security Research Fellow"
          right="May 2026 – Present"
          subLeft="HackerSideKick"
          subRight="Chicago, IL"
        />
        <Bullets
          items={[
            'Conducting open-source vulnerability research by auditing GitHub repositories for security weaknesses, using AI-assisted code analysis to identify and triage potential attack surfaces across mixed-language codebases',
          ]}
        />

        <Heading
          left="Information Technology Support Specialist"
          right="Sep. 2025 – May 2026"
          subLeft="Elmhurst University"
          subRight="Elmhurst, IL"
        />
        <Bullets
          items={[
            'Sustained classroom and office system uptime across 200+ devices by diagnosing and resolving hardware and software failures',
            'Resolved hardware and software incidents for 800+ endpoint users by managing helpdesk tickets and delivering technical support, maintaining service continuity across academic and administrative departments',
            'Enhanced software performance and security by assisting with system upgrades, application installations, and device configurations',
          ]}
        />

        <Heading
          left="Cybersecurity Specialist Intern"
          right="Feb. 2025 – May 2025"
          subLeft="WallScott Solutions"
          subRight="Evanston, IL"
        />
        <Bullets
          items={[
            'Designed and developed phishing simulation templates with realistic social-engineering scenarios to assess employee susceptibility and support security awareness training initiatives',
            'Authored incident response runbooks documenting detection, containment, and resolution procedures for common security scenarios, providing repeatable guidance for future response efforts',
          ]}
        />
      </Section>

      <Section title="Projects">
        <ProjectHeading
          left={
            <>
              <b>sofiabatala.com (In Progress)</b> |{' '}
              <i>Three.js, GSAP, Vite, JavaScript, Blender</i>{' '}
              <a href="https://sofiabatala.com" style={{ color: '#000' }}>
                sofiabatala.com
              </a>
            </>
          }
          right="June 2026 – Present"
        />
        <Bullets
          items={[
            'Built a custom Vite pipeline with secure API integration, implementing credential isolation and environment-scoped key handling to prevent token exposure in a client-side WebGL app',
            'Engineered an immersive 3D portfolio using Three.js WebGL rendering pipelines and GSAP physics-based animations',
          ]}
        />

        <ProjectHeading
          left={
            <>
              <b>The Well</b> |{' '}
              <i>.NET MAUI, ASP.NET Core, C#, Blazor, PostgreSQL, JWT, EF Core</i>{' '}
              <a href="https://github.com/bscsaki/The-Well-App" style={{ color: '#000' }}>
                The-Well-App
              </a>
            </>
          }
          right="2026"
        />
        <Bullets
          items={[
            'Architected and secured a cross-platform habit-tracking app for 17+ research participants, building an ASP.NET Core API with JWT Bearer auth, AES-256 encryption, and HMAC-SHA256 hashing for PII protection',
            'Hardened the authentication layer against credential and brute-force attacks with BCrypt password hashing, OTP-based lockout after failed attempts, and per-IP rate limiting on login and password-reset endpoints',
            'Deployed a cloud-hosted PostgreSQL backend via Neon with EF Core 10, applying privacy-by-design and least-privilege access to protect research data across the SDLC',
          ]}
        />
      </Section>

      <Section title="Technical Skills">
        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
          <b>Security &amp; Detection</b>: Nessus/Tenable, Wireshark, Nmap
          <br />
          <b>Cloud &amp; Infrastructure</b>: Azure, Docker, PostgreSQL, Bash, PowerShell, Git
          <br />
          <b>Development</b>: Python, JavaScript, SQL, HTML/CSS, FastAPI, ASP.NET Core, C#
        </div>
      </Section>

      <Section title="Community & Professional Involvement">
        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
          <b>Cybersecurity Conference Volunteer (2024–Present)</b>: THOTCON, BSidesChicago, GrrCON, CypherCon, ChiBrrCon, BSides312, Hak4Kidz, GCIS, WiCyS Chicago, ISACA Chicago
          <br />
          <b>CTF participant (2026–Present)</b>: NCL Spring 2026, Tenable x WiCyS CTF, UIC Capture The Flame
        </div>
      </Section>
    </div>
  )
}
