import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ScanSearch,
  FileEdit,
  History as HistoryIcon,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

const OPTIONS = [
  {
    to: '/app/analyze',
    Icon: ScanSearch,
    title: 'Analyze a resume with AI',
    body: 'Upload a resume, paste a job description, and get an ATS score, keyword gaps, and AI-written improvement suggestions.',
    cta: 'Run a scan',
  },
  {
    to: '/app/builder',
    Icon: FileEdit,
    title: 'Build a new resume',
    body: 'Fill in your experience, pick an ATS-safe template, preview it live, and download it as a PDF.',
    cta: 'Open builder',
  },
  {
    to: '/app/history',
    Icon: HistoryIcon,
    title: 'AI suggestions & history',
    body: 'Revisit past scans, compare scores over time, and see how each edit moved your ATS score.',
    cta: 'View history',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { displayName } = useAuth()
  const [stats, setStats] = useState({ count: 0, best: null, latest: null })

  useEffect(() => {
    api.get('/analyses/').then(({ data }) => {
      const list = data.results || data
      if (list.length === 0) return
      const best = Math.max(...list.map((a) => a.ats_score))
      setStats({ count: list.length, best, latest: list[0] })
    })
  }, [])

  return (
    <div className="home-page">

      {/* Background decoration */}
      <div className="page-glow page-glow-one" />
      <div className="page-glow page-glow-two" />

      {/* =========================
          HERO
      ========================= */}

      <section className="home-hero">

        <div className="hero-grid" />

        <div className="hero-content">

          <div className="hero-badge">
            <span className="badge-dot" />
            <Sparkles size={14} />
            <span>AI Resume Assistant</span>
          </div>

          <h1>
            Welcome back,
            <br />
            <span>{displayName}.</span>
          </h1>

          <p>
            Build stronger resumes, analyze your ATS score, and improve your
            chances of getting noticed.
          </p>

          <div className="hero-status">
            <div className="status-icon">
              <Sparkles size={13} />
            </div>

            <span>
              Your AI-powered career workspace is ready.
            </span>
          </div>

        </div>

        {/* Hero visual */}

        <div className="hero-visual">

          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-orbit orbit-three" />

          <div className="visual-core">

            <div className="core-icon">
              <BarChart3 size={29} />
            </div>

            <div className="core-lines">
              <span />
              <span />
              <span />
            </div>

          </div>

          <div className="floating-card floating-card-top">
            <div className="floating-icon">
              <ScanSearch size={14} />
            </div>

            <div>
              <strong>ATS Analysis</strong>
              <span>AI powered</span>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <div className="mini-score">
              <span>ATS</span>
              <strong>{stats.best ? Math.round(stats.best) : '--'}</strong>
            </div>

            <div>
              <strong>Resume score</strong>
              <span>Keep improving</span>
            </div>
          </div>

        </div>

      </section>

      {/* =========================
          STATS
      ========================= */}

      {stats.count > 0 && (
        <div className="home-stats">

          <div className="stat-item">

            <div className="stats-icon">
              <TrendingUp size={18} />
            </div>

            <div className="stats-content">
              <span>Total scans</span>

              <strong>
                {stats.count}
              </strong>
            </div>

          </div>

          <div className="stats-divider" />

          <div className="stat-item">

            <div className="stats-icon">
              <BarChart3 size={18} />
            </div>

            <div className="stats-content">
              <span>Best ATS score</span>

              <strong>
                {Math.round(stats.best)}/100
              </strong>
            </div>

          </div>

          <div className="stats-right">
            <span className="live-dot" />
            <span>Tracking your progress</span>
          </div>

        </div>
      )}

      {/* =========================
          SECTION HEADING
      ========================= */}

      <div className="section-heading">

        <div>

          <div className="section-title-row">

            <span className="section-eyebrow">
              GET STARTED
            </span>

            <span className="section-line" />

          </div>

          <h2>
            What would you like to do?
          </h2>

        </div>

        <p>
          Choose an option below to continue.
        </p>

      </div>

      {/* =========================
          OPTIONS
      ========================= */}

      <div className="options-grid">

        {OPTIONS.map(({ to, Icon, title, body, cta }, index) => (

          <button
            key={to}
            onClick={() => navigate(to)}
            className="option-card"
          >

            {/* Background number */}

            <span className="card-number-bg">
              0{index + 1}
            </span>

            {/* Card top */}

            <div className="option-top">

              <div className="option-icon">

                <div className="icon-glow" />

                <Icon
                  size={22}
                  strokeWidth={1.8}
                />

              </div>

              <span className="option-number">
                0{index + 1}
              </span>

            </div>

            {/* Content */}

            <div className="option-content">

              <div className="card-label">
                {index === 0 && 'AI ANALYSIS'}
                {index === 1 && 'RESUME CREATION'}
                {index === 2 && 'YOUR PROGRESS'}
              </div>

              <h3>
                {title}
              </h3>

              <p>
                {body}
              </p>

            </div>

            {/* Footer */}

            <div className="option-footer">

              <span>
                {cta}
              </span>

              <div className="arrow-circle">
                <ArrowRight size={16} />
              </div>

            </div>

          </button>

        ))}

      </div>

      {/* =========================
          BOTTOM HINT
      ========================= */}

      <div className="home-hint">

        <div className="hint-line" />

        <div className="hint-content">

          <Sparkles size={12} />

          <span>
            Your resume journey starts here
          </span>

        </div>

        <div className="hint-line" />

      </div>

      <style>{`

        /* =====================================================
           MAIN
        ===================================================== */

        .home-page {
          position: relative;
          width: 100%;
          min-height: 100%;
          padding-bottom: 20px;
          color: #e8f1ff;
          box-sizing: border-box;
          overflow: hidden;
        }

        .page-glow {
          position: fixed;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.12;
          z-index: 0;
        }

        .page-glow-one {
          width: 300px;
          height: 300px;
          top: 5%;
          right: -100px;
          background: #1769ff;
        }

        .page-glow-two {
          width: 250px;
          height: 250px;
          bottom: 5%;
          left: -120px;
          background: #0b4dcc;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .home-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 275px;
          padding: 42px 44px;
          margin-bottom: 20px;

          border: 1px solid rgba(73, 132, 220, 0.25);
          border-radius: 20px;

          background:
            radial-gradient(
              circle at 80% 40%,
              rgba(20, 91, 210, 0.22),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #07152e 0%,
              #0a1b3a 48%,
              #0b2248 100%
            );

          box-shadow:
            0 20px 55px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.035);

          box-sizing: border-box;
          isolation: isolate;
        }

        .home-hero::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;

          background:
            linear-gradient(
              to bottom,
              #4b9cff,
              #1769ff,
              transparent
            );

          box-shadow:
            0 0 20px rgba(37, 125, 255, 0.7);
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.25;

          background-image:
            linear-gradient(
              rgba(87, 143, 220, 0.07) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(87, 143, 220, 0.07) 1px,
              transparent 1px
            );

          background-size: 35px 35px;

          mask-image:
            linear-gradient(
              to right,
              transparent,
              black 40%,
              black 75%,
              transparent
            );

          z-index: -1;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 650px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 7px 12px;
          margin-bottom: 18px;

          border: 1px solid rgba(87, 151, 255, 0.28);
          border-radius: 999px;

          background: rgba(26, 74, 145, 0.24);

          color: #83baff;

          font-size: 0.69rem;
          font-weight: 750;
          letter-spacing: 0.08em;
          text-transform: uppercase;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #55a4ff;

          box-shadow:
            0 0 10px rgba(85, 164, 255, 0.9);
        }

        .home-hero h1 {
          margin: 0;

          color: #f4f8ff;

          font-size: clamp(
            1.85rem,
            3.4vw,
            2.55rem
          );

          line-height: 1.13;
          letter-spacing: -0.045em;
          font-weight: 750;
        }

        .home-hero h1 span {
          color: #4f9cff;

          text-shadow:
            0 0 25px rgba(59, 130, 246, 0.2);
        }

        .home-hero p {
          max-width: 610px;
          margin: 14px 0 0;

          color: #91a7c6;

          font-size: 0.91rem;
          line-height: 1.7;
        }

        .hero-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-top: 22px;

          color: #7590b5;
          font-size: 0.72rem;
        }

        .status-icon {
          width: 23px;
          height: 23px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 7px;

          color: #67aaff;

          background: rgba(35, 105, 205, 0.16);
          border: 1px solid rgba(68, 137, 228, 0.18);
        }


        /* =====================================================
           HERO VISUAL
        ===================================================== */

        .hero-visual {
          position: relative;

          width: 220px;
          height: 220px;

          flex-shrink: 0;
          margin-right: 18px;
        }

        .visual-orbit {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          border: 1px solid
            rgba(74, 145, 239, 0.14);
        }

        .orbit-one {
          width: 210px;
          height: 210px;
        }

        .orbit-two {
          width: 155px;
          height: 155px;

          border-color:
            rgba(74, 145, 239, 0.2);
        }

        .orbit-three {
          width: 105px;
          height: 105px;

          border-color:
            rgba(74, 145, 239, 0.27);
        }

        .visual-core {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          width: 82px;
          height: 82px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border-radius: 23px;

          background:
            linear-gradient(
              145deg,
              #12376e,
              #0b234b
            );

          border:
            1px solid rgba(93, 159, 247, 0.35);

          box-shadow:
            0 0 45px rgba(25, 112, 230, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .core-icon {
          color: #6db1ff;
          margin-bottom: 6px;
        }

        .core-lines {
          display: flex;
          gap: 3px;
          align-items: flex-end;
        }

        .core-lines span {
          display: block;
          width: 3px;
          border-radius: 4px;
          background: #4b9cff;
        }

        .core-lines span:nth-child(1) {
          height: 6px;
          opacity: 0.5;
        }

        .core-lines span:nth-child(2) {
          height: 10px;
          opacity: 0.75;
        }

        .core-lines span:nth-child(3) {
          height: 14px;
        }


        /* =====================================================
           FLOATING CARDS
        ===================================================== */

        .floating-card {
          position: absolute;

          display: flex;
          align-items: center;
          gap: 8px;

          padding: 9px 11px;

          border-radius: 10px;

          background:
            rgba(8, 27, 58, 0.82);

          border:
            1px solid rgba(80, 143, 228, 0.23);

          box-shadow:
            0 12px 30px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.04);

          backdrop-filter: blur(12px);

          white-space: nowrap;
        }

        .floating-card strong {
          display: block;

          color: #d9e9ff;

          font-size: 0.62rem;
          font-weight: 700;
        }

        .floating-card span {
          display: block;

          margin-top: 2px;

          color: #6683a9;

          font-size: 0.54rem;
        }

        .floating-icon {
          width: 25px;
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 7px;

          color: #69adff;

          background:
            rgba(44, 119, 226, 0.14);
        }

        .floating-card-top {
          top: 8px;
          right: -10px;
        }

        .floating-card-bottom {
          bottom: 8px;
          left: -15px;
        }

        .mini-score {
          width: 30px;
          height: 30px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background:
            rgba(30, 102, 211, 0.18);

          border:
            1px solid rgba(68, 139, 232, 0.2);
        }

        .mini-score span {
          margin: 0;

          color: #6187b4;

          font-size: 0.43rem;
          font-weight: 700;
        }

        .mini-score strong {
          margin: 0;

          color: #66adff;

          font-size: 0.67rem;
        }


        /* =====================================================
           STATS
        ===================================================== */

        .home-stats {
          position: relative;

          display: flex;
          align-items: center;

          min-height: 72px;

          padding: 10px 16px;
          margin-bottom: 36px;

          border:
            1px solid rgba(70, 122, 193, 0.23);

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              rgba(8, 27, 57, 0.96),
              rgba(8, 22, 47, 0.96)
            );

          box-shadow:
            0 12px 30px rgba(0,0,0,0.17),
            inset 0 1px 0 rgba(255,255,255,0.025);

          box-sizing: border-box;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .stats-icon {
          width: 39px;
          height: 39px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          color: #5fa8ff;

          background:
            linear-gradient(
              145deg,
              rgba(37, 99, 235, 0.19),
              rgba(23, 71, 145, 0.12)
            );

          border:
            1px solid rgba(74, 143, 230, 0.18);
        }

        .stats-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .stats-content span {
          color: #6882a6;
          font-size: 0.67rem;
        }

        .stats-content strong {
          color: #e6f0ff;
          font-size: 0.94rem;
          font-weight: 750;
        }

        .stats-divider {
          width: 1px;
          height: 34px;

          margin: 0 25px;

          background:
            rgba(95, 135, 182, 0.17);
        }

        .stats-right {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-left: auto;

          color: #5f789b;

          font-size: 0.66rem;
        }

        .live-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #35c48a;

          box-shadow:
            0 0 10px rgba(53, 196, 138, 0.7);
        }


        /* =====================================================
           SECTION
        ===================================================== */

        .section-heading {
          position: relative;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 18px;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 5px;
        }

        .section-eyebrow {
          color: #559fff;

          font-size: 0.64rem;
          font-weight: 800;

          letter-spacing: 0.15em;
        }

        .section-line {
          width: 28px;
          height: 1px;

          background:
            linear-gradient(
              to right,
              #357fe0,
              transparent
            );
        }

        .section-heading h2 {
          margin: 0;

          color: #edf5ff;

          font-size: 1.25rem;
          font-weight: 700;

          letter-spacing: -0.025em;
        }

        .section-heading p {
          margin: 0 3px 2px 0;

          color: #637c9f;

          font-size: 0.76rem;
        }


        /* =====================================================
           CARDS
        ===================================================== */

        .options-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 17px;
        }

        .option-card {
          position: relative;

          min-width: 0;
          min-height: 295px;

          padding: 23px;

          display: flex;
          flex-direction: column;

          text-align: left;

          border:
            1px solid rgba(73, 119, 180, 0.2);

          border-radius: 16px;

          background:
            linear-gradient(
              145deg,
              #091b38 0%,
              #07162f 100%
            );

          color: #e8f1ff;

          cursor: pointer;

          overflow: hidden;

          box-sizing: border-box;

          box-shadow:
            0 10px 28px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.025);

          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease;
        }

        .option-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 20px;
          right: 20px;

          height: 2px;

          border-radius:
            0 0 4px 4px;

          background:
            linear-gradient(
              90deg,
              rgba(42, 111, 219, 0.2),
              rgba(74, 155, 255, 0.55),
              rgba(42, 111, 219, 0.2)
            );

          opacity: 0.7;

          transition:
            opacity 0.22s ease;
        }

        .option-card::after {
          content: "";

          position: absolute;

          width: 150px;
          height: 150px;

          right: -80px;
          bottom: -90px;

          border-radius: 50%;

          background:
            rgba(27, 103, 220, 0.11);

          filter: blur(25px);

          transition:
            transform 0.3s ease;
        }

        .option-card:hover {
          transform: translateY(-5px);

          border-color:
            rgba(72, 145, 232, 0.42);

          background:
            linear-gradient(
              145deg,
              #0b2144 0%,
              #081a38 100%
            );

          box-shadow:
            0 18px 40px rgba(0,0,0,0.26),
            0 0 30px rgba(24, 93, 190, 0.08);
        }

        .option-card:hover::before {
          opacity: 1;
        }

        .option-card:hover::after {
          transform: scale(1.35);
        }

        .option-card:active {
          transform: translateY(-2px);
        }

        .option-card:focus-visible {
          outline:
            2px solid rgba(69, 148, 255, 0.6);

          outline-offset: 3px;
        }


        /* Background number */

        .card-number-bg {
          position: absolute;

          right: 16px;
          top: 36px;

          color: rgba(72, 132, 214, 0.045);

          font-size: 5rem;
          font-weight: 800;

          line-height: 1;

          pointer-events: none;

          letter-spacing: -0.08em;
        }


        /* Card top */

        .option-top {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 23px;
        }

        .option-icon {
          position: relative;

          width: 47px;
          height: 47px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              145deg,
              rgba(39, 112, 224, 0.2),
              rgba(18, 59, 122, 0.17)
            );

          border:
            1px solid rgba(73, 143, 231, 0.25);

          color: #65aaff;

          overflow: hidden;

          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            background 0.22s ease;
        }

        .icon-glow {
          position: absolute;

          width: 30px;
          height: 30px;

          border-radius: 50%;

          background:
            rgba(52, 139, 255, 0.25);

          filter: blur(12px);

          opacity: 0.5;
        }

        .option-icon svg {
          position: relative;
          z-index: 2;
        }

        .option-card:hover .option-icon {
          transform: translateY(-2px);

          border-color:
            rgba(84, 158, 244, 0.45);

          background:
            rgba(40, 115, 222, 0.22);
        }

        .option-number {
          color: #476688;

          font-size: 0.65rem;
          font-weight: 800;

          letter-spacing: 0.12em;
        }


        /* Content */

        .option-content {
          position: relative;
          z-index: 2;

          flex: 1;
        }

        .card-label {
          margin-bottom: 8px;

          color: #438de9;

          font-size: 0.57rem;
          font-weight: 800;

          letter-spacing: 0.13em;
        }

        .option-content h3 {
          margin: 0 0 9px;

          color: #e9f2ff;

          font-size: 1.03rem;
          font-weight: 700;

          line-height: 1.35;

          letter-spacing: -0.018em;
        }

        .option-content p {
          margin: 0;

          color: #7189aa;

          font-size: 0.81rem;

          line-height: 1.68;
        }


        /* Footer */

        .option-footer {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding-top: 14px;
          margin-top: 19px;

          border-top:
            1px solid rgba(87, 124, 168, 0.12);

          color: #5ba4ff;

          font-size: 0.76rem;
          font-weight: 700;
        }

        .arrow-circle {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(39, 111, 221, 0.11);

          border:
            1px solid rgba(68, 133, 218, 0.15);

          color: #62a9ff;

          transition:
            background 0.22s ease,
            color 0.22s ease,
            transform 0.22s ease,
            border-color 0.22s ease;
        }

        .option-card:hover .arrow-circle {
          background: #287be0;

          border-color: #3f91f1;

          color: white;

          transform: translateX(4px);

          box-shadow:
            0 4px 14px rgba(40, 123, 224, 0.25);
        }


        /* =====================================================
           BOTTOM HINT
        ===================================================== */

        .home-hint {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 12px;

          margin-top: 38px;

          color: #3f5878;

          font-size: 0.67rem;

          letter-spacing: 0.04em;
        }

        .hint-line {
          width: 55px;
          height: 1px;

          background:
            linear-gradient(
              to right,
              transparent,
              rgba(72, 112, 163, 0.3)
            );
        }

        .hint-line:last-child {
          background:
            linear-gradient(
              to left,
              transparent,
              rgba(72, 112, 163, 0.3)
            );
        }

        .hint-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hint-content svg {
          color: #477fbf;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1000px) {

          .home-hero {
            padding: 34px;
          }

          .hero-visual {
            transform: scale(0.88);
            margin-right: -5px;
          }

          .options-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .option-card:last-child {
            grid-column: span 2;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .home-hero {
            min-height: auto;

            padding: 28px 23px;

            border-radius: 16px;
          }

          .hero-visual {
            display: none;
          }

          .home-hero h1 {
            font-size: 1.7rem;
          }

          .home-hero p {
            max-width: 100%;
            font-size: 0.84rem;
          }

          .hero-status {
            font-size: 0.66rem;
          }

          .home-stats {
            margin-bottom: 28px;
          }

          .stats-right {
            display: none;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 6px;
          }

          .options-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .option-card:last-child {
            grid-column: auto;
          }

          .option-card {
            min-height: 250px;
            padding: 21px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .home-hero {
            padding: 24px 19px;
          }

          .home-hero h1 {
            font-size: 1.48rem;
          }

          .hero-badge {
            font-size: 0.61rem;
            padding: 6px 9px;
          }

          .home-hero p {
            font-size: 0.8rem;
            line-height: 1.65;
          }

          .hero-status {
            margin-top: 17px;
          }

          .home-stats {
            gap: 8px;
            padding: 10px 12px;
          }

          .stats-icon {
            width: 35px;
            height: 35px;
          }

          .stats-divider {
            margin: 0 7px;
          }

          .stats-content span {
            font-size: 0.6rem;
          }

          .stats-content strong {
            font-size: 0.85rem;
          }

          .section-heading h2 {
            font-size: 1.08rem;
          }

          .section-heading p {
            font-size: 0.68rem;
          }

          .option-card {
            min-height: 235px;
            padding: 19px;
          }

          .option-content h3 {
            font-size: 0.98rem;
          }

          .option-content p {
            font-size: 0.78rem;
          }

          .home-hint {
            margin-top: 29px;
            font-size: 0.61rem;
          }

          .hint-line {
            width: 30px;
          }

        }


        /* =====================================================
           VERY SMALL
        ===================================================== */

        @media (max-width: 340px) {

          .home-hero {
            padding: 21px 16px;
          }

          .home-hero h1 {
            font-size: 1.32rem;
          }

          .home-hero p {
            font-size: 0.76rem;
          }

          .home-stats {
            flex-wrap: wrap;
          }

          .stats-divider {
            display: none;
          }

          .stat-item {
            gap: 7px;
          }

          .option-card {
            padding: 17px;
          }

          .card-number-bg {
            font-size: 4rem;
          }

        }

      `}</style>

    </div>
  )
}