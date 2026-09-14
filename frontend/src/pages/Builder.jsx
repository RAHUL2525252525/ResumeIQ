import { useEffect, useRef, useState } from 'react'
import api from '../api/axios.js'
import ResumePreview from '../components/ResumePreview.jsx'

const EMPTY_DATA = {
  contact: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
  },
  summary: '',
  experience: [
    {
      title: '',
      company: '',
      dates: '',
      bullets: [''],
    },
  ],
  education: [
    {
      degree: '',
      school: '',
      dates: '',
    },
  ],
  skills: [],
}


/* =========================================================
   TEMPLATE FALLBACKS
========================================================= */

const TEMPLATE_FALLBACKS = [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    description: 'Clean and optimized for applicant tracking systems.',
    implemented: true,
    category: 'ATS',
    accent: 'dark',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with a polished professional look.',
    implemented: true,
    category: 'Professional',
    accent: 'blue',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium structure designed for experienced professionals.',
    implemented: true,
    category: 'Executive',
    accent: 'navy',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple typography-focused resume with maximum clarity.',
    implemented: true,
    category: 'Minimal',
    accent: 'slate',
  },
  {
    id: 'tech',
    name: 'Tech Professional',
    description: 'Modern technical resume designed for software roles.',
    implemented: true,
    category: 'Technology',
    accent: 'indigo',
  },
]


