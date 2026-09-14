import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import ScoreGauge from '../components/ScoreGauge.jsx'
import KeywordChips from '../components/KeywordChips.jsx'

export default function AnalyzeWorkspace() {
  const [resumes, setResumes] = useState([])
  const [jobs, setJobs] = useState([])
  const [resumeId, setResumeId] = useState('')
  const [jdId, setJdId] = useState('')

  const [jdDraft, setJdDraft] = useState({
    title: '',
    company: '',
    raw_text: ''
  })

  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')

  async function refreshLists() {
    const [r, j] = await Promise.all([
      api.get('/resumes/'),
      api.get('/job-descriptions/')
    ])

    setResumes(r.data.results || r.data)
    setJobs(j.data.results || j.data)
  }

  useEffect(() => {
    refreshLists()
  }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]

    if (!file) return

    setUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)

      const { data } = await api.post('/resumes/', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setResumes((prev) => [data, ...prev])
      setResumeId(String(data.id))
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Upload failed.'
      )
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveJd() {
    if (!jdDraft.raw_text.trim()) return

    const { data } = await api.post(
      '/job-descriptions/',
      jdDraft
    )

    setJobs((prev) => [data, ...prev])
    setJdId(String(data.id))

    setJdDraft({
      title: '',
      company: '',
      raw_text: ''
    })
  }

  async function handleAnalyze() {
    if (!resumeId || !jdId) {
      setError(
        'Choose a resume and a job description first.'
      )
      return
    }

    setAnalyzing(true)
    setError('')

    try {
      const { data } = await api.post('/analyze/', {
        resume_id: Number(resumeId),
        job_description_id: Number(jdId),
        run_ai_analysis: false
      })

      setAnalysis(data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Analysis failed.'
      )
    } finally {
      setAnalyzing(false)
    }
  }

  const selectedResume = resumes.find(
    (r) => String(r.id) === String(resumeId)
  )

  const selectedJob = jobs.find(
    (j) => String(j.id) === String(jdId)
  )

  return (
    <div className="analyze-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="workspace-hero">

        <div className="hero-left">

          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            SMART ATS ANALYZER
          </div>

          <h1>
            Know how your resume
            <span> matches the job.</span>
          </h1>

          <p>
            Upload your resume, select a job description,
            and get a detailed ATS compatibility report.
          </p>

          <div className="hero-meta">

            <div className="meta-item">
              <span className="meta-check">✓</span>
              Keyword matching
            </div>

            <div className="meta-item">
              <span className="meta-check">✓</span>
              Skills coverage
            </div>

            <div className="meta-item">
              <span className="meta-check">✓</span>
              ATS formatting
            </div>

          </div>

        </div>

        <div className="hero-visual">

          <div className="visual-orbit orbit-one"></div>
          <div className="visual-orbit orbit-two"></div>

          <div className="visual-card">

            <div className="visual-top">
              <span>ATS SCORE</span>
              <span className="live-dot"></span>
            </div>

            <div className="visual-score">
              86
              <small>/100</small>
            </div>

            <div className="visual-bar">
              <span></span>
            </div>

            <div className="visual-bottom">
              <span>Resume match</span>
              <strong>Strong</strong>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <section className="progress-card">

        <div
          className={`progress-step ${
            resumeId ? 'done' : 'current'
          }`}
        >

          <div className="progress-number">
            {resumeId ? '✓' : '01'}
          </div>

          <div className="progress-text">
            <strong>Resume</strong>
            <span>
              {resumeId
                ? 'Resume selected'
                : 'Upload or select'}
            </span>
          </div>

        </div>

        <div
          className={`progress-line ${
            resumeId ? 'filled' : ''
          }`}
        ></div>

        <div
          className={`progress-step ${
            jdId
              ? 'done'
              : resumeId
                ? 'current'
                : ''
          }`}
        >

          <div className="progress-number">
            {jdId ? '✓' : '02'}
          </div>

          <div className="progress-text">
            <strong>Job Description</strong>
            <span>
              {jdId
                ? 'Job selected'
                : 'Choose or create'}
            </span>
          </div>

        </div>

        <div
          className={`progress-line ${
            jdId ? 'filled' : ''
          }`}
        ></div>

        <div
          className={`progress-step ${
            analysis
              ? 'done'
              : resumeId && jdId
                ? 'current'
                : ''
          }`}
        >

          <div className="progress-number">
            {analysis ? '✓' : '03'}
          </div>

          <div className="progress-text">
            <strong>ATS Analysis</strong>
            <span>
              {analysis
                ? 'Analysis complete'
                : 'Run your scan'}
            </span>
          </div>

        </div>

      </section>


      {/* =====================================================
          INPUT CARDS
      ===================================================== */}

      <section className="workspace-grid">

        {/* RESUME */}

        <div className="workspace-card">

          <div className="workspace-card-header">

            <div className="card-heading">

              <div className="card-icon resume-card-icon">
                <span>CV</span>
              </div>

              <div>
                <span className="card-step">
                  STEP 01
                </span>

                <h2>
                  Your resume
                </h2>
              </div>

            </div>

            {resumeId && (
              <div className="selected-badge">
                <span>✓</span>
                Selected
              </div>
            )}

          </div>

          <p className="workspace-description">
            Select an existing resume or upload your
            latest PDF/DOCX resume.
          </p>


          <div className="form-group">

            <label>
              Saved resumes
            </label>

            <div className="select-wrapper">

              <select
                value={resumeId}
                onChange={(e) =>
                  setResumeId(e.target.value)
                }
              >

                <option value="">
                  Select a resume
                </option>

                {resumes.map((r) => (
                  <option
                    key={r.id}
                    value={r.id}
                  >
                    {r.title}
                  </option>
                ))}

              </select>

              <span className="select-chevron">
                ↓
              </span>

            </div>

          </div>


          {/* UPLOAD */}

          <label className="upload-box">

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleUpload}
              disabled={uploading}
            />

            <div className="upload-icon">
              {uploading ? '...' : '↑'}
            </div>

            <div className="upload-text">

              <strong>
                {uploading
                  ? 'Uploading resume...'
                  : 'Upload a new resume'}
              </strong>

              <span>
                PDF or DOCX · Maximum supported format
              </span>

            </div>

            <div className="upload-action">
              →
            </div>

          </label>


          {selectedResume && (
            <div className="selected-file">

              <div className="file-icon">
                PDF
              </div>

              <div className="file-info">

                <strong>
                  {selectedResume.title}
                </strong>

                <span>
                  Ready for ATS analysis
                </span>

              </div>

              <div className="file-status">
                ✓
              </div>

            </div>
          )}

        </div>


        {/* JOB DESCRIPTION */}

        <div className="workspace-card">

          <div className="workspace-card-header">

            <div className="card-heading">

              <div className="card-icon job-card-icon">
                <span>JD</span>
              </div>

              <div>

                <span className="card-step">
                  STEP 02
                </span>

                <h2>
                  Job description
                </h2>

              </div>

            </div>

            {jdId && (
              <div className="selected-badge">
                <span>✓</span>
                Selected
              </div>
            )}

          </div>

          <p className="workspace-description">
            Choose a saved job description or create
            one by pasting the job requirements.
          </p>


          <div className="form-group">

            <label>
              Saved job descriptions
            </label>

            <div className="select-wrapper">

              <select
                value={jdId}
                onChange={(e) =>
                  setJdId(e.target.value)
                }
              >

                <option value="">
                  Select a job description
                </option>

                {jobs.map((j) => (
                  <option
                    key={j.id}
                    value={j.id}
                  >
                    {j.title || `JD #${j.id}`}
                  </option>
                ))}

              </select>

              <span className="select-chevron">
                ↓
              </span>

            </div>

          </div>


          {/* CREATE JD */}

          <details className="create-jd">

            <summary>

              <span className="create-icon">
                +
              </span>

              <span className="create-text">
                Create new job description
              </span>

              <span className="summary-arrow">
                ↓
              </span>

            </summary>

            <div className="jd-form">

              <div className="input-row">

                <input
                  type="text"
                  placeholder="Job title"
                  value={jdDraft.title}
                  onChange={(e) =>
                    setJdDraft({
                      ...jdDraft,
                      title: e.target.value
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Company name"
                  value={jdDraft.company}
                  onChange={(e) =>
                    setJdDraft({
                      ...jdDraft,
                      company: e.target.value
                    })
                  }
                />

              </div>

              <textarea
                rows={6}
                placeholder="Paste the complete job description here..."
                value={jdDraft.raw_text}
                onChange={(e) =>
                  setJdDraft({
                    ...jdDraft,
                    raw_text: e.target.value
                  })
                }
              />

              <button
                type="button"
                className="save-jd-button"
                onClick={handleSaveJd}
              >

                <span>
                  Save job description
                </span>

                <span>
                  →
                </span>

              </button>

            </div>

          </details>


          {selectedJob && (
            <div className="selected-job">

              <div className="job-check">
                ✓
              </div>

              <div>

                <strong>
                  {selectedJob.title ||
                    `Job description #${selectedJob.id}`}
                </strong>

                <span>
                  Ready for comparison
                </span>

              </div>

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-message">

          <div className="error-icon">
            !
          </div>

          <div>

            <strong>
              Something went wrong
            </strong>

            <span>
              {error}
            </span>

          </div>

        </div>
      )}


      {/* =====================================================
          SCAN PANEL
      ===================================================== */}

      <section
        className={`scan-panel ${
          resumeId && jdId
            ? 'ready'
            : ''
        }`}
      >

        <div className="scan-content">

          <div className="scan-icon">

            <span>
              {resumeId && jdId ? '✓' : '01'}
            </span>

          </div>

          <div>

            <span className="scan-label">

              {resumeId && jdId
                ? 'READY TO SCAN'
                : 'ANALYSIS SETUP'}

            </span>

            <h3>

              {resumeId && jdId
                ? 'Everything is ready.'
                : 'Complete the setup first.'}

            </h3>

            <p>

              {resumeId && jdId
                ? 'Compare your resume against the selected job description.'
                : 'Select a resume and job description to continue.'}

            </p>

          </div>

        </div>


        <button
          className="scan-button"
          onClick={handleAnalyze}
          disabled={analyzing}
        >

          <span>

            {analyzing
              ? 'Analyzing resume...'
              : 'Run ATS analysis'}

          </span>

          <span className="button-arrow">

            {analyzing
              ? '◌'
              : '→'}

          </span>

        </button>

      </section>


      {/* =====================================================
          RESULTS
      ===================================================== */}

      {analysis && (
        <Results
          analysis={analysis}
          resumeId={resumeId}
          jdId={jdId}
        />
      )}


      {/* =====================================================
          BLUE LIGHT THEME
      ===================================================== */}

      <style>{`

        .analyze-page {
          --blue-950: #082f6b;
          --blue-900: #0b3b82;
          --blue-800: #125dcc;
          --blue-700: #1d6ff2;
          --blue-600: #2f7df4;
          --blue-500: #4f8ff7;
          --blue-400: #73a8fa;

          --blue-200: #bfdbfe;
          --blue-100: #dbeafe;
          --blue-50: #eff6ff;

          --text: #10233f;
          --text-2: #52657d;
          --muted: #7c8da3;

          --border: #dce6f2;
          --white: #ffffff;

          width: 100%;
          min-height: 100%;
          padding: 24px 0 70px;

          color: var(--text);

          box-sizing: border-box;

          background:
            linear-gradient(
              180deg,
              #f7faff 0%,
              #ffffff 45%,
              #f5f9ff 100%
            );
        }


        .analyze-page *,
        .analyze-page *::before,
        .analyze-page *::after {
          box-sizing: border-box;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .workspace-hero {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 40px;

          min-height: 300px;

          padding: 46px 50px;

          margin-bottom: 20px;

          overflow: hidden;

          border: 1px solid #bfdbfe;
          border-radius: 28px;

          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(47, 125, 244, .16),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 100%,
              rgba(96, 165, 250, .10),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #ffffff,
              #eef6ff
            );

          box-shadow:
            0 20px 60px rgba(24, 76, 145, .09);
        }


        .hero-left {
          position: relative;
          z-index: 2;

          max-width: 720px;
        }


        .eyebrow {
          display: inline-flex;
          align-items: center;

          gap: 8px;

          padding: 8px 12px;

          margin-bottom: 16px;

          border: 1px solid #bfdbfe;
          border-radius: 999px;

          background: #eff6ff;

          color: var(--blue-800);

          font-size: 10px;
          font-weight: 900;

          letter-spacing: .13em;
        }


        .eyebrow-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: var(--blue-600);

          box-shadow:
            0 0 0 4px rgba(47, 125, 244, .12);
        }


        .hero-left h1 {
          max-width: 700px;

          margin: 0;

          font-size: clamp(
            2.2rem,
            4.5vw,
            4rem
          );

          line-height: 1;

          letter-spacing: -.055em;

          font-weight: 850;
        }


        .hero-left h1 span {
          display: block;

          color: var(--blue-800);
        }


        .hero-left p {
          max-width: 650px;

          margin: 18px 0 0;

          color: var(--muted);

          font-size: .94rem;

          line-height: 1.7;
        }


        .hero-meta {
          display: flex;
          flex-wrap: wrap;

          gap: 10px 20px;

          margin-top: 22px;
        }


        .meta-item {
          display: flex;
          align-items: center;

          gap: 7px;

          color: var(--text-2);

          font-size: .72rem;
          font-weight: 650;
        }


        .meta-check {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          width: 18px;
          height: 18px;

          border-radius: 50%;

          background: var(--blue-100);

          color: var(--blue-800);

          font-size: 10px;
          font-weight: 900;
        }


        /* =====================================================
           HERO VISUAL
        ===================================================== */

        .hero-visual {
          position: relative;

          width: 260px;
          height: 230px;

          flex-shrink: 0;
        }


        .visual-orbit {
          position: absolute;

          border: 1px solid rgba(
            37,
            99,
            235,
            .12
          );

          border-radius: 50%;
        }


        .orbit-one {
          width: 210px;
          height: 210px;

          right: 5px;
          top: 8px;
        }


        .orbit-two {
          width: 155px;
          height: 155px;

          right: 32px;
          top: 35px;
        }


        .visual-card {
          position: absolute;
          z-index: 3;

          width: 205px;

          padding: 20px;

          right: 27px;
          top: 35px;

          border: 1px solid #ffffff;

          border-radius: 22px;

          background:
            rgba(
              255,
              255,
              255,
              .90
            );

          box-shadow:
            0 20px 50px
            rgba(
              24,
              76,
              145,
              .14
            );

          backdrop-filter: blur(14px);
        }


        .visual-top,
        .visual-bottom {
          display: flex;

          justify-content: space-between;
          align-items: center;
        }


        .visual-top {
          color: var(--muted);

          font-size: 8px;
          font-weight: 900;

          letter-spacing: .12em;
        }


        .live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: var(--blue-600);

          box-shadow:
            0 0 0 4px var(--blue-50);
        }


        .visual-score {
          margin-top: 9px;

          color: var(--blue-900);

          font-size: 3rem;

          line-height: 1;

          font-weight: 850;

          letter-spacing: -.06em;
        }


        .visual-score small {
          color: var(--muted);

          font-size: .7rem;

          letter-spacing: 0;
        }


        .visual-bar {
          width: 100%;
          height: 7px;

          margin-top: 17px;

          overflow: hidden;

          border-radius: 999px;

          background: var(--blue-100);
        }


        .visual-bar span {
          display: block;

          width: 86%;
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #60a5fa
            );
        }


        .visual-bottom {
          margin-top: 13px;

          color: var(--muted);

          font-size: 9px;
        }


        .visual-bottom strong {
          color: var(--blue-800);
        }


        /* =====================================================
           PROGRESS
        ===================================================== */

        .progress-card {
          display: flex;
          align-items: center;

          padding: 14px 18px;

          margin-bottom: 20px;

          border: 1px solid var(--border);

          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 10px 30px
            rgba(
              24,
              76,
              145,
              .05
            );
        }


        .progress-step {
          display: flex;
          align-items: center;

          gap: 10px;

          min-width: 190px;
        }


        .progress-number {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 38px;
          height: 38px;

          flex-shrink: 0;

          border-radius: 12px;

          background: #f3f6fa;

          color: #8190a3;

          font-size: 11px;
          font-weight: 900;
        }


        .progress-step.current
        .progress-number {
          background: var(--blue-800);

          color: #ffffff;

          box-shadow:
            0 0 0 5px var(--blue-100);
        }


        .progress-step.done
        .progress-number {
          background: #e0efff;

          color: var(--blue-800);
        }


        .progress-text {
          display: flex;

          flex-direction: column;

          gap: 2px;
        }


        .progress-text strong {
          font-size: .72rem;
        }


        .progress-text span {
          color: var(--muted);

          font-size: .6rem;
        }


        .progress-line {
          height: 1px;

          flex: 1;

          min-width: 28px;

          margin: 0 14px;

          background: #e4eaf2;
        }


        .progress-line.filled {
          background: #9ac2ff;
        }


        /* =====================================================
           WORKSPACE
        ===================================================== */

        .workspace-grid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 20px;

          margin-bottom: 20px;
        }


        .workspace-card {
          min-width: 0;

          padding: 26px;

          border: 1px solid var(--border);

          border-radius: 22px;

          background: #ffffff;

          box-shadow:
            0 12px 35px
            rgba(
              24,
              76,
              145,
              .055
            );

          transition:
            .2s ease;
        }


        .workspace-card:hover {
          transform: translateY(-2px);

          border-color: #bfd7f8;

          box-shadow:
            0 18px 45px
            rgba(
              24,
              76,
              145,
              .10
            );
        }


        .workspace-card-header {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 14px;
        }


        .card-heading {
          display: flex;

          align-items: center;

          gap: 13px;
        }


        .card-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 48px;
          height: 48px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #eff6ff
            );

          color: var(--blue-800);

          font-size: 11px;

          font-weight: 900;

          box-shadow:
            inset
            0 0 0 1px
            #bfdbfe;
        }


        .card-step {
          display: block;

          margin-bottom: 4px;

          color: #7b8da5;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: .12em;
        }


        .card-heading h2 {
          margin: 0;

          font-size: 1.05rem;
        }


        .selected-badge {
          display: flex;

          align-items: center;

          gap: 5px;

          padding: 6px 9px;

          border-radius: 999px;

          background: var(--blue-50);

          color: var(--blue-800);

          font-size: 9px;

          font-weight: 800;
        }


        .workspace-description {
          margin: 14px 0 20px;

          color: var(--muted);

          font-size: .73rem;

          line-height: 1.65;
        }


        /* =====================================================
           FORM
        ===================================================== */

        .form-group {
          margin-bottom: 16px;
        }


        .form-group label {
          display: block;

          margin-bottom: 7px;

          color: var(--text-2);

          font-size: .65rem;

          font-weight: 800;
        }


        .select-wrapper {
          position: relative;
        }


        .select-wrapper select,
        .jd-form input,
        .jd-form textarea {
          width: 100%;

          border: 1px solid #dbe4ef;

          border-radius: 12px;

          background: #fbfdff;

          color: var(--text);

          outline: none;

          transition: .2s;

          font: inherit;
        }


        .select-wrapper select {
          height: 45px;

          padding:
            0 38px 0 13px;

          appearance: none;

          font-size: .7rem;
        }


        .select-wrapper select:focus,
        .jd-form input:focus,
        .jd-form textarea:focus {
          border-color: #70a7f8;

          box-shadow:
            0 0 0 4px
            rgba(
              47,
              125,
              244,
              .10
            );

          background: #ffffff;
        }


        .select-chevron {
          position: absolute;

          right: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          pointer-events: none;

          color: var(--blue-700);

          font-size: 14px;
        }


        /* =====================================================
           UPLOAD
        ===================================================== */

        .upload-box {
          display: flex;

          align-items: center;

          gap: 12px;

          position: relative;

          padding: 16px;

          border:
            1.5px dashed
            #a9c9f7;

          border-radius: 15px;

          background: #f8fbff;

          cursor: pointer;

          transition: .2s;
        }


        .upload-box:hover {
          border-color: #4d8ff0;

          background: #eff6ff;
        }


        .upload-box input {
          position: absolute;

          opacity: 0;

          pointer-events: none;
        }


        .upload-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 40px;
          height: 40px;

          border-radius: 12px;

          background: #dbeafe;

          color: var(--blue-800);

          font-weight: 900;
        }


        .upload-text {
          display: flex;

          flex-direction: column;

          gap: 3px;

          min-width: 0;
        }


        .upload-text strong {
          font-size: .68rem;
        }


        .upload-text span {
          color: var(--muted);

          font-size: .57rem;
        }


        .upload-action {
          margin-left: auto;

          color: var(--blue-700);

          font-size: 18px;
        }


        /* =====================================================
           SELECTED FILE
        ===================================================== */

        .selected-file,
        .selected-job {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-top: 14px;

          padding: 12px;

          border:
            1px solid
            #dbe8f7;

          border-radius: 13px;

          background: #f8fbff;
        }


        .file-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 38px;
          height: 38px;

          border-radius: 10px;

          background: #dbeafe;

          color: var(--blue-800);

          font-size: 8px;

          font-weight: 900;
        }


        .file-info,
        .selected-job > div:last-child {
          display: flex;

          flex-direction: column;

          gap: 3px;

          min-width: 0;
        }


        .file-info strong,
        .selected-job strong {
          font-size: .66rem;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }


        .file-info span,
        .selected-job span {
          color: var(--muted);

          font-size: .56rem;
        }


        .file-status,
        .job-check {
          margin-left: auto;

          color: #166534;

          font-weight: 900;
        }


        /* =====================================================
           CREATE JD
        ===================================================== */

        .create-jd {
          margin-top: 13px;

          border:
            1px solid
            #e2eaf3;

          border-radius: 13px;

          overflow: hidden;

          background: #ffffff;
        }


        .create-jd summary {
          display: flex;

          align-items: center;

          gap: 9px;

          padding: 12px;

          cursor: pointer;

          list-style: none;

          font-size: .67rem;

          font-weight: 800;
        }


        .create-jd summary::-webkit-details-marker {
          display: none;
        }


        .create-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 24px;
          height: 24px;

          border-radius: 8px;

          background: #eff6ff;

          color: var(--blue-800);

          font-size: 15px;
        }


        .summary-arrow {
          margin-left: auto;

          color: #7890ac;
        }


        .jd-form {
          padding: 0 12px 12px;
        }


        .input-row {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 8px;

          margin-bottom: 8px;
        }


        .jd-form input {
          height: 42px;

          padding: 0 11px;

          font-size: .68rem;
        }


        .jd-form textarea {
          padding: 10px;

          resize: vertical;

          font-size: .68rem;
        }


        .save-jd-button {
          display: flex;

          align-items: center;

          justify-content: space-between;

          width: 100%;

          margin-top: 9px;

          padding: 11px 13px;

          border: 0;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #125dcc,
              #2f7df4
            );

          color: #ffffff;

          cursor: pointer;

          font-size: .67rem;

          font-weight: 800;

          box-shadow:
            0 8px 20px
            rgba(
              37,
              99,
              235,
              .20
            );
        }


        /* =====================================================
           ERROR
        ===================================================== */

        .error-message {
          display: flex;

          align-items: center;

          gap: 11px;

          margin-bottom: 18px;

          padding: 13px 15px;

          border:
            1px solid
            #fecaca;

          border-radius: 14px;

          background: #fff7f7;

          color: #991b1b;
        }


        .error-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 28px;
          height: 28px;

          border-radius: 9px;

          background: #fee2e2;

          font-weight: 900;
        }


        .error-message strong,
        .error-message span {
          display: block;
        }


        .error-message strong {
          font-size: .68rem;
        }


        .error-message span {
          margin-top: 3px;

          font-size: .6rem;

          color: #b45353;
        }


        /* =====================================================
           SCAN
        ===================================================== */

        .scan-panel {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 22px;

          padding: 19px 22px;

          border:
            1px solid
            var(--border);

          border-radius: 19px;

          background: #ffffff;

          box-shadow:
            0 12px 32px
            rgba(
              24,
              76,
              145,
              .05
            );
        }


        .scan-panel.ready {
          border-color: #b7d4fa;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f1f7ff
            );
        }


        .scan-content {
          display: flex;

          align-items: center;

          gap: 13px;
        }


        .scan-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 44px;
          height: 44px;

          border-radius: 13px;

          background: #dbeafe;

          color: var(--blue-800);

          font-size: 10px;

          font-weight: 900;
        }


        .scan-label {
          display: block;

          color: var(--blue-700);

          font-size: 8px;

          font-weight: 900;

          letter-spacing: .1em;
        }


        .scan-content h3 {
          margin: 4px 0 3px;

          font-size: .85rem;
        }


        .scan-content p {
          margin: 0;

          color: var(--muted);

          font-size: .62rem;
        }


        .scan-button {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 18px;

          min-width: 190px;

          padding: 13px 17px;

          border: 0;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #0b3b82,
              #2875e8
            );

          color: #ffffff;

          cursor: pointer;

          font-size: .68rem;

          font-weight: 850;

          box-shadow:
            0 10px 24px
            rgba(
              37,
              99,
              235,
              .20
            );
        }


        .scan-button:disabled {
          opacity: .65;

          cursor: not-allowed;
        }


        .button-arrow {
          font-size: 16px;
        }


        /* =====================================================
           RESULTS
        ===================================================== */

        .results-section {
          margin-top: 6px;
        }


        .results-title-row {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 14px;
        }


        .results-title-left {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .results-title-mark {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 34px;
          height: 34px;

          border-radius: 11px;

          background: #dbeafe;

          color: var(--blue-800);

          font-size: 12px;

          font-weight: 900;
        }


        .results-title-row h2 {
          margin: 0;

          font-size: 1rem;
        }


        .results-title-row p {
          margin: 3px 0 0;

          color: var(--muted);

          font-size: .6rem;
        }


        .results-status {
          padding: 7px 10px;

          border-radius: 999px;

          background: #eff6ff;

          color: var(--blue-800);

          font-size: 8px;

          font-weight: 900;
        }


        /* =====================================================
           SCORE CARD
        ===================================================== */

        .score-card {
          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 24px;

          padding: 24px;

          margin-bottom: 18px;

          border:
            1px solid
            #cfe0f5;

          border-radius: 21px;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f5f9ff
            );

          box-shadow:
            0 14px 40px
            rgba(
              24,
              76,
              145,
              .07
            );
        }


        .score-gauge-wrap {
          display: flex;

          align-items: center;

          justify-content: center;
        }


        .score-details {
          min-width: 0;
        }


        .score-kicker {
          color: var(--blue-700);

          font-size: 8px;

          font-weight: 900;

          letter-spacing: .1em;
        }


        .score-details h3 {
          margin: 5px 0 7px;

          font-size: 1.35rem;
        }


        .score-details p {
          max-width: 450px;

          margin: 0;

          color: var(--muted);

          font-size: .67rem;

          line-height: 1.6;
        }


        .before-after-box {
          padding: 12px 14px;

          border:
            1px solid
            #dbe7f5;

          border-radius: 13px;

          background: #ffffff;
        }


        .before-after-label {
          margin-bottom: 7px;

          color: var(--muted);

          font-size: 8px;

          font-weight: 800;
        }


        .score-transition {
          display: flex;

          align-items: center;

          gap: 7px;

          font-size: .8rem;

          font-weight: 900;
        }


        .transition-arrow {
          color: #91a3b8;
        }


        .score-change {
          padding: 4px 6px;

          border-radius: 7px;

          background: #e8f7ee;

          color: #18764a;

          font-size: .58rem;
        }


        .score-change.down {
          background: #fff0f0;

          color: #c24141;
        }


        /* =====================================================
           METRICS
        ===================================================== */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 9px;

          grid-column: 1 / -1;
        }


        .metric-card {
          padding: 13px;

          border:
            1px solid
            #dfe8f2;

          border-radius: 13px;

          background:
            rgba(
              255,
              255,
              255,
              .8
            );
        }


        .metric-value {
          color: var(--blue-800);

          font-size: 1.15rem;

          font-weight: 850;
        }


        .metric-label {
          margin-top: 4px;

          color: var(--muted);

          font-size: .57rem;
        }


        /* =====================================================
           RESULT GRID
        ===================================================== */

        .results-grid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 16px;

          margin-bottom: 16px;
        }


        .result-box,
        .health-card,
        .format-card {
          min-width: 0;

          padding: 19px;

          border:
            1px solid
            var(--border);

          border-radius: 17px;

          background: #ffffff;

          box-shadow:
            0 8px 28px
            rgba(
              24,
              76,
              145,
              .04
            );
        }


        .health-card,
        .format-card {
          margin-bottom: 16px;
        }


        /* =====================================================
           HEALTH
        ===================================================== */

        .section-heading {
          display: flex;

          align-items: center;

          gap: 9px;

          margin-bottom: 13px;
        }


        .section-heading-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 29px;
          height: 29px;

          border-radius: 9px;

          background: #dbeafe;

          color: var(--blue-800);

          font-size: 11px;

          font-weight: 900;
        }


        .section-heading h3 {
          margin: 0;

          font-size: .76rem;

          font-weight: 850;
        }


        .health-grid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 8px;
        }


        .health-item {
          display: flex;

          align-items: center;

          gap: 8px;

          padding: 9px;

          border:
            1px solid
            #e8eef5;

          border-radius: 10px;

          background: #f9fbfd;

          color: var(--text-2);

          font-size: .61rem;
        }


        .health-status {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 20px;
          height: 20px;

          border-radius: 50%;

          background: #e7f7ee;

          color: #18764a;

          font-size: 9px;

          font-weight: 900;
        }


        .health-status.warning {
          background: #fff4db;

          color: #a16207;
        }


        /* =====================================================
           FORMATTING
        ===================================================== */

        .format-list {
          margin: 0;

          padding-left: 18px;

          color: var(--text-2);

          font-size: .65rem;

          line-height: 1.7;
        }


        .format-empty {
          display: flex;

          align-items: center;

          gap: 8px;

          padding: 11px 12px;

          border-radius: 10px;

          background: #eff6ff;

          color: var(--blue-800);

          font-size: .65rem;

          font-weight: 700;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .workspace-hero {
            padding: 38px;
          }

          .hero-visual {
            width: 220px;
          }

          .visual-card {
            right: 5px;
          }

          .score-card {
            grid-template-columns:
              auto 1fr;
          }

          .stats-grid {
            grid-column: 1 / -1;
          }

        }


        @media (max-width: 900px) {

          .workspace-hero {
            min-height: auto;

            padding: 32px;
          }

          .hero-visual {
            display: none;
          }

          .workspace-grid {
            grid-template-columns: 1fr;
          }

          .progress-card {
            overflow-x: auto;
          }

          .progress-step {
            min-width: 155px;
          }

          .progress-line {
            flex:
              0 0 35px;

            margin:
              0 9px;
          }

        }


        @media (max-width: 700px) {

          .workspace-hero {
            padding: 27px 21px;

            border-radius: 21px;
          }

          .hero-left h1 {
            font-size: 2.25rem;
          }

          .hero-left p {
            font-size: .8rem;
          }

          .workspace-card {
            padding: 20px;
          }

          .scan-panel {
            flex-direction: column;

            align-items: stretch;
          }

          .scan-button {
            width: 100%;
          }

          .score-card {
            grid-template-columns: 1fr;

            text-align: center;
          }

          .score-details p {
            margin-left: auto;
            margin-right: auto;
          }

          .score-gauge-wrap {
            justify-content: center;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }

          .health-grid {
            grid-template-columns:
              1fr 1fr;
          }

        }


        @media (max-width: 500px) {

          .analyze-page {
            padding-top: 14px;
          }

          .hero-left h1 {
            font-size: 2rem;
          }

          .hero-meta {
            display: grid;

            grid-template-columns:
              1fr 1fr;
          }

          .progress-step {
            min-width: 130px;
          }

          .progress-line {
            flex-basis: 20px;

            margin:
              0 6px;
          }

          .workspace-card {
            padding: 17px;
          }

          .input-row {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .metric-card {
            display: flex;

            align-items: center;

            justify-content: space-between;
          }

          .metric-label {
            margin: 0;
          }

          .health-grid {
            grid-template-columns: 1fr;
          }

          .score-card {
            padding: 18px;
          }

          .results-title-row {
            align-items: flex-start;
            gap: 10px;
          }

          .results-status {
            white-space: nowrap;
          }

        }

      `}</style>

    </div>
  )
}


/* =========================================================
   RESULTS
========================================================= */

function Results({ analysis }) {

  const score = Math.round(
    Number(analysis.ats_score || 0)
  )

  const similarity = Math.round(
    Number(analysis.similarity_score || 0)
  )

  const keywordCoverage = Math.round(
    Number(analysis.keyword_coverage || 0)
  )

  const skillsCoverage = Math.round(
    Number(
      analysis.skills_match?.coverage_percent || 0
    )
  )

  const hasPreviousScore =
    analysis.previous_score != null

  const previousScore = hasPreviousScore
    ? Math.round(
        Number(
          analysis.previous_score
        )
      )
    : null

  const scoreDifference = hasPreviousScore
    ? Math.abs(
        score - previousScore
      )
    : 0

  return (
    <section className="results-section">

      {/* RESULTS HEADER */}

      <div className="results-title-row">

        <div className="results-title-left">

          <div className="results-title-mark">
            ✓
          </div>

          <div>

            <h2>
              Analysis results
            </h2>

            <p>
              Resume compatibility report
            </p>

          </div>

        </div>

        <div className="results-status">
          SCAN COMPLETE
        </div>

      </div>


      {/* SCORE CARD */}

      <div className="score-card">

        <div className="score-gauge-wrap">
          <ScoreGauge
            score={analysis.ats_score}
          />
        </div>


        <div className="score-details">

          <div className="score-kicker">
            OVERALL ATS SCORE
          </div>

          <h3>

            {score >= 80
              ? 'Strong match'
              : score >= 60
                ? 'Good match'
                : 'Needs improvement'}

          </h3>

          <p>
            Your resume has been compared against
            the selected job description across keywords,
            skills and ATS-friendly formatting.
          </p>

        </div>


        {hasPreviousScore && (

          <div className="before-after-box">

            <div className="before-after-label">
              Previous vs current
            </div>

            <div className="score-transition">

              <span>
                {previousScore}
              </span>

              <span className="transition-arrow">
                →
              </span>

              <span>
                {score}
              </span>

              <span
                className={`score-change ${
                  score < previousScore
                    ? 'down'
                    : ''
                }`}
              >

                {score >= previousScore
                  ? '▲'
                  : '▼'}

                {scoreDifference}

              </span>

            </div>

          </div>

        )}


        {/* METRICS */}

        <div className="stats-grid">

          <Metric
            value={`${similarity}%`}
            label="Resume similarity"
          />

          <Metric
            value={`${keywordCoverage}%`}
            label="Keyword coverage"
          />

          <Metric
            value={`${skillsCoverage}%`}
            label="Skills coverage"
          />

        </div>

      </div>


      {/* KEYWORDS */}

      <div className="results-grid">

        <div className="result-box">

          <KeywordChips
            title="Matched keywords"
            keywords={
              analysis.matched_keywords
            }
            variant="matched"
          />

        </div>


        <div className="result-box">

          <KeywordChips
            title="Missing keywords"
            keywords={
              analysis.missing_keywords
            }
            variant="missing"
            emptyText="Nothing missing — nice work."
          />

        </div>


        <div className="result-box">

          <KeywordChips
            title="Skills matched"
            keywords={
              analysis.skills_match
                ?.matched_skills
            }
            variant="matched"
          />

        </div>


        <div className="result-box">

          <KeywordChips
            title="Skills missing"
            keywords={
              analysis.skills_match
                ?.missing_skills
            }
            variant="missing"
            emptyText="All required skills are present."
          />

        </div>

      </div>


      {/* HEALTH CHECK */}

      <div className="health-card">

        <div className="section-heading">

          <div className="section-heading-icon">
            ✓
          </div>

          <h3>
            Resume health check
          </h3>

        </div>


        <div className="health-grid">

          {analysis.health_check &&
            Object.entries(
              analysis.health_check
            )
              .filter(
                ([key]) =>
                  key.startsWith('has_') ||
                  key === 'length_ok' ||
                  key === 'uses_bullet_points'
              )
              .map(
                ([key, value]) => (

                  <div
                    className="health-item"
                    key={key}
                  >

                    <span
                      className={`health-status ${
                        value
                          ? ''
                          : 'warning'
                      }`}
                    >
                      {value
                        ? '✓'
                        : '!'}
                    </span>

                    <span>
                      {formatHealthLabel(key)}
                    </span>

                  </div>

                )
              )}

        </div>

      </div>


      {/* FORMATTING */}

      <div className="format-card">

        <div className="section-heading">

          <div className="section-heading-icon">
            A
          </div>

          <h3>
            ATS formatting check
          </h3>

        </div>


        {analysis.formatting_issues?.length > 0 ? (

          <ul className="format-list">

            {analysis.formatting_issues.map(
              (issue, index) => (

                <li key={index}>
                  {issue}
                </li>

              )
            )}

          </ul>

        ) : (

          <div className="format-empty">

            <span>
              ✓
            </span>

            No major ATS formatting issues detected.

          </div>

        )}

      </div>

    </section>
  )
}


/* =========================================================
   METRIC
========================================================= */

function Metric({ value, label }) {

  return (
    <div className="metric-card">

      <div className="metric-value">
        {value}
      </div>

      <div className="metric-label">
        {label}
      </div>

    </div>
  )
}


/* =========================================================
   HEALTH LABEL
========================================================= */

function formatHealthLabel(key) {

  const labels = {
    has_name: 'Name',
    has_email: 'Email',
    has_phone: 'Phone',
    has_summary: 'Summary',
    has_experience: 'Experience',
    has_education: 'Education',
    has_skills: 'Skills',
    length_ok: 'Resume length',
    uses_bullet_points: 'Bullet points'
  }

  return (
    labels[key] ||
    key
      .replace(/_/g, ' ')
      .replace(/^has /, '')
      .replace(/ ok$/, '')
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  )
}