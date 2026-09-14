import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import GoogleSignInButton from '../components/GoogleSignInButton.jsx'

const FEATURES = [
  {
    number: '01',
    title: 'ATS Score',
    description: 'See how well your resume performs against applicant tracking systems.',
  },
  {
    number: '02',
    title: 'Keyword Matching',
    description: 'Find important keywords that are matched, missing, or underused.',
  },
  {
    number: '03',
    title: 'AI Resume Analysis',
    description: 'Get practical AI-powered feedback to improve your resume.',
  },
  {
    number: '04',
    title: 'Bullet Rewriter',
    description: 'Turn weak resume bullets into stronger, professional statements.',
  },
  {
    number: '05',
    title: 'Interview Prep',
    description: 'Prepare with role-focused questions and useful interview guidance.',
  },
  {
    number: '06',
    title: 'Cover Letters',
    description: 'Create better cover letters and use ready-to-edit templates.',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const { login, register, loginWithGoogle } = useAuth()

  const [mode, setMode] = useState('nickname')

  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    fullName: '',
  })

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      if (mode === 'nickname') {
        const api = (await import('../api/axios.js')).default
        const { data } = await api.post('/auth/guest/', {
          nickname: form.nickname,
        })

        localStorage.setItem('resumeiq_access', data.tokens.access)
        localStorage.setItem('resumeiq_refresh', data.tokens.refresh)

        window.location.href = '/app'
        return
      }

      if (mode === 'signin') {
        await login({
          email: form.email,
          password: form.password,
        })
      } else {
        await register({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
        })
      }

      navigate('/app')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          Object.values(err.response?.data || {})[0]?.[0] ||
          'Something went wrong.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="landing-page">

      {/* ================= HEADER ================= */}

      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand">
            <div className="brand-mark">
              <span>R</span>
            </div>

            <div className="brand-text">
              <strong>ResumeIQ</strong>
              <span>AI RESUME INTELLIGENCE</span>
            </div>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            AI-powered resume analysis
          </div>

        </div>
      </header>


      {/* ================= MAIN ================= */}

      <main className="main-container">

        <div className="hero-grid">

          {/* ================= HERO ================= */}

          <section className="hero-content">

            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              AI-POWERED CAREER INTELLIGENCE
            </div>

            <h1>
              Your resume.
              <br />

              <span className="highlight-word">
                Smarter.
              </span>

              <br />

              Your career.
              <br />

              <span className="blue-word">
                Stronger.
              </span>
            </h1>

            <p className="hero-description">
              Analyze your resume with AI, discover missing keywords,
              improve your content, and make your application stand out.
            </p>


            {/* Trust */}

            <div className="trust-row">

              <div className="trust-item">
                <div className="trust-icon">✓</div>
                <span>AI powered</span>
              </div>

              <div className="trust-item">
                <div className="trust-icon">✓</div>
                <span>ATS focused</span>
              </div>

              <div className="trust-item">
                <div className="trust-icon">✓</div>
                <span>Easy to use</span>
              </div>

            </div>


            {/* ================= RESUME PREVIEW ================= */}

            <div className="resume-preview">

              <div className="preview-top">

                <div className="preview-label">
                  <span className="preview-dot"></span>
                  RESUME ANALYSIS
                </div>

                <span className="preview-score">
                  92 ATS
                </span>

              </div>


              <div className="preview-body">

                {/* DOCUMENT */}

                <div className="document">

                  <div className="document-header">

                    <div className="document-avatar"></div>

                    <div className="document-heading">
                      <span className="document-name"></span>
                      <span className="document-role"></span>
                    </div>

                  </div>


                  <div className="document-section">

                    <span className="document-title"></span>

                    <span className="document-line large"></span>
                    <span className="document-line"></span>
                    <span className="document-line medium"></span>

                  </div>


                  <div className="document-section">

                    <span className="document-title"></span>

                    <span className="document-line"></span>
                    <span className="document-line large"></span>
                    <span className="document-line short"></span>

                  </div>


                  <div className="document-section">

                    <span className="document-title"></span>

                    <span className="document-line medium"></span>
                    <span className="document-line"></span>

                  </div>

                </div>


                {/* ANALYSIS */}

                <div className="analysis-panel">

                  <div className="analysis-score">

                    <div className="score-circle">

                      <strong>92</strong>
                      <span>/100</span>

                    </div>

                    <div>
                      <strong>Excellent match</strong>
                      <span>ATS compatibility</span>
                    </div>

                  </div>


                  <div className="analysis-row">

                    <span>Keywords</span>

                    <div className="analysis-bar">
                      <i style={{ width: '91%' }}></i>
                    </div>

                    <strong>91%</strong>

                  </div>


                  <div className="analysis-row">

                    <span>Structure</span>

                    <div className="analysis-bar">
                      <i style={{ width: '96%' }}></i>
                    </div>

                    <strong>96%</strong>

                  </div>


                  <div className="analysis-row">

                    <span>Content</span>

                    <div className="analysis-bar">
                      <i style={{ width: '88%' }}></i>
                    </div>

                    <strong>88%</strong>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ================= AUTH ================= */}

          <aside className="auth-wrapper">

            <div className="auth-card">

              <div className="auth-glow"></div>

              <div className="auth-card-top">

                <div className="login-icon">
                  <span>→</span>
                </div>

                <div>

                  <span className="login-label">
                    GET STARTED
                  </span>

                  <h2>
                    Enter your nickname
                  </h2>

                </div>

              </div>


              <p className="login-description">
                Start using ResumeIQ instantly.
                No account creation required.
              </p>


              <form
                className="nickname-form"
                onSubmit={handleSubmit}
              >

                <label className="field-label">
                  Your nickname
                </label>


                <div className="input-wrap">

                  <div className="input-icon">
                    @
                  </div>

                  <input
                    className="nickname-input"
                    type="text"
                    value={form.nickname}
                    placeholder="e.g. Rahul"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nickname: e.target.value,
                      })
                    }
                    required
                  />

                </div>


                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}


                <button
                  className="continue-btn"
                  type="submit"
                  disabled={busy}
                >

                  <span>
                    {busy
                      ? 'Getting started...'
                      : 'Continue'}
                  </span>

                  {!busy && (
                    <span className="button-arrow">
                      →
                    </span>
                  )}

                </button>

              </form>


              <div className="login-note">

                <span className="note-icon">
                  ✓
                </span>

                <div>

                  <strong>
                    Quick & simple
                  </strong>

                  <span>
                    You can start analyzing your resume right away.
                  </span>

                </div>

              </div>

            </div>


            <div className="secure-note">

              <span>●</span>

              Your resume stays private

            </div>

          </aside>

        </div>


        {/* ================= FEATURES ================= */}

        <section className="features-section">

          <div className="features-heading">

            <div>

              <span className="section-label">
                EVERYTHING YOU NEED
              </span>

              <h2>
                One place to improve
                <br />
                your resume.
              </h2>

            </div>

            <p>
              From ATS scoring to interview preparation,
              ResumeIQ gives you practical tools to build
              a stronger job application.
            </p>

          </div>


          <div className="features-grid">

            {FEATURES.map((feature) => (

              <div
                className="feature-card"
                key={feature.number}
              >

                <div className="feature-top">

                  <span className="feature-number">
                    {feature.number}
                  </span>

                  <span className="feature-mini-arrow">
                    ↗
                  </span>

                </div>


                <div className="feature-content">

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>

                </div>


                <span className="feature-line"></span>

              </div>

            ))}

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-inner">

          <span>
            © 2026 ResumeIQ
          </span>

          <span className="footer-separator">
            •
          </span>

          <span>
            Smarter resumes. Better opportunities.
          </span>

        </div>

      </footer>


      {/* ================= STYLES ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
        }


        /* =========================
           GLOBAL
        ========================= */

        body {

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background: #050b17;
          color: #f8fafc;

        }


        /* =========================
           PAGE
        ========================= */

        .landing-page {

          min-height: 100vh;

          overflow-x: hidden;

          background:

            radial-gradient(
              circle at 8% 0%,
              rgba(37,99,235,0.18),
              transparent 30%
            ),

            radial-gradient(
              circle at 92% 12%,
              rgba(30,64,175,0.16),
              transparent 28%
            ),

            radial-gradient(
              circle at 50% 55%,
              rgba(15,58,130,0.08),
              transparent 38%
            ),

            #050b17;

        }


        .landing-page::before {

          content: "";

          position: fixed;

          inset: 0;

          pointer-events: none;

          opacity: 0.24;

          background-image:

            linear-gradient(
              rgba(96,165,250,0.045) 1px,
              transparent 1px
            ),

            linear-gradient(
              90deg,
              rgba(96,165,250,0.045) 1px,
              transparent 1px
            );

          background-size: 46px 46px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 85%
            );

        }


        /* =========================
           HEADER
        ========================= */

        .topbar {

          width: 100%;

          border-bottom:
            1px solid rgba(148,163,184,0.10);

          background:
            rgba(5,11,23,0.76);

          backdrop-filter:
            blur(18px);

          position: relative;
          z-index: 10;

        }


        .topbar-inner {

          width:
            min(1180px, calc(100% - 40px));

          margin: auto;

          height: 76px;

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .brand {

          display: flex;

          align-items: center;

          gap: 12px;

        }


        .brand-mark {

          width: 39px;
          height: 39px;

          border-radius: 11px;

          display: grid;

          place-items: center;

          background:
            linear-gradient(
              145deg,
              #2563eb,
              #1d4ed8
            );

          color: white;

          box-shadow:
            0 8px 25px
            rgba(37,99,235,0.30);

        }


        .brand-mark span {

          font-size: 17px;

          font-weight: 850;

          letter-spacing: -0.5px;

        }


        .brand-text {

          display: flex;

          flex-direction: column;

          gap: 2px;

        }


        .brand-text strong {

          color: #f8fafc;

          font-size: 17px;

          letter-spacing: -0.4px;

        }


        .brand-text span {

          color: #64748b;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.9px;

        }


        .topbar-status {

          display: flex;

          align-items: center;

          gap: 9px;

          color: #71829d;

          font-size: 11px;

          font-weight: 600;

        }


        .status-dot {

          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px rgba(34,197,94,0.10),
            0 0 12px rgba(34,197,94,0.45);

        }


        /* =========================
           MAIN
        ========================= */

        .main-container {

          width:
            min(1180px, calc(100% - 40px));

          margin: auto;

          padding: 82px 0 95px;

          position: relative;
          z-index: 1;

        }


        /* =========================
           HERO GRID
        ========================= */

        .hero-grid {

          display: grid;

          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(360px, 410px);

          gap: 80px;

          align-items: center;

        }


        .hero-content {

          min-width: 0;

        }


        /* =========================
           EYEBROW
        ========================= */

        .eyebrow {

          display: flex;

          align-items: center;

          gap: 10px;

          color: #60a5fa;

          font-size: 10px;

          font-weight: 850;

          letter-spacing: 1.8px;

          margin-bottom: 23px;

        }


        .eyebrow-line {

          width: 28px;

          height: 2px;

          border-radius: 10px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #60a5fa
            );

          box-shadow:
            0 0 12px
            rgba(59,130,246,0.45);

        }


        /* =========================
           HERO TITLE
        ========================= */

        .hero-content h1 {

          margin: 0;

          font-size:
            clamp(46px, 5.2vw, 70px);

          line-height: 0.98;

          letter-spacing: -4px;

          font-weight: 850;

          color: #f8fafc;

        }


        .highlight-word {

          background:
            linear-gradient(
              90deg,
              #60a5fa,
              #3b82f6
            );

          -webkit-background-clip: text;

          background-clip: text;

          color: transparent;

        }


        .blue-word {

          color: #e2e8f0;

        }


        .hero-description {

          max-width: 590px;

          margin: 28px 0 0;

          color: #8493aa;

          font-size: 16px;

          line-height: 1.72;

        }


        /* =========================
           TRUST
        ========================= */

        .trust-row {

          display: flex;

          flex-wrap: wrap;

          gap: 22px;

          margin-top: 27px;

        }


        .trust-item {

          display: flex;

          align-items: center;

          gap: 8px;

          color: #a5b4c9;

          font-size: 11px;

          font-weight: 700;

        }


        .trust-icon {

          width: 20px;
          height: 20px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          color: #60a5fa;

          background:
            rgba(37,99,235,0.13);

          border:
            1px solid rgba(59,130,246,0.20);

          font-size: 10px;

          font-weight: 900;

        }


        /* =========================
           RESUME PREVIEW
        ========================= */

        .resume-preview {

          margin-top: 42px;

          border:
            1px solid rgba(96,165,250,0.15);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(15,27,49,0.96),
              rgba(8,17,31,0.98)
            );

          box-shadow:
            0 30px 80px
            rgba(0,0,0,0.32),

            0 0 0 1px
            rgba(37,99,235,0.03);

          overflow: hidden;

        }


        .preview-top {

          height: 48px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 17px;

          border-bottom:
            1px solid rgba(148,163,184,0.09);

          background:
            rgba(15,23,42,0.55);

        }


        .preview-label {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #71829d;

          font-size: 8px;

          font-weight: 850;

          letter-spacing: 1.1px;

        }


        .preview-dot {

          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 9px
            rgba(34,197,94,0.6);

        }


        .preview-score {

          padding: 5px 9px;

          border-radius: 6px;

          background:
            rgba(37,99,235,0.12);

          border:
            1px solid rgba(59,130,246,0.15);

          color: #60a5fa;

          font-size: 8px;

          font-weight: 850;

        }


        .preview-body {

          display: grid;

          grid-template-columns: 1.1fr 0.9fr;

          gap: 20px;

          padding: 20px;

        }


        /* =========================
           DOCUMENT
        ========================= */

        .document {

          padding: 18px;

          border:
            1px solid #d8e0ea;

          border-radius: 8px;

          background:
            #f8fafc;

          box-shadow:
            0 12px 30px
            rgba(0,0,0,0.18);

        }


        .document-header {

          display: flex;

          align-items: center;

          gap: 10px;

          padding-bottom: 15px;

          border-bottom:
            1px solid #e3e8ef;

        }


        .document-avatar {

          width: 31px;
          height: 31px;

          border-radius: 50%;

          background:
            linear-gradient(
              145deg,
              #bfdbfe,
              #60a5fa
            );

        }


        .document-heading {

          display: flex;

          flex-direction: column;

          gap: 6px;

          flex: 1;

        }


        .document-name {

          width: 65%;

          height: 6px;

          background: #1e293b;

          border-radius: 4px;

        }


        .document-role {

          width: 43%;

          height: 4px;

          background: #94a3b8;

          border-radius: 4px;

        }


        .document-section {

          margin-top: 15px;

        }


        .document-title {

          display: block;

          width: 32%;

          height: 5px;

          margin-bottom: 9px;

          background: #2563eb;

          border-radius: 4px;

        }


        .document-line {

          display: block;

          width: 100%;

          height: 4px;

          margin-top: 6px;

          background: #d7dee8;

          border-radius: 4px;

        }


        .document-line.large {
          width: 92%;
        }


        .document-line.medium {
          width: 74%;
        }


        .document-line.short {
          width: 57%;
        }


        /* =========================
           ANALYSIS PANEL
        ========================= */

        .analysis-panel {

          display: flex;

          flex-direction: column;

          justify-content: center;

          gap: 15px;

        }


        .analysis-score {

          display: flex;

          align-items: center;

          gap: 11px;

          padding-bottom: 8px;

        }


        .score-circle {

          width: 52px;
          height: 52px;

          flex: 0 0 52px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          border:
            4px solid #3b82f6;

          background:
            rgba(37,99,235,0.10);

          box-shadow:
            0 0 25px
            rgba(37,99,235,0.12);

        }


        .score-circle strong {

          font-size: 15px;

          line-height: 1;

          color: #60a5fa;

        }


        .score-circle span {

          margin-top: 2px;

          font-size: 7px;

          color: #71829d;

        }


        .analysis-score > div:last-child {

          display: flex;

          flex-direction: column;

          gap: 3px;

        }


        .analysis-score > div:last-child strong {

          font-size: 11px;

          color: #dbeafe;

        }


        .analysis-score > div:last-child span {

          font-size: 9px;

          color: #64748b;

        }


        .analysis-row {

          display: grid;

          grid-template-columns:
            55px 1fr 28px;

          align-items: center;

          gap: 8px;

          font-size: 8px;

          color: #71829d;

        }


        .analysis-row strong {

          font-size: 8px;

          color: #a5b4c9;

          text-align: right;

        }


        .analysis-bar {

          height: 5px;

          background:
            #1e293b;

          border-radius: 10px;

          overflow: hidden;

        }


        .analysis-bar i {

          display: block;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #60a5fa
            );

          border-radius: inherit;

          box-shadow:
            0 0 10px
            rgba(59,130,246,0.35);

        }


        /* =========================
           AUTH
        ========================= */

        .auth-wrapper {

          width: 100%;

        }


        .auth-card {

          position: relative;

          overflow: hidden;

          padding: 32px;

          background:
            linear-gradient(
              145deg,
              rgba(15,28,49,0.98),
              rgba(8,17,31,0.98)
            );

          border:
            1px solid rgba(96,165,250,0.16);

          border-radius: 20px;

          box-shadow:
            0 30px 80px
            rgba(0,0,0,0.32);

        }


        .auth-glow {

          position: absolute;

          width: 180px;
          height: 180px;

          right: -100px;
          top: -100px;

          border-radius: 50%;

          background:
            rgba(37,99,235,0.12);

          filter: blur(15px);

          pointer-events: none;

        }


        .auth-card-top {

          display: flex;

          align-items: center;

          gap: 13px;

          position: relative;

          z-index: 1;

        }


        .login-icon {

          width: 44px;
          height: 44px;

          display: grid;

          place-items: center;

          border-radius: 12px;

          background:
            rgba(37,99,235,0.13);

          border:
            1px solid rgba(59,130,246,0.20);

          color: #60a5fa;

          font-size: 22px;

          font-weight: 700;

        }


        .login-label {

          display: block;

          color: #60a5fa;

          font-size: 8px;

          font-weight: 850;

          letter-spacing: 1.5px;

          margin-bottom: 5px;

        }


        .auth-card h2 {

          margin: 0;

          color: #f8fafc;

          font-size: 23px;

          letter-spacing: -0.7px;

        }


        .login-description {

          margin: 22px 0 25px;

          color: #71829d;

          font-size: 13px;

          line-height: 1.65;

        }


        /* =========================
           FORM
        ========================= */

        .nickname-form {

          display: flex;

          flex-direction: column;

        }


        .field-label {

          margin-bottom: 8px;

          color: #b8c4d5;

          font-size: 11px;

          font-weight: 800;

        }


        .input-wrap {

          position: relative;

        }


        .input-icon {

          position: absolute;

          left: 14px;

          top: 50%;

          transform: translateY(-50%);

          color: #64748b;

          font-size: 15px;

          font-weight: 700;

          pointer-events: none;

        }


        .nickname-input {

          width: 100%;

          height: 50px;

          padding:
            0 15px 0 40px;

          border:
            1px solid #23334d;

          border-radius: 11px;

          outline: none;

          background:
            #0b1527;

          color: #f8fafc;

          font-size: 14px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;

        }


        .nickname-input::placeholder {

          color: #52627a;

        }


        .nickname-input:focus {

          background:
            #0d192d;

          border-color:
            #3b82f6;

          box-shadow:
            0 0 0 4px
            rgba(37,99,235,0.10),

            0 0 25px
            rgba(37,99,235,0.07);

        }


        .error-message {

          margin-top: 9px;

          padding: 9px 11px;

          border-radius: 8px;

          background:
            rgba(220,38,38,0.08);

          border:
            1px solid rgba(248,113,113,0.16);

          color: #f87171;

          font-size: 11px;

          line-height: 1.4;

        }


        .continue-btn {

          width: 100%;

          height: 50px;

          margin-top: 13px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          border: 0;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color: white;

          font-size: 13px;

          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 10px 25px
            rgba(37,99,235,0.22);

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;

        }


        .continue-btn:hover:not(:disabled) {

          background:
            linear-gradient(
              135deg,
              #3b82f6,
              #2563eb
            );

          transform:
            translateY(-1px);

          box-shadow:
            0 14px 30px
            rgba(37,99,235,0.30);

        }


        .continue-btn:active:not(:disabled) {

          transform:
            translateY(0);

        }


        .continue-btn:disabled {

          cursor: not-allowed;

          opacity: 0.55;

        }


        .button-arrow {

          font-size: 18px;

          line-height: 1;

        }


        /* =========================
           LOGIN NOTE
        ========================= */

        .login-note {

          display: flex;

          gap: 10px;

          margin-top: 22px;

          padding-top: 19px;

          border-top:
            1px solid rgba(148,163,184,0.09);

        }


        .note-icon {

          width: 20px;
          height: 20px;

          flex: 0 0 20px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background:
            rgba(34,197,94,0.10);

          color: #4ade80;

          font-size: 10px;

          font-weight: 900;

        }


        .login-note div {

          display: flex;

          flex-direction: column;

          gap: 3px;

        }


        .login-note strong {

          color: #cbd5e1;

          font-size: 11px;

        }


        .login-note span {

          color: #596980;

          font-size: 10px;

          line-height: 1.4;

        }


        .secure-note {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          margin-top: 14px;

          color: #52627a;

          font-size: 10px;

        }


        .secure-note span {

          color: #22c55e;

          font-size: 7px;

        }


        /* =========================
           FEATURES
        ========================= */

        .features-section {

          margin-top: 115px;

          padding-top: 70px;

          border-top:
            1px solid rgba(148,163,184,0.10);

        }


        .features-heading {

          display: grid;

          grid-template-columns:
            1fr 420px;

          gap: 70px;

          align-items: end;

          margin-bottom: 35px;

        }


        .section-label {

          display: block;

          color: #60a5fa;

          font-size: 9px;

          font-weight: 850;

          letter-spacing: 1.5px;

          margin-bottom: 12px;

        }


        .features-heading h2 {

          margin: 0;

          color: #f8fafc;

          font-size: 38px;

          line-height: 1.08;

          letter-spacing: -1.8px;

        }


        .features-heading > p {

          margin: 0;

          color: #71829d;

          font-size: 13px;

          line-height: 1.75;

        }


        .features-grid {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 12px;

        }


        .feature-card {

          position: relative;

          min-height: 180px;

          padding: 23px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          background:
            linear-gradient(
              145deg,
              rgba(15,28,49,0.84),
              rgba(8,17,31,0.92)
            );

          border:
            1px solid rgba(148,163,184,0.10);

          border-radius: 14px;

          overflow: hidden;

          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;

        }


        .feature-card::before {

          content: "";

          position: absolute;

          top: 0;
          left: 0;

          width: 100%;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(59,130,246,0.55),
              transparent
            );

          opacity: 0;

          transition:
            opacity 0.22s ease;

        }


        .feature-card:hover {

          transform:
            translateY(-4px);

          border-color:
            rgba(59,130,246,0.26);

          box-shadow:
            0 20px 45px
            rgba(0,0,0,0.25);

        }


        .feature-card:hover::before {

          opacity: 1;

        }


        .feature-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

        }


        .feature-number {

          color: #3b82f6;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 0.8px;

        }


        .feature-mini-arrow {

          color: #43536b;

          font-size: 16px;

          transition:
            color 0.2s ease,
            transform 0.2s ease;

        }


        .feature-card:hover .feature-mini-arrow {

          color: #60a5fa;

          transform:
            translate(2px,-2px);

        }


        .feature-content h3 {

          margin: 0 0 8px;

          color: #e2e8f0;

          font-size: 16px;

          letter-spacing: -0.3px;

        }


        .feature-content p {

          max-width: 290px;

          margin: 0;

          color: #64748b;

          font-size: 11px;

          line-height: 1.6;

        }


        .feature-line {

          display: block;

          width: 28px;

          height: 2px;

          border-radius: 10px;

          background:
            #1d4ed8;

          opacity: 0.55;

        }


        /* =========================
           FOOTER
        ========================= */

        .footer {

          position: relative;

          z-index: 1;

          border-top:
            1px solid rgba(148,163,184,0.10);

          background:
            rgba(3,8,18,0.70);

        }


        .footer-inner {

          width:
            min(1180px, calc(100% - 40px));

          min-height: 70px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          color: #52627a;

          font-size: 10px;

        }


        .footer-separator {

          color: #26364d;

        }


        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1050px) {

          .main-container {

            padding-top: 60px;

          }


          .hero-grid {

            gap: 45px;

            grid-template-columns:
              minmax(0, 1fr)
              minmax(320px, 380px);

          }


          .hero-content h1 {

            font-size:
              clamp(44px, 5.5vw, 60px);

          }


          .features-heading {

            grid-template-columns:
              1fr 350px;

            gap: 40px;

          }

        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 820px) {

          .topbar-inner {

            height: 68px;

          }


          .topbar-status {

            display: none;

          }


          .main-container {

            width:
              min(100% - 28px, 600px);

            padding:
              24px 0 55px;

          }


          .hero-grid {

            display: flex;

            flex-direction: column;

            gap: 38px;

          }


          .auth-wrapper {

            order: 1;

          }


          .hero-content {

            order: 2;

          }


          .auth-card {

            padding:
              25px 22px;

            border-radius: 17px;

          }


          .secure-note {

            margin-top: 11px;

          }


          .hero-content h1 {

            font-size:
              clamp(43px, 11vw, 58px);

            letter-spacing: -2.8px;

          }


          .hero-description {

            margin-top: 21px;

            font-size: 14px;

            line-height: 1.65;

          }


          .trust-row {

            gap: 13px 18px;

            margin-top: 21px;

          }


          .resume-preview {

            margin-top: 28px;

          }


          .features-section {

            margin-top: 65px;

            padding-top: 48px;

          }


          .features-heading {

            display: block;

            margin-bottom: 25px;

          }


          .features-heading h2 {

            font-size: 31px;

          }


          .features-heading > p {

            margin-top: 16px;

            font-size: 13px;

          }


          .features-grid {

            grid-template-columns: 1fr;

            gap: 10px;

          }


          .feature-card {

            min-height: 145px;

          }

        }


        /* =========================
           SMALL MOBILE
        ========================= */

        @media (max-width: 520px) {

          .topbar-inner {

            width:
              calc(100% - 28px);

          }


          .brand-mark {

            width: 35px;
            height: 35px;

          }


          .brand-text strong {

            font-size: 16px;

          }


          .brand-text span {

            display: none;

          }


          .main-container {

            width:
              calc(100% - 24px);

          }


          .auth-card {

            padding:
              22px 18px;

          }


          .auth-card h2 {

            font-size: 21px;

          }


          .login-description {

            margin-top: 18px;

            margin-bottom: 21px;

          }


          .nickname-input,
          .continue-btn {

            height: 48px;

          }


          .hero-content h1 {

            font-size: 43px;

            letter-spacing: -2.5px;

          }


          .hero-description {

            font-size: 13px;

          }


          .trust-row {

            display: grid;

            grid-template-columns:
              repeat(2, auto);

            justify-content: start;

          }


          .preview-body {

            grid-template-columns: 1fr;

            padding: 13px;

          }


          .analysis-panel {

            padding:
              4px 5px 8px;

          }


          .document {

            padding: 13px;

          }


          .features-heading h2 {

            font-size: 29px;

          }


          .feature-card {

            min-height: 135px;

            padding: 19px;

          }


          .footer-inner {

            width:
              calc(100% - 25px);

            flex-direction: column;

            gap: 4px;

            padding:
              15px 0;

          }


          .footer-separator {

            display: none;

          }

        }


        /* =========================
           VERY SMALL
        ========================= */

        @media (max-width: 360px) {

          .hero-content h1 {

            font-size: 38px;

          }


          .auth-card {

            padding:
              19px 15px;

          }


          .auth-card-top {

            gap: 9px;

          }


          .login-icon {

            width: 39px;
            height: 39px;

          }


          .auth-card h2 {

            font-size: 19px;

          }


          .trust-row {

            grid-template-columns: 1fr;

          }

        }

      `}</style>

    </div>
  )
}