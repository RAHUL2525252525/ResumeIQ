const wrap = {
  width: 700,
  minHeight: 900,
  background: '#fff',
  padding: 48,
  boxSizing: 'border-box',
  fontFamily: 'Georgia, serif',
  color: '#172033',
  fontSize: 13,
  lineHeight: 1.5,
  boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
  border: '1px solid #e2e8f0',
}

export default function ResumePreview({ template, data, previewRef }) {
  const Template = template === 'modern-professional' ? ModernProfessional : ClassicATS
  return (
    <div ref={previewRef} style={wrap} id="resume-preview-sheet">
      <Template data={data} />
    </div>
  )
}

function ClassicATS({ data }) {
  const c = data.contact || {}

  return (
    <div>
      <h1
        style={{
          fontSize: 22,
          margin: '0 0 4px',
          fontFamily: 'Georgia, serif',
          color: '#0f172a',
          letterSpacing: '-0.2px',
        }}
      >
        {c.name || 'Your Name'}
      </h1>

      <p
        style={{
          margin: '0 0 18px',
          fontSize: 12,
          color: '#64748b',
        }}
      >
        {[c.email, c.phone, c.location, c.linkedin].filter(Boolean).join('  |  ')}
      </p>

      {data.summary && (
        <Section title="Summary">
          <p style={{ margin: 0 }}>{data.summary}</p>
        </Section>
      )}

      {data.experience?.length > 0 && (
        <Section title="Experience">
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  color: '#172033',
                }}
              >
                <span>
                  {exp.title} — {exp.company}
                </span>

                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#64748b',
                  }}
                >
                  {exp.dates}
                </span>
              </div>

              <ul
                style={{
                  margin: '4px 0 0',
                  paddingLeft: 18,
                }}
              >
                {(exp.bullets || [])
                  .filter(Boolean)
                  .map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {data.education?.length > 0 && (
        <Section title="Education">
          {data.education.map((ed, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span>{ed.degree}, {ed.school}</span>

              <span style={{ color: '#64748b' }}>
                {ed.dates}
              </span>
            </div>
          ))}
        </Section>
      )}

      {data.skills?.length > 0 && (
        <Section title="Skills">
          <p style={{ margin: 0 }}>
            {data.skills.join(', ')}
          </p>
        </Section>
      )}
    </div>
  )
}

function ModernProfessional({ data }) {
  const c = data.contact || {}

  return (
    <div>
      <div
        style={{
          borderBottom: '3px solid #2563eb',
          paddingBottom: 14,
          marginBottom: 18,
        }}
      >
        <h1
          style={{
            fontSize: 26,
            margin: '0 0 4px',
            fontFamily: 'Georgia, serif',
            color: '#0f172a',
            letterSpacing: '-0.3px',
          }}
        >
          {c.name || 'Your Name'}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: '#64748b',
          }}
        >
          {[c.email, c.phone, c.location, c.linkedin]
            .filter(Boolean)
            .join('   ·   ')}
        </p>
      </div>

      {data.summary && (
        <div
          style={{
            marginBottom: 18,
            fontStyle: 'italic',
            color: '#475569',
          }}
        >
          {data.summary}
        </div>
      )}

      {data.experience?.length > 0 && (
        <Section title="Experience" accent>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: '#172033',
                }}
              >
                {exp.title}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  marginBottom: 4,
                }}
              >
                {exp.company} · {exp.dates}
              </div>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                }}
              >
                {(exp.bullets || [])
                  .filter(Boolean)
                  .map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
      >
        {data.education?.length > 0 && (
          <Section title="Education" accent>
            {data.education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div
                  style={{
                    fontWeight: 'bold',
                    color: '#172033',
                  }}
                >
                  {ed.degree}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#64748b',
                  }}
                >
                  {ed.school} · {ed.dates}
                </div>
              </div>
            ))}
          </Section>
        )}

        {data.skills?.length > 0 && (
          <Section title="Skills" accent>
            <p style={{ margin: 0 }}>
              {data.skills.join(' · ')}
            </p>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2
        style={{
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 8,
          color: accent ? '#2563eb' : '#172033',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: 5,
          fontWeight: 700,
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  )
}