export default function Builder() {

  const [templates, setTemplates] = useState(TEMPLATE_FALLBACKS)
  const [template, setTemplate] = useState('classic-ats')

  const [data, setData] = useState(EMPTY_DATA)

  const [skillsInput, setSkillsInput] = useState('')

  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [zoom, setZoom] = useState(0.62)

  const previewRef = useRef(null)


  /* =========================================================
     LOAD TEMPLATES
  ========================================================= */

  useEffect(() => {

    api
      .get('/templates/')
      .then(({ data }) => {

        if (Array.isArray(data) && data.length > 0) {

          const apiTemplates = data.map((item) => ({
            ...item,
            category:
              item.category ||
              (item.id === 'classic-ats'
                ? 'ATS'
                : 'Professional'),
          }))

          /*
            Keep backend templates first.

            If backend currently has fewer than 5 templates,
            add local professional templates so the UI
            always provides at least 5 options.
          */

          const existingIds = new Set(
            apiTemplates.map((item) => item.id)
          )

          const missingTemplates = TEMPLATE_FALLBACKS.filter(
            (item) => !existingIds.has(item.id)
          )

          setTemplates([
            ...apiTemplates,
            ...missingTemplates,
          ])

        } else {

          setTemplates(TEMPLATE_FALLBACKS)

        }

      })
      .catch(() => {

        setTemplates(TEMPLATE_FALLBACKS)

      })

  }, [])


  /* =========================================================
     CONTACT
  ========================================================= */

  function updateContact(field, value) {

    setData((d) => ({
      ...d,
      contact: {
        ...d.contact,
        [field]: value,
      },
    }))

  }


  /* =========================================================
     EXPERIENCE
  ========================================================= */

  function updateExperience(i, field, value) {

    setData((d) => {

      const experience = [...d.experience]

      experience[i] = {
        ...experience[i],
        [field]: value,
      }

      return {
        ...d,
        experience,
      }

    })

  }


  function updateBullet(
    expIndex,
    bulletIndex,
    value
  ) {

    setData((d) => {

      const experience = [...d.experience]

      const bullets = [
        ...experience[expIndex].bullets,
      ]

      bullets[bulletIndex] = value

      experience[expIndex] = {
        ...experience[expIndex],
        bullets,
      }

      return {
        ...d,
        experience,
      }

    })

  }


  function addExperience() {

    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        {
          title: '',
          company: '',
          dates: '',
          bullets: [''],
        },
      ],
    }))

  }


  function addBullet(expIndex) {

    setData((d) => {

      const experience = [...d.experience]

      experience[expIndex] = {
        ...experience[expIndex],
        bullets: [
          ...experience[expIndex].bullets,
          '',
        ],
      }

      return {
        ...d,
        experience,
      }

    })

  }


  /* =========================================================
     EDUCATION
  ========================================================= */

  function updateEducation(i, field, value) {

    setData((d) => {

      const education = [...d.education]

      education[i] = {
        ...education[i],
        [field]: value,
      }

      return {
        ...d,
        education,
      }

    })

  }


  function addEducation() {

    setData((d) => ({
      ...d,
      education: [
        ...d.education,
        {
          degree: '',
          school: '',
          dates: '',
        },
      ],
    }))

  }


  /* =========================================================
     SKILLS
  ========================================================= */

  function applySkills() {

    setData((d) => ({
      ...d,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }))

  }


  /* =========================================================
     SAVE
  ========================================================= */

  async function save() {

    setSaving(true)

    try {

      await api.post('/builder-resumes/', {
        template,
        title:
          data.contact.name ||
          'My Resume',
        data,
      })

    } finally {

      setSaving(false)

    }

  }


  /* =========================================================
     PDF
  ========================================================= */

  async function downloadPdf() {

    setExporting(true)

    try {

      const html2pdf =
        (await import('html2pdf.js')).default

      await html2pdf()
        .set({
          filename:
            `${(
              data.contact.name ||
              'resume'
            ).replace(/\s+/g, '_')}.pdf`,

          margin: 0,

          html2canvas: {
            scale: 2,
          },
        })
        .from(previewRef.current)
        .save()

    } finally {

      setExporting(false)

    }

  }


  /* =========================================================
     TEMPLATE DATA
  ========================================================= */

  const selectedTemplate =
    templates.find(
      (t) => t.id === template
    ) || TEMPLATE_FALLBACKS[0]


  return (

    <div className="builder-page">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="builder-header">

        <div className="header-content">

          <div className="header-left">

            <div className="header-icon">

              <div className="header-icon-inner">
                R
              </div>

            </div>


            <div>

              <div className="eyebrow">
                RESUME WORKSPACE
              </div>

              <h1>
                Build your next
                <span> opportunity.</span>
              </h1>

              <p>
                Create a professional resume,
                optimize your content and export
                it when you're ready.
              </p>

            </div>

          </div>


          <div className="header-right">

            <div className="completion-card">

              <div className="completion-top">

                <span>
                  Resume progress
                </span>

                <strong>
                  {getCompletion(data)}%
                </strong>

              </div>

              <div className="progress-track">

                <div
                  className="progress-value"
                  style={{
                    width:
                      `${getCompletion(data)}%`,
                  }}
                />

              </div>

            </div>


            <div className="autosave-status">

              <span className="status-dot" />

              Autosave ready

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          TEMPLATE SECTION
      ===================================================== */}

      <section className="template-section">

        <div className="section-heading">

          <div className="section-title-wrap">

            <div className="section-number">
              01
            </div>

            <div>

              <div className="section-kicker">
                DESIGN
              </div>

              <h2>
                Choose your resume template
              </h2>

              <p>
                Select a professional layout that
                matches your career and target role.
              </p>

            </div>

          </div>


          <div className="template-count-box">

            <strong>
              {templates.filter(
                (t) => t.implemented !== false
              ).length}
            </strong>

            <span>
              templates
            </span>

          </div>

        </div>


        <div className="template-list">

          {templates.map((t, index) => (

            <button
              key={t.id || index}
              disabled={t.implemented === false}
              onClick={() => setTemplate(t.id)}
              className={`
                template-card
                ${template === t.id
                  ? 'template-active'
                  : ''}
                ${t.implemented === false
                  ? 'template-disabled'
                  : ''}
              `}
              title={t.description}
            >

              {/* MINI RESUME */}

              <div
                className={`
                  mini-resume
                  mini-${t.accent || 'blue'}
                `}
              >

                <div className="mini-top">

                  <div className="mini-name" />

                  <div className="mini-contact" />

                </div>


                <div className="mini-section">

                  <span className="mini-heading" />

                  <span className="mini-line wide" />

                  <span className="mini-line" />

                  <span className="mini-line medium" />

                </div>


                <div className="mini-section">

                  <span className="mini-heading" />

                  <span className="mini-line wide" />

                  <span className="mini-line" />

                  <span className="mini-line short" />

                </div>


                <div className="mini-section">

                  <span className="mini-heading" />

                  <div className="mini-skills">

                    <i />
                    <i />
                    <i />
                    <i />

                  </div>

                </div>

              </div>


              {/* TEMPLATE INFO */}

              <div className="template-info">

                <div className="template-title-row">

                  <strong>
                    {t.name}
                  </strong>

                  {t.implemented === false && (

                    <span className="soon-badge">
                      SOON
                    </span>

                  )}

                </div>


                <div className="template-meta">

                  <span>
                    {t.category ||
                      'Professional'}
                  </span>

                  <span className="meta-dot">
                    •
                  </span>

                  <span>
                    {t.implemented === false
                      ? 'Coming soon'
                      : 'Ready to use'}
                  </span>

                </div>

              </div>


              {template === t.id && (

                <div className="selected-template">

                  <span>
                    ✓
                  </span>

                </div>

              )}

            </button>

          ))}

        </div>

      </section>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <main className="builder-workspace">


        {/* ===================================================
            EDITOR
        =================================================== */}

        <section className="editor-panel">

          <div className="editor-topbar">

            <div>

              <span className="editor-label">
                RESUME CONTENT
              </span>

              <h2>
                Tell us about yourself
              </h2>

            </div>

            <div className="editor-template">

              <span>
                Template
              </span>

              <strong>
                {selectedTemplate.name}
              </strong>

            </div>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <FormSection
            number="02"
            title="Contact information"
            description="Add the details recruiters should use to contact you."
          >

            <Row2>

              <Input
                label="Full name"
                placeholder="Rahul S."
                value={data.contact.name}
                onChange={(v) =>
                  updateContact(
                    'name',
                    v
                  )
                }
              />

              <Input
                label="Location"
                placeholder="Bengaluru, Karnataka"
                value={data.contact.location}
                onChange={(v) =>
                  updateContact(
                    'location',
                    v
                  )
                }
              />

            </Row2>


            <Row2>

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={data.contact.email}
                onChange={(v) =>
                  updateContact(
                    'email',
                    v
                  )
                }
              />

              <Input
                label="Phone number"
                placeholder="+91 XXXXX XXXXX"
                value={data.contact.phone}
                onChange={(v) =>
                  updateContact(
                    'phone',
                    v
                  )
                }
              />

            </Row2>


            <Input
              label="LinkedIn / Portfolio"
              placeholder="https://linkedin.com/in/yourname"
              value={
                data.contact.linkedin
              }
              onChange={(v) =>
                updateContact(
                  'linkedin',
                  v
                )
              }
            />

          </FormSection>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <FormSection
            number="03"
            title="Professional summary"
            description="Introduce yourself with a concise summary focused on your strongest value."
          >

            <div className="textarea-wrapper">

              <textarea
                rows={5}
                value={data.summary}
                onChange={(e) =>
                  setData({
                    ...data,
                    summary:
                      e.target.value,
                  })
                }
                className="modern-textarea"
                placeholder="Example: Computer Science graduate with hands-on experience building full-stack applications using Java, Spring Boot, React and MySQL..."
              />

              <div className="textarea-footer">

                <span>
                  Keep it concise and role-focused.
                </span>

                <span>
                  {data.summary.length} characters
                </span>

              </div>

            </div>

          </FormSection>


          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <FormSection
            number="04"
            title="Experience"
            description="Show recruiters where you worked and the impact you created."
          >

            {data.experience.map(
              (exp, i) => (

                <div
                  className="experience-card"
                  key={i}
                >

                  <div className="experience-header">

                    <div className="experience-index">
                      {String(i + 1).padStart(
                        2,
                        '0'
                      )}
                    </div>


                    <div>

                      <strong>
                        Experience {i + 1}
                      </strong>

                      <span>
                        Professional experience
                      </span>

                    </div>

                  </div>


                  <Row2>

                    <Input
                      label="Job title"
                      placeholder="Software Developer"
                      value={
                        exp.title
                      }
                      onChange={(v) =>
                        updateExperience(
                          i,
                          'title',
                          v
                        )
                      }
                    />

                    <Input
                      label="Company"
                      placeholder="Company name"
                      value={
                        exp.company
                      }
                      onChange={(v) =>
                        updateExperience(
                          i,
                          'company',
                          v
                        )
                      }
                    />

                  </Row2>


                  <Input
                    label="Dates"
                    placeholder="Jan 2025 – Present"
                    value={
                      exp.dates
                    }
                    onChange={(v) =>
                      updateExperience(
                        i,
                        'dates',
                        v
                      )
                    }
                  />


                  <div className="bullet-section">

                    <div className="subsection-label">

                      <span className="subsection-icon">
                        ✦
                      </span>

                      Responsibilities &
                      achievements

                    </div>


                    {exp.bullets.map(
                      (b, j) => (

                        <div
                          className="bullet-input"
                          key={j}
                        >

                          <span className="bullet-number">
                            {j + 1}
                          </span>

                          <input
                            value={b}
                            onChange={(e) =>
                              updateBullet(
                                i,
                                j,
                                e.target.value
                              )
                            }
                            placeholder="Describe your responsibility or achievement..."
                          />

                        </div>

                      )
                    )}


                    <button
                      className="secondary-action"
                      onClick={() =>
                        addBullet(i)
                      }
                    >

                      <span className="plus-circle">
                        +
                      </span>

                      Add bullet point

                    </button>

                  </div>

                </div>

              )
            )}


            <button
              className="add-section-button"
              onClick={addExperience}
            >

              <span className="add-icon">
                +
              </span>


              <span className="add-copy">

                <strong>
                  Add another experience
                </strong>

                <small>
                  Add another position,
                  internship or project role
                </small>

              </span>


              <span className="action-arrow">
                →
              </span>

            </button>

          </FormSection>


          {/* =================================================
              EDUCATION
          ================================================= */}

          <FormSection
            number="05"
            title="Education"
            description="Add your academic qualifications and graduation details."
          >

            {data.education.map(
              (ed, i) => (

                <div
                  className="education-card"
                  key={i}
                >

                  <div className="education-icon">
                    <span>
                      E
                    </span>
                  </div>


                  <div className="education-fields">

                    <Row2>

                      <Input
                        label="Degree"
                        placeholder="B.E. Computer Science"
                        value={
                          ed.degree
                        }
                        onChange={(v) =>
                          updateEducation(
                            i,
                            'degree',
                            v
                          )
                        }
                      />

                      <Input
                        label="School / College"
                        placeholder="University / College"
                        value={
                          ed.school
                        }
                        onChange={(v) =>
                          updateEducation(
                            i,
                            'school',
                            v
                          )
                        }
                      />

                    </Row2>


                    <Input
                      label="Dates"
                      placeholder="2022 – 2026"
                      value={
                        ed.dates
                      }
                      onChange={(v) =>
                        updateEducation(
                          i,
                          'dates',
                          v
                        )
                      }
                    />

                  </div>

                </div>

              )
            )}


            <button
              className="secondary-add"
              onClick={addEducation}
            >

              <span>
                +
              </span>

              Add education

            </button>

          </FormSection>


          {/* =================================================
              SKILLS
          ================================================= */}

          <FormSection
            number="06"
            title="Skills"
            description="Add your technical and professional skills separated by commas."
          >

            <div className="skills-input-wrapper">

              <div className="skills-icon">
                #
              </div>

              <input
                placeholder="Java, Spring Boot, React, MySQL, Git..."
                value={skillsInput}
                onChange={(e) =>
                  setSkillsInput(
                    e.target.value
                  )
                }
                onBlur={applySkills}
              />

              <span className="skills-enter">
                Comma separated
              </span>

            </div>


            {data.skills.length > 0 && (

              <div className="skill-preview">

                {data.skills.map(
                  (skill, index) => (

                    <span key={index}>

                      <i>
                        ✓
                      </i>

                      {skill}

                    </span>

                  )
                )}

              </div>

            )}

          </FormSection>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="editor-actions">

            <button
              className="save-button"
              onClick={save}
              disabled={saving}
            >

              <span className="button-icon">

                {saving
                  ? '◌'
                  : '✓'}

              </span>

              <span>

                {saving
                  ? 'Saving resume...'
                  : 'Save resume'}

              </span>

            </button>


            <button
              className="download-button"
              onClick={downloadPdf}
              disabled={exporting}
            >

              <span className="button-icon">

                {exporting
                  ? '◌'
                  : '↓'}

              </span>

              <span>

                {exporting
                  ? 'Preparing PDF...'
                  : 'Download PDF'}

              </span>

            </button>

          </div>

        </section>


        {/* ===================================================
            PREVIEW
        =================================================== */}

        <aside className="preview-panel">


          <div className="preview-header">

            <div>

              <div className="preview-label">
                LIVE PREVIEW
              </div>

              <h2>
                Your resume
              </h2>

              <span className="preview-template-name">
                {selectedTemplate.name}
              </span>

            </div>


            <div className="preview-tools">

              <button
                onClick={() =>
                  setZoom(
                    Math.max(
                      0.35,
                      zoom - 0.05
                    )
                  )
                }
                aria-label="Zoom out"
              >
                −
              </button>

              <span>
                {Math.round(
                  zoom * 100
                )}%
              </span>

              <button
                onClick={() =>
                  setZoom(
                    Math.min(
                      0.85,
                      zoom + 0.05
                    )
                  )
                }
                aria-label="Zoom in"
              >
                +
              </button>

            </div>

          </div>


          <div className="preview-toolbar">

            <div className="preview-toolbar-left">

              <span className="live-indicator">
                <i />
                Live
              </span>

              <span>
                Updates as you type
              </span>

            </div>


            <button
              className="reset-zoom"
              onClick={() =>
                setZoom(0.62)
              }
            >
              Reset zoom
            </button>

          </div>


          <div className="preview-stage">

            <div className="preview-ruler top-ruler">

              <span>
                A4 PREVIEW
              </span>

            </div>


            <div className="preview-paper-wrapper">

              <div
                ref={previewRef}
                className="preview-paper"
                style={{
                  transform:
                    `scale(${zoom})`,
                }}
              >

                <ResumePreview
                  template={template}
                  data={data}
                  previewRef={previewRef}
                />

              </div>

            </div>

          </div>


          <div className="preview-footer">

            <div className="footer-tip-icon">
              ✓
            </div>


            <div className="footer-tip-copy">

              <strong>
                ATS-friendly format
              </strong>

              <span>
                Clean structure designed
                for recruiter readability
                and parsing.
              </span>

            </div>


            <div className="footer-status">
              <span />
              Ready
            </div>

          </div>

        </aside>

      </main>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        /* =====================================================
           PAGE
        ===================================================== */

        .builder-page {

          --navy-950: #071f45;
          --navy-900: #0a2b5e;
          --navy-800: #103b78;
          --navy-700: #164d91;

          --blue: #2563eb;
          --blue-light: #eaf2ff;
          --blue-soft: #f4f8ff;

          --text: #0f172a;
          --text-2: #334155;
          --muted: #64748b;
          --muted-light: #94a3b8;

          --border: #dce5f0;
          --border-light: #e9eef5;

          min-height: 100vh;

          padding: 26px 30px 70px;

          color: var(--text);

          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(37,99,235,.08),
              transparent 26%
            ),
            radial-gradient(
              circle at 90% 12%,
              rgba(10,43,94,.045),
              transparent 28%
            ),
            #f6f8fc;

          font-family: inherit;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .builder-header {

          max-width: 1500px;

          margin:
            0 auto 22px;
        }


        .header-content {

          min-height: 145px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 30px;

          padding: 27px 30px;

          border-radius: 20px;

          border:
            1px solid #d9e3ef;

          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #f8fbff 100%
            );

          box-shadow:
            0 12px 40px
            rgba(15,42,78,.065);
        }


        .header-left {

          display: flex;

          align-items: center;

          gap: 17px;
        }


        .header-icon {

          width: 57px;
          height: 57px;

          flex: 0 0 57px;

          display: grid;

          place-items: center;

          border-radius: 15px;

          background:
            linear-gradient(
              145deg,
              var(--navy-950),
              var(--navy-800)
            );

          box-shadow:
            0 9px 22px
            rgba(7,31,69,.20);
        }


        .header-icon-inner {

          width: 31px;
          height: 31px;

          display: grid;

          place-items: center;

          border:
            1px solid
            rgba(255,255,255,.25);

          border-radius: 9px;

          color: white;

          font-size: 13px;

          font-weight: 900;
        }


        .eyebrow {

          margin-bottom: 5px;

          color: #456b9e;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.8px;
        }


        .header-left h1 {

          margin: 0;

          color: var(--text);

          font-size: 27px;

          line-height: 1.15;

          letter-spacing: -.8px;
        }


        .header-left h1 span {

          color: var(--navy-800);
        }


        .header-left p {

          max-width: 600px;

          margin:
            7px 0 0;

          color: var(--muted);

          font-size: 12px;

          line-height: 1.5;
        }


        .header-right {

          display: flex;

          align-items: center;

          gap: 12px;
        }


        .completion-card {

          min-width: 165px;

          padding: 11px 13px;

          border:
            1px solid #dfe7f1;

          border-radius: 11px;

          background: white;
        }


        .completion-top {

          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 7px;
        }


        .completion-top span {

          color: var(--muted);

          font-size: 9px;

          font-weight: 700;
        }


        .completion-top strong {

          color: var(--navy-800);

          font-size: 11px;
        }


        .progress-track {

          width: 100%;

          height: 5px;

          overflow: hidden;

          border-radius: 20px;

          background: #edf2f7;
        }


        .progress-value {

          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              var(--navy-900),
              var(--blue)
            );

          transition:
            width .3s ease;
        }


        .autosave-status {

          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            9px 12px;

          border-radius: 999px;

          background: #f3f8ff;

          border:
            1px solid #d9e8fa;

          color: #42688f;

          font-size: 9px;

          font-weight: 800;

          white-space: nowrap;
        }


        .status-dot {

          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 3px #dcfce7;
        }


        /* =====================================================
           TEMPLATE SECTION
        ===================================================== */

        .template-section {

          max-width: 1500px;

          margin:
            0 auto 22px;

          padding: 23px;

          border:
            1px solid var(--border);

          border-radius: 18px;

          background: white;

          box-shadow:
            0 9px 32px
            rgba(15,42,78,.05);
        }


        .section-heading {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 18px;
        }


        .section-title-wrap {

          display: flex;

          align-items: center;

          gap: 12px;
        }


        .section-number {

          width: 38px;
          height: 38px;

          flex: 0 0 38px;

          display: grid;

          place-items: center;

          border-radius: 10px;

          background:
            var(--blue-light);

          border:
            1px solid #d7e6fb;

          color: var(--navy-800);

          font-size: 10px;

          font-weight: 900;
        }


        .section-kicker {

          margin-bottom: 2px;

          color: #6d85a0;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 1.2px;
        }


        .section-heading h2 {

          margin: 0;

          color: var(--text);

          font-size: 15px;
        }


        .section-heading p {

          margin:
            3px 0 0;

          color: var(--muted);

          font-size: 10px;
        }


        .template-count-box {

          display: flex;

          align-items: baseline;

          gap: 5px;

          padding:
            8px 11px;

          border:
            1px solid #e2e9f2;

          border-radius: 9px;

          background: #fafcff;
        }


        .template-count-box strong {

          color: var(--navy-800);

          font-size: 13px;
        }


        .template-count-box span {

          color: var(--muted);

          font-size: 9px;

          font-weight: 700;
        }


        /* =====================================================
           TEMPLATE LIST
        ===================================================== */

        .template-list {

          display: grid;

          grid-template-columns:
            repeat(
              5,
              minmax(0, 1fr)
            );

          gap: 11px;
        }


        .template-card {

          position: relative;

          min-width: 0;

          display: flex;

          flex-direction: column;

          padding: 10px;

          text-align: left;

          border:
            1px solid #dfe7f0;

          border-radius: 13px;

          background: #fbfcfe;

          cursor: pointer;

          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease,
            background .2s ease;

          font-family: inherit;
        }


        .template-card:hover:not(:disabled) {

          transform:
            translateY(-2px);

          border-color:
            #aac5e7;

          background: white;

          box-shadow:
            0 10px 25px
            rgba(15,52,95,.09);
        }


        .template-active {

          border-color:
            #245a9d !important;

          background:
            #f5f9ff !important;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08),
            0 12px 26px
            rgba(15,52,95,.08);
        }


        .template-disabled {

          opacity: .5;

          cursor: not-allowed;
        }


        /* =====================================================
           MINI RESUME
        ===================================================== */

        .mini-resume {

          position: relative;

          width: 100%;

          height: 132px;

          overflow: hidden;

          padding: 12px;

          border:
            1px solid #d9e2ed;

          border-radius: 7px;

          background: white;

          box-shadow:
            0 5px 12px
            rgba(15,42,78,.06);

          transition:
            transform .2s ease;
        }


        .template-card:hover
        .mini-resume {

          transform:
            scale(1.015);
        }


        .mini-top {

          padding-bottom: 9px;

          margin-bottom: 9px;

          border-bottom:
            1px solid #e7edf4;
        }


        .mini-name {

          width: 53%;

          height: 6px;

          margin-bottom: 5px;

          border-radius: 2px;

          background:
            var(--mini-accent, #163f76);
        }


        .mini-contact {

          width: 70%;

          height: 3px;

          border-radius: 2px;

          background: #d5dee9;
        }


        .mini-section {

          margin-bottom: 9px;
        }


        .mini-heading {

          display: block;

          width: 30%;

          height: 4px;

          margin-bottom: 5px;

          border-radius: 2px;

          background:
            var(--mini-accent, #163f76);
        }


        .mini-line {

          display: block;

          width: 84%;

          height: 3px;

          margin-bottom: 4px;

          border-radius: 2px;

          background: #e1e7ee;
        }


        .mini-line.wide {
          width: 94%;
        }


        .mini-line.medium {
          width: 72%;
        }


        .mini-line.short {
          width: 55%;
        }


        .mini-skills {

          display: flex;

          gap: 4px;
        }


        .mini-skills i {

          width: 20px;
          height: 7px;

          border-radius: 3px;

          background:
            #e5edf7;
        }


        .mini-dark {
          --mini-accent:
            #123a78;
        }


        .mini-blue {
          --mini-accent:
            #2563eb;
        }


        .mini-navy {
          --mini-accent:
            #0f2f63;
        }


        .mini-slate {
          --mini-accent:
            #475569;
        }


        .mini-indigo {
          --mini-accent:
            #4338ca;
        }


        .template-info {

          padding:
            10px 2px 2px;
        }


        .template-title-row {

          display: flex;

          align-items: center;

          gap: 6px;
        }


        .template-title-row strong {

          overflow: hidden;

          color: #1e3552;

          font-size: 11px;

          text-overflow: ellipsis;

          white-space: nowrap;
        }


        .template-meta {

          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: 4px;

          color: #8494a8;

          font-size: 8px;

          font-weight: 700;
        }


        .meta-dot {

          color: #bdc7d3;
        }


        .soon-badge {

          padding:
            2px 5px;

          border-radius: 4px;

          background: #edf1f5;

          color: #718096;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: .5px;
        }


        .selected-template {

          position: absolute;

          top: 7px;
          right: 7px;

          width: 22px;
          height: 22px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background:
            var(--navy-800);

          color: white;

          box-shadow:
            0 4px 9px
            rgba(15,47,99,.25);
        }


        .selected-template span {

          font-size: 10px;

          font-weight: 900;
        }


        /* =====================================================
           WORKSPACE
        ===================================================== */

        .builder-workspace {

          max-width: 1500px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            minmax(0, 1.02fr)
            minmax(450px, .98fr);

          gap: 22px;

          align-items: start;
        }


        /* =====================================================
           EDITOR
        ===================================================== */

        .editor-panel {

          min-width: 0;

          padding: 25px;

          border:
            1px solid var(--border);

          border-radius: 18px;

          background: white;

          box-shadow:
            0 10px 35px
            rgba(15,42,78,.055);
        }


        .editor-topbar {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          padding-bottom: 21px;

          margin-bottom: 22px;

          border-bottom:
            1px solid #e9eef4;
        }


        .editor-label {

          display: block;

          margin-bottom: 4px;

          color: #6b84a0;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 1.4px;
        }


        .editor-topbar h2 {

          margin: 0;

          color: var(--text);

          font-size: 19px;

          letter-spacing: -.3px;
        }


        .editor-template {

          display: flex;

          flex-direction: column;

          align-items: flex-end;

          gap: 3px;

          padding:
            8px 11px;

          border:
            1px solid #e0e8f2;

          border-radius: 9px;

          background: #f8fafd;
        }


        .editor-template span {

          color: #8a9aac;

          font-size: 7px;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: .7px;
        }


        .editor-template strong {

          color: var(--navy-800);

          font-size: 9px;
        }


        /* =====================================================
           FORM SECTIONS
        ===================================================== */

        .form-section {

          padding-bottom: 25px;

          margin-bottom: 25px;

          border-bottom:
            1px solid #e8edf3;
        }


        .form-section:last-of-type {

          margin-bottom: 0;
        }


        .form-section-header {

          display: flex;

          align-items: flex-start;

          gap: 10px;

          margin-bottom: 16px;
        }


        .form-section-number {

          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;

          place-items: center;

          border-radius: 8px;

          background:
            #eef4fb;

          border:
            1px solid #dce7f3;

          color:
            var(--navy-800);

          font-size: 9px;

          font-weight: 900;
        }


        .form-section-header h3 {

          margin: 0;

          color: #1b3453;

          font-size: 14px;
        }


        .form-section-header p {

          max-width: 600px;

          margin:
            3px 0 0;

          color: #8291a4;

          font-size: 9px;

          line-height: 1.5;
        }


        .form-section-content {

          display: flex;

          flex-direction: column;

          gap: 12px;
        }


        /* =====================================================
           INPUTS
        ===================================================== */

        .row-2 {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 11px;
        }


        .field {

          display: flex;

          flex-direction: column;

          gap: 5px;
        }


        .field label {

          color: #506681;

          font-size: 9px;

          font-weight: 800;
        }


        .modern-input,
        .modern-textarea {

          width: 100%;

          outline: none;

          border:
            1px solid #d6e0eb;

          background:
            #fbfcfe;

          color:
            #1d3553;

          border-radius: 9px;

          font-family: inherit;

          font-size: 11px;

          transition:
            border-color .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }


        .modern-input {

          height: 41px;

          padding:
            0 11px;
        }


        .modern-textarea {

          min-height: 120px;

          padding:
            11px;

          resize: vertical;

          line-height: 1.55;
        }


        .modern-input::placeholder,
        .modern-textarea::placeholder {

          color: #a6b3c2;
        }


        .modern-input:focus,
        .modern-textarea:focus {

          background: white;

          border-color:
            #477db8;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08);
        }


        .textarea-wrapper {

          position: relative;
        }


        .textarea-footer {

          position: absolute;

          left: 11px;
          right: 11px;
          bottom: 8px;

          display: flex;

          justify-content: space-between;

          pointer-events: none;

          color: #a1adbb;

          font-size: 7px;
        }


        /* =====================================================
           EXPERIENCE
        ===================================================== */

        .experience-card {

          padding: 16px;

          border:
            1px solid #dce5ef;

          border-radius: 12px;

          background:
            linear-gradient(
              145deg,
              #fbfdff,
              #f7fafe
            );
        }


        .experience-header {

          display: flex;

          align-items: center;

          gap: 9px;

          margin-bottom: 14px;
        }


        .experience-index {

          width: 31px;
          height: 31px;

          display: grid;

          place-items: center;

          border-radius: 8px;

          background:
            #e8f1fc;

          color:
            var(--navy-800);

          font-size: 9px;

          font-weight: 900;
        }


        .experience-header strong {

          display: block;

          color: #294564;

          font-size: 11px;
        }


        .experience-header span {

          display: block;

          margin-top: 2px;

          color: #8a99aa;

          font-size: 8px;
        }


        .bullet-section {

          padding-top: 13px;

          margin-top: 14px;

          border-top:
            1px dashed #d6e1ed;
        }


        .subsection-label {

          display: flex;

          align-items: center;

          gap: 5px;

          margin-bottom: 8px;

          color: #61758d;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: .5px;

          text-transform: uppercase;
        }


        .subsection-icon {

          color:
            var(--blue);
        }


        .bullet-input {

          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 7px;
        }


        .bullet-number {

          width: 23px;
          height: 23px;

          flex: 0 0 23px;

          display: grid;

          place-items: center;

          border-radius: 6px;

          background:
            #edf2f7;

          color: #72849a;

          font-size: 8px;

          font-weight: 900;
        }


        .bullet-input input {

          width: 100%;

          height: 36px;

          padding:
            0 10px;

          outline: none;

          border:
            1px solid #d9e3ed;

          border-radius: 8px;

          background: white;

          color: #294564;

          font-family: inherit;

          font-size: 10px;

          transition:
            border-color .18s ease,
            box-shadow .18s ease;
        }


        .bullet-input input::placeholder {

          color: #aab5c1;
        }


        .bullet-input input:focus {

          border-color:
            #477db8;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.07);
        }


        .secondary-action {

          display: inline-flex;

          align-items: center;

          gap: 5px;

          padding:
            5px 0;

          border: 0;

          background: transparent;

          color:
            var(--navy-800);

          cursor: pointer;

          font-family: inherit;

          font-size: 9px;

          font-weight: 800;
        }


        .plus-circle {

          width: 18px;
          height: 18px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background:
            #eaf2ff;

          color:
            var(--blue);

          font-size: 13px;
        }


        .add-section-button {

          width: 100%;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            12px;

          border:
            1px dashed #9ebbdc;

          border-radius: 10px;

          background:
            #f7faff;

          color:
            var(--navy-800);

          cursor: pointer;

          text-align: left;

          font-family: inherit;

          transition:
            border-color .18s ease,
            background .18s ease;
        }


        .add-section-button:hover {

          border-color:
            #477db8;

          background:
            #f0f6ff;
        }


        .add-icon {

          width: 30px;
          height: 30px;

          display: grid;

          place-items: center;

          border-radius: 8px;

          background:
            #dfebfa;

          color:
            var(--blue);

          font-size: 17px;
        }


        .add-copy strong {

          display: block;

          color: #315273;

          font-size: 10px;
        }


        .add-copy small {

          display: block;

          margin-top: 2px;

          color: #8b9aac;

          font-size: 8px;
        }


        .action-arrow {

          margin-left: auto;

          color:
            var(--navy-800);

          font-size: 15px;
        }


        /* =====================================================
           EDUCATION
        ===================================================== */

        .education-card {

          display: flex;

          gap: 11px;

          padding: 13px;

          border:
            1px solid #dce5ef;

          border-radius: 10px;

          background: #fbfdff;
        }


        .education-icon {

          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;

          place-items: center;

          border-radius: 8px;

          background:
            #eaf2fc;

          color:
            var(--navy-800);

          font-size: 10px;

          font-weight: 900;
        }


        .education-icon span {

          width: 21px;
          height: 21px;

          display: grid;

          place-items: center;

          border-radius: 6px;

          border:
            1px solid #cddded;
        }


        .education-fields {

          flex: 1;

          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 11px;
        }


        .secondary-add {

          align-self: flex-start;

          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding:
            8px 11px;

          border:
            1px solid #cbdbea;

          border-radius: 8px;

          background:
            #f5f9ff;

          color:
            var(--navy-800);

          cursor: pointer;

          font-family: inherit;

          font-size: 9px;

          font-weight: 800;
        }


        .secondary-add:hover {

          background:
            #eaf2ff;

          border-color:
            #a7c3e2;
        }


        /* =====================================================
           SKILLS
        ===================================================== */

        .skills-input-wrapper {

          height: 45px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            0 10px;

          border:
            1px solid #d6e0eb;

          border-radius: 10px;

          background:
            #fbfcfe;

          transition:
            border-color .18s ease,
            box-shadow .18s ease;
        }


        .skills-input-wrapper:focus-within {

          border-color:
            #477db8;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08);
        }


        .skills-icon {

          width: 27px;
          height: 27px;

          display: grid;

          place-items: center;

          border-radius: 7px;

          background:
            #e7f0fc;

          color:
            var(--navy-800);

          font-size: 12px;

          font-weight: 900;
        }


        .skills-input-wrapper input {

          flex: 1;

          width: 100%;

          border: 0;

          outline: 0;

          background: transparent;

          color: #294564;

          font-family: inherit;

          font-size: 10px;
        }


        .skills-input-wrapper input::placeholder {

          color: #a5b2c0;
        }


        .skills-enter {

          color: #9aa8b8;

          font-size: 7px;

          white-space: nowrap;
        }


        .skill-preview {

          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }


        .skill-preview span {

          display: inline-flex;

          align-items: center;

          gap: 4px;

          padding:
            5px 8px;

          border:
            1px solid #d2e2f4;

          border-radius: 6px;

          background:
            #edf5ff;

          color:
            #28578d;

          font-size: 8px;

          font-weight: 800;
        }


        .skill-preview i {

          font-style: normal;

          color:
            var(--blue);
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .editor-actions {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 9px;

          padding-top: 3px;
        }


        .save-button,
        .download-button {

          min-height: 46px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border-radius: 10px;

          cursor: pointer;

          font-family: inherit;

          font-size: 10px;

          font-weight: 900;

          transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }


        .save-button {

          border: 0;

          background:
            linear-gradient(
              135deg,
              #0c326b,
              #164d91
            );

          color: white;

          box-shadow:
            0 8px 19px
            rgba(10,43,94,.20);
        }


        .save-button:hover:not(:disabled) {

          transform:
            translateY(-1px);

          box-shadow:
            0 11px 25px
            rgba(10,43,94,.27);
        }


        .download-button {

          border:
            1px solid #cbdced;

          background:
            #edf4fd;

          color:
            #1c528c;
        }


        .download-button:hover:not(:disabled) {

          transform:
            translateY(-1px);

          background:
            #e3eefb;
        }


        .save-button:disabled,
        .download-button:disabled {

          opacity: .6;

          cursor: wait;
        }


        .button-icon {

          font-size: 15px;
        }


        /* =====================================================
           PREVIEW PANEL
        ===================================================== */

        .preview-panel {

          position: sticky;

          top: 20px;

          min-width: 0;

          overflow: hidden;

          border:
            1px solid #d5e1ee;

          border-radius: 18px;

          background:
            #edf3fa;

          box-shadow:
            0 14px 45px
            rgba(15,42,78,.10);
        }


        .preview-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          padding:
            18px 19px;

          background:
            rgba(255,255,255,.94);

          border-bottom:
            1px solid #dbe4ee;
        }


        .preview-label {

          color:
            #55779d;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: 1.4px;
        }


        .preview-header h2 {

          display: inline-block;

          margin:
            3px 7px 0 0;

          color:
            #233d5d;

          font-size: 16px;
        }


        .preview-template-name {

          color:
            #8a9bad;

          font-size: 8px;

          font-weight: 700;
        }


        .preview-tools {

          display: flex;

          align-items: center;

          gap: 3px;

          padding: 3px;

          border:
            1px solid #dce5ef;

          border-radius: 9px;

          background: #f8fafc;
        }


        .preview-tools button {

          width: 26px;
          height: 26px;

          display: grid;

          place-items: center;

          border: 0;

          border-radius: 6px;

          background: white;

          color:
            #3f5874;

          cursor: pointer;

          font-size: 15px;

          font-weight: 700;
        }


        .preview-tools button:hover {

          background:
            #eaf2fc;

          color:
            var(--navy-800);
        }


        .preview-tools span {

          min-width: 40px;

          text-align: center;

          color:
            #61758e;

          font-size: 8px;

          font-weight: 800;
        }


        /* =====================================================
           PREVIEW TOOLBAR
        ===================================================== */

        .preview-toolbar {

          min-height: 37px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding:
            0 16px;

          border-bottom:
            1px solid #dce5ee;

          background:
            #f7faff;
        }


        .preview-toolbar-left {

          display: flex;

          align-items: center;

          gap: 9px;

          color:
            #8a99a9;

          font-size: 8px;
        }


        .live-indicator {

          display: inline-flex;

          align-items: center;

          gap: 5px;

          padding:
            4px 7px;

          border-radius: 999px;

          background:
            #edf8f1;

          border:
            1px solid #d7efdf;

          color:
            #3d7751;

          font-size: 8px;

          font-weight: 900;
        }


        .live-indicator i {

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background:
            #22c55e;
        }


        .reset-zoom {

          border: 0;

          background: transparent;

          color:
            #57718d;

          cursor: pointer;

          font-family: inherit;

          font-size: 8px;

          font-weight: 800;
        }


        .reset-zoom:hover {

          color:
            var(--navy-800);
        }


        /* =====================================================
           PREVIEW STAGE
        ===================================================== */

        .preview-stage {

          position: relative;

          min-height: 690px;

          padding:
            27px 12px 30px;

          display: flex;

          justify-content: center;

          align-items: flex-start;

          overflow: auto;

          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(255,255,255,.9),
              transparent 55%
            ),
            #e9f0f7;
        }


        .preview-ruler {

          position: absolute;

          top: 9px;
          left: 14px;

          color:
            #91a1b2;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1px;
        }


        .preview-paper-wrapper {

          display: flex;

          justify-content: center;

          width: 100%;

          min-height: 620px;
        }


        .preview-paper {

          width: max-content;

          min-width: 794px;

          height: max-content;

          flex: 0 0 auto;

          transform-origin:
            top center;

          background: white;

          box-shadow:
            0 24px 60px
            rgba(21,45,73,.20);

          transition:
            transform .18s ease;
        }


        /* =====================================================
           PREVIEW FOOTER
        ===================================================== */

        .preview-footer {

          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            12px 15px;

          border-top:
            1px solid #dce5ee;

          background:
            #f9fbfd;
        }


        .footer-tip-icon {

          width: 27px;
          height: 27px;

          flex: 0 0 27px;

          display: grid;

          place-items: center;

          border-radius: 7px;

          background:
            #e5f0fc;

          color:
            #2e679f;

          font-size: 10px;

          font-weight: 900;
        }


        .footer-tip-copy {

          min-width: 0;
        }


        .footer-tip-copy strong {

          display: block;

          color:
            #42617e;

          font-size: 9px;
        }


        .footer-tip-copy span {

          display: block;

          margin-top: 2px;

          color:
            #91a0b0;

          font-size: 7px;
        }


        .footer-status {

          margin-left: auto;

          display: flex;

          align-items: center;

          gap: 5px;

          color:
            #64816f;

          font-size: 8px;

          font-weight: 800;
        }


        .footer-status span {

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background:
            #22c55e;
        }


        /* =====================================================
           SCROLLBAR
        ===================================================== */

        .template-list::-webkit-scrollbar,
        .preview-stage::-webkit-scrollbar {

          height: 5px;
          width: 5px;
        }


        .template-list::-webkit-scrollbar-track,
        .preview-stage::-webkit-scrollbar-track {

          background:
            #edf2f7;
        }


        .template-list::-webkit-scrollbar-thumb,
        .preview-stage::-webkit-scrollbar-thumb {

          background:
            #b8c8da;

          border-radius: 20px;
        }


        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width: 1250px) {

          .template-list {

            grid-template-columns:
              repeat(3, 1fr);
          }


          .builder-workspace {

            grid-template-columns:
              minmax(0, 1fr)
              minmax(390px, .85fr);
          }


          .editor-panel {

            padding: 21px;
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1050px) {

          .builder-page {

            padding:
              20px;
          }


          .builder-workspace {

            grid-template-columns: 1fr;
          }


          .preview-panel {

            position: relative;

            top: 0;
          }


          .preview-stage {

            min-height: 690px;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .builder-page {

            padding:
              10px 10px 30px;
          }


          .builder-header {

            margin-bottom: 11px;
          }


          .header-content {

            padding: 17px;

            border-radius: 15px;

            align-items: flex-start;
          }


          .header-left {

            gap: 11px;
          }


          .header-icon {

            width: 43px;
            height: 43px;

            flex-basis: 43px;

            border-radius: 11px;
          }


          .header-icon-inner {

            width: 25px;
            height: 25px;

            font-size: 10px;
          }


          .eyebrow {

            font-size: 7px;

            letter-spacing: 1.3px;
          }


          .header-left h1 {

            font-size: 20px;
          }


          .header-left p {

            font-size: 9px;

            line-height: 1.45;
          }


          .header-right {

            display: none;
          }


          /* TEMPLATE */


          .template-section {

            padding: 14px;

            margin-bottom: 11px;

            border-radius: 15px;
          }


          .section-heading {

            margin-bottom: 13px;
          }


          .section-title-wrap {

            align-items: flex-start;
          }


          .section-number {

            width: 31px;
            height: 31px;

            flex-basis: 31px;
          }


          .section-heading h2 {

            font-size: 13px;
          }


          .section-heading p {

            font-size: 8px;
          }


          .template-count-box {

            display: none;
          }


          .template-list {

            display: flex;

            overflow-x: auto;

            gap: 9px;

            padding-bottom: 5px;
          }


          .template-card {

            flex: 0 0 170px;
          }


          .mini-resume {

            height: 115px;

            padding: 9px;
          }


          .template-info {

            padding-top: 8px;
          }


          /* WORKSPACE */


          .builder-workspace {

            gap: 11px;
          }


          .editor-panel {

            padding: 15px;

            border-radius: 15px;
          }


          .editor-topbar {

            padding-bottom: 15px;

            margin-bottom: 17px;
          }


          .editor-topbar h2 {

            font-size: 16px;
          }


          .editor-template {

            display: none;
          }


          .form-section {

            padding-bottom: 20px;

            margin-bottom: 20px;
          }


          .form-section-header {

            margin-bottom: 12px;
          }


          .form-section-header h3 {

            font-size: 13px;
          }


          .form-section-header p {

            font-size: 8px;
          }


          .row-2 {

            grid-template-columns: 1fr;

            gap: 10px;
          }


          .experience-card {

            padding: 12px;
          }


          .education-card {

            padding: 10px;
          }


          .education-icon {

            display: none;
          }


          .skills-enter {

            display: none;
          }


          .editor-actions {

            grid-template-columns: 1fr;
          }


          /* PREVIEW */


          .preview-panel {

            border-radius: 15px;
          }


          .preview-header {

            padding:
              14px;
          }


          .preview-header h2 {

            font-size: 14px;
          }


          .preview-tools button {

            width: 24px;
            height: 24px;
          }


          .preview-toolbar {

            padding:
              0 12px;
          }


          .preview-toolbar-left > span:last-child {

            display: none;
          }


          .preview-stage {

            min-height: 500px;

            padding:
              24px 5px 20px;
          }


          .preview-paper {

            transform:
              scale(.42) !important;
          }


          .preview-paper-wrapper {

            min-height: 440px;
          }


          .preview-footer {

            padding:
              10px 12px;
          }


          .footer-status {

            display: none;
          }

        }


        /* =====================================================
           SMALL PHONE
        ===================================================== */

        @media (max-width: 420px) {

          .builder-page {

            padding:
              8px;
          }


          .header-content {

            padding:
              14px;
          }


          .header-left h1 {

            font-size: 18px;
          }


          .header-left p {

            font-size: 8px;
          }


          .template-section {

            padding:
              12px;
          }


          .template-card {

            flex-basis: 158px;
          }


          .mini-resume {

            height: 105px;
          }


          .editor-panel {

            padding:
              12px;
          }


          .modern-input {

            height: 40px;
          }


          .modern-textarea {

            min-height: 105px;
          }


          .textarea-footer {

            display: none;
          }


          .preview-stage {

            min-height: 450px;
          }


          .preview-paper {

            transform:
              scale(.37) !important;
          }

        }

      `}</style>

    </div>

  )
}


/* =========================================================
   COMPLETION
========================================================= */

function getCompletion(data) {

  let total = 0
  let completed = 0


  const contactFields = [
    data.contact.name,
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.linkedin,
  ]


  contactFields.forEach((value) => {

    total++

    if (value?.trim()) {
      completed++
    }

  })


  total++

  if (data.summary?.trim()) {
    completed++
  }


  data.experience.forEach((exp) => {

    total += 3

    if (exp.title?.trim()) {
      completed++
    }

    if (exp.company?.trim()) {
      completed++
    }

    if (exp.dates?.trim()) {
      completed++
    }


    exp.bullets.forEach((bullet) => {

      total++

      if (bullet?.trim()) {
        completed++
      }

    })

  })


  data.education.forEach((ed) => {

    total += 3

    if (ed.degree?.trim()) {
      completed++
    }

    if (ed.school?.trim()) {
      completed++
    }

    if (ed.dates?.trim()) {
      completed++
    }

  })


  total++

  if (data.skills.length > 0) {
    completed++
  }


  if (!total) {
    return 0
  }


  return Math.min(
    100,
    Math.round(
      (completed / total) * 100
    )
  )

}


/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  number,
  title,
  description,
  children,
}) {

  return (

    <div className="form-section">

      <div className="form-section-header">

        <div className="form-section-number">
          {number}
        </div>


        <div>

          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>

        </div>

      </div>


      <div className="form-section-content">
        {children}
      </div>

    </div>

  )
}


/* =========================================================
   ROW
========================================================= */

function Row2({ children }) {

  return (
    <div className="row-2">
      {children}
    </div>
  )

}


/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}) {

  return (

    <div className="field">

      <label>
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="modern-input"
      />

    </div>

  )

}