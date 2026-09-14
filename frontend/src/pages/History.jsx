import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSearch,
  History as HistoryIcon,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import api from '../api/axios.js'
import ScoreGauge from '../components/ScoreGauge.jsx'

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [selected, setSelected] = useState([])
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comparing, setComparing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalyses()
  }, [])

  async function loadAnalyses() {
    try {
      setLoading(true)
      setError('')

      const { data } = await api.get('/analyses/')
      setAnalyses(data.results || data)
    } catch (err) {
      setError('Unable to load your analysis history.')
    } finally {
      setLoading(false)
    }
  }

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev
    )
  }

  async function compare() {
    if (selected.length < 2) return

    try {
      setComparing(true)

      const { data } = await api.get(
        `/analyses/compare/?ids=${selected.join(',')}`
      )

      setComparison(data)
    } catch (err) {
      setError('Unable to compare the selected analyses.')
    } finally {
      setComparing(false)
    }
  }

  const averageScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce(
            (sum, item) => sum + Number(item.ats_score || 0),
            0
          ) / analyses.length
        )
      : 0

  const bestScore =
    analyses.length > 0
      ? Math.max(...analyses.map((item) => Number(item.ats_score || 0)))
      : 0

  const strongMatches = analyses.filter(
    (item) => Number(item.ats_score) >= 80
  ).length

  function getStatus(score) {
    const value = Number(score || 0)

    if (value >= 80) {
      return {
        label: 'Strong match',
        className: 'status-excellent',
      }
    }

    if (value >= 60) {
      return {
        label: 'Good match',
        className: 'status-good',
      }
    }

    return {
      label: 'Needs improvement',
      className: 'status-improve',
    }
  }

  return (
    <div className="history-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="history-header">

        <div className="header-left">

          <div className="header-icon">
            <HistoryIcon size={22} strokeWidth={2.1} />
          </div>

          <div className="header-content">

            <div className="eyebrow">
              ATS PERFORMANCE CENTER
            </div>

            <h1>
              Analysis history
            </h1>

            <p>
              Review your resume scans, track improvements and compare
              ATS performance over time.
            </p>

          </div>

        </div>

        <div className="header-right">

          <div className="live-status">
            <span className="live-dot" />
            Analysis tracking active
          </div>

          <div className="scan-counter">

            <strong>
              {analyses.length}
            </strong>

            <span>
              {analyses.length === 1 ? 'Total scan' : 'Total scans'}
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="error-banner">

          <div className="error-icon">
            !
          </div>

          <span>
            {error}
          </span>

          <button onClick={loadAnalyses}>
            Retry
          </button>

        </div>

      )}


      {/* =====================================================
          OVERVIEW STATS
      ===================================================== */}

      {!loading && analyses.length > 0 && (

        <section className="stats-grid">

          {/* Average */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon blue">
                <Activity size={17} />
              </div>

              <span className="stat-label">
                Average ATS
              </span>

            </div>

            <div className="stat-main">

              <strong>
                {averageScore}
              </strong>

              <span>
                /100
              </span>

            </div>

            <div className="stat-progress">

              <div
                className="stat-progress-fill"
                style={{
                  width: `${Math.min(averageScore, 100)}%`,
                }}
              />

            </div>

            <p>
              Your overall resume performance
            </p>

          </div>


          {/* Best */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon green">
                <Trophy size={17} />
              </div>

              <span className="stat-label">
                Best score
              </span>

            </div>

            <div className="stat-main">

              <strong>
                {Math.round(bestScore)}
              </strong>

              <span>
                /100
              </span>

            </div>

            <div className="stat-mini-status">
              <CheckCircle2 size={12} />
              Personal best
            </div>

            <p>
              Your highest recorded ATS score
            </p>

          </div>


          {/* Strong Matches */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon violet">
                <Target size={17} />
              </div>

              <span className="stat-label">
                Strong matches
              </span>

            </div>

            <div className="stat-main">

              <strong>
                {strongMatches}
              </strong>

              <span>
                scans
              </span>

            </div>

            <div className="stat-mini-status neutral">
              <TrendingUp size={12} />
              80+ ATS score
            </div>

            <p>
              Analyses reaching strong-match range
            </p>

          </div>


          {/* Compare */}

          <div className="stat-card stat-card-action">

            <div className="stat-top">

              <div className="stat-icon orange">
                <BarChart3 size={17} />
              </div>

              <span className="stat-label">
                Compare
              </span>

            </div>

            <div className="stat-action-title">
              Track progress
            </div>

            <p>
              Select 2–4 scans below to compare your results.
            </p>

            <div className="stat-action-hint">
              <Sparkles size={12} />
              Select analyses below
            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="history-toolbar">

        <div className="toolbar-left">

          <div className="toolbar-icon">
            <FileSearch size={16} />
          </div>

          <div>

            <strong>
              Your resume analyses
            </strong>

            <span>
              Select 2–4 analyses to compare ATS performance.
            </span>

          </div>

        </div>

        <div className="selection-badge">

          <span className="selection-dot" />

          {selected.length}
          <span>/4 selected</span>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="loading-list">

          {[1, 2, 3, 4].map((item) => (

            <div
              className="skeleton-card"
              key={item}
            >

              <div className="skeleton skeleton-check" />

              <div className="skeleton skeleton-score" />

              <div className="skeleton-content">

                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-meta" />

              </div>

              <div className="skeleton skeleton-status" />

            </div>

          ))}

        </div>

      )}


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading && analyses.length === 0 && (

        <div className="empty-state">

          <div className="empty-visual">

            <div className="empty-ring ring-one" />
            <div className="empty-ring ring-two" />

            <div className="empty-icon">
              <FileSearch size={25} />
            </div>

          </div>

          <div className="empty-eyebrow">
            READY WHEN YOU ARE
          </div>

          <h2>
            No analyses yet
          </h2>

          <p>
            Run an ATS scan from the Analyze tab and your resume
            results will appear here automatically.
          </p>

          <div className="empty-features">

            <span>
              <Check size={12} />
              ATS scoring
            </span>

            <span>
              <Check size={12} />
              Resume tracking
            </span>

            <span>
              <Check size={12} />
              Progress comparison
            </span>

          </div>

        </div>

      )}


      {/* =====================================================
          ANALYSIS LIST
      ===================================================== */}

      {!loading && analyses.length > 0 && (

        <div className="analysis-list">

          {analyses.map((a, index) => {

            const isSelected = selected.includes(a.id)
            const score = Math.round(Number(a.ats_score || 0))
            const status = getStatus(score)

            return (

              <label
                key={a.id}
                className={`analysis-card ${
                  isSelected ? 'analysis-selected' : ''
                }`}
              >

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(a.id)}
                />


                {/* Selection */}

                <div className="selection-check">

                  {isSelected && (
                    <Check
                      size={12}
                      strokeWidth={3}
                    />
                  )}

                </div>


                {/* Rank */}

                <div className="analysis-index">
                  {String(index + 1).padStart(2, '0')}
                </div>


                {/* Score */}

                <div className="score-block">

                  <div className="score-number">
                    {score}
                  </div>

                  <div className="score-label">
                    ATS SCORE
                  </div>

                </div>


                {/* Score mini bar */}

                <div className="score-bar-wrap">

                  <div className="score-bar">

                    <div
                      className={`score-bar-fill ${
                        score >= 80
                          ? 'bar-excellent'
                          : score >= 60
                            ? 'bar-good'
                            : 'bar-improve'
                      }`}
                      style={{
                        width: `${Math.min(score, 100)}%`,
                      }}
                    />

                  </div>

                  <span>
                    {score >= 80
                      ? 'High compatibility'
                      : score >= 60
                        ? 'Moderate compatibility'
                        : 'Needs optimization'}
                  </span>

                </div>


                {/* Details */}

                <div className="analysis-details">

                  <div className="analysis-title">

                    <strong>
                      {a.resume_title || 'Resume'}
                    </strong>

                    <ChevronRight
                      size={13}
                      className="title-arrow"
                    />

                    <span>
                      {a.job_title || 'Job description'}
                    </span>

                  </div>

                  <div className="analysis-meta">

                    <span className="meta-item">

                      <Clock3 size={11} />

                      {new Date(
                        a.created_at
                      ).toLocaleDateString()}

                    </span>

                    <span className="meta-divider" />

                    <span className="meta-item">

                      {new Date(
                        a.created_at
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}

                    </span>

                  </div>

                </div>


                {/* Status */}

                <div className="analysis-status">

                  <span
                    className={`status-pill ${status.className}`}
                  >

                    <span className="status-dot" />

                    {status.label}

                  </span>

                </div>


                {/* Arrow */}

                <div className="row-arrow">

                  <ArrowRight size={15} />

                </div>

              </label>

            )
          })}

        </div>

      )}


      {/* =====================================================
          COMPARE ACTION
      ===================================================== */}

      {selected.length >= 2 && (

        <div className="compare-bar">

          <div className="compare-left">

            <div className="compare-icon">
              <BarChart3 size={17} />
            </div>

            <div>

              <strong>
                {selected.length} analyses ready
              </strong>

              <span>
                Compare ATS scores and see which resume performs better.
              </span>

            </div>

          </div>

          <button
            className="compare-button"
            onClick={compare}
            disabled={comparing}
          >

            {comparing ? (
              <>
                <span className="button-spinner" />
                Comparing...
              </>
            ) : (
              <>
                Compare selected
                <ArrowRight size={15} />
              </>
            )}

          </button>

        </div>

      )}


      {/* =====================================================
          COMPARISON
      ===================================================== */}

      {comparison && (

        <section className="comparison-section">

          <div className="comparison-header">

            <div className="comparison-heading">

              <div className="comparison-eyebrow">
                PERFORMANCE REVIEW
              </div>

              <div className="comparison-title-row">

                <div className="comparison-title-icon">
                  <BarChart3 size={18} />
                </div>

                <div>

                  <h2>
                    ATS score comparison
                  </h2>

                  <p>
                    Compare the scores from your selected resume analyses.
                  </p>

                </div>

              </div>

            </div>

            <div className="comparison-count">

              <span>
                {comparison.length}
              </span>

              results

            </div>

          </div>


          {/* Comparison summary */}

          <div className="comparison-summary">

            <div className="summary-item">

              <span className="summary-label">
                Best score
              </span>

              <strong>
                {comparison.length
                  ? Math.max(
                      ...comparison.map(
                        (item) =>
                          Number(item.ats_score || 0)
                      )
                    ).toFixed(0)
                  : 0}
              </strong>

              <span className="summary-unit">
                /100
              </span>

            </div>

            <div className="summary-divider" />

            <div className="summary-item">

              <span className="summary-label">
                Average
              </span>

              <strong>
                {comparison.length
                  ? Math.round(
                      comparison.reduce(
                        (sum, item) =>
                          sum +
                          Number(item.ats_score || 0),
                        0
                      ) / comparison.length
                    )
                  : 0}
              </strong>

              <span className="summary-unit">
                /100
              </span>

            </div>

            <div className="summary-divider" />

            <div className="summary-item">

              <span className="summary-label">
                Compared
              </span>

              <strong>
                {comparison.length}
              </strong>

              <span className="summary-unit">
                scans
              </span>

            </div>

          </div>


          {/* Comparison cards */}

          <div className="comparison-grid">

            {comparison.map((c, index) => {

              const score = Math.round(
                Number(c.ats_score || 0)
              )

              const status = getStatus(score)

              return (

                <div
                  key={c.id}
                  className={`comparison-card ${
                    index === 0
                      ? 'comparison-top'
                      : ''
                  }`}
                >

                  {index === 0 && (

                    <div className="best-badge">

                      <Trophy size={11} />

                      Best result

                    </div>

                  )}


                  <div className="comparison-card-top">

                    <span className="comparison-number">
                      #{index + 1}
                    </span>

                    <span className="comparison-date">

                      {new Date(
                        c.created_at
                      ).toLocaleDateString()}

                    </span>

                  </div>


                  <div className="comparison-gauge">

                    <ScoreGauge
                      score={c.ats_score}
                      size={105}
                      label={new Date(
                        c.created_at
                      ).toLocaleDateString()}
                    />

                  </div>


                  <div className="comparison-score">

                    <strong>
                      {score}
                    </strong>

                    <span>
                      / 100
                    </span>

                  </div>


                  <div
                    className={`comparison-status ${status.className}`}
                  >

                    <span className="status-dot" />

                    {status.label}

                  </div>


                  <div className="comparison-line" />

                  <div className="comparison-meta">

                    <span>
                      Analysis #{index + 1}
                    </span>

                    <span>
                      {new Date(
                        c.created_at
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                  </div>

                </div>

              )
            })}

          </div>

        </section>

      )}


      <style>{`

        * {
          box-sizing: border-box;
        }

        .history-page {
          min-height: 100vh;
          width: 100%;
          padding: 30px 30px 80px;

          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(37, 99, 235, 0.07),
              transparent 27%
            ),
            radial-gradient(
              circle at 92% 8%,
              rgba(59, 130, 246, 0.05),
              transparent 25%
            ),
            linear-gradient(
              180deg,
              #f7faff 0%,
              #f9fbff 50%,
              #f3f6fb 100%
            );

          color: #172554;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .history-header {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto 18px;

          min-height: 132px;
          padding: 24px 27px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 25px;

          position: relative;
          overflow: hidden;

          border: 1px solid #d9e3f0;
          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8fbff
            );

          box-shadow:
            0 15px 45px rgba(15, 45, 90, 0.055);
        }


        .history-header::before {
          content: '';

          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 4px;

          background:
            linear-gradient(
              180deg,
              #2563eb,
              #60a5fa
            );
        }


        .history-header::after {
          content: '';

          position: absolute;

          width: 230px;
          height: 230px;

          right: -90px;
          top: -120px;

          border-radius: 50%;

          border: 1px solid rgba(37, 99, 235, 0.07);
        }


        .header-left {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 17px;

          position: relative;
          z-index: 1;
        }


        .header-icon {
          width: 55px;
          height: 55px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          color: #2563eb;

          background:
            linear-gradient(
              135deg,
              #edf5ff,
              #dbeafe
            );

          border: 1px solid #cddff8;

          box-shadow:
            inset 0 1px 0 #ffffff;
        }


        .header-content {
          min-width: 0;
        }


        .eyebrow,
        .comparison-eyebrow {
          margin-bottom: 5px;

          color: #5576a7;

          font-size: 9px;
          line-height: 1;

          font-weight: 900;

          letter-spacing: 1.7px;
        }


        .history-header h1 {
          margin: 0;

          color: #132747;

          font-size: 29px;
          line-height: 1.1;

          font-weight: 800;

          letter-spacing: -1px;
        }


        .history-header p {
          max-width: 650px;

          margin: 7px 0 0;

          color: #7a8aa0;

          font-size: 12px;
          line-height: 1.5;
        }


        .header-right {
          display: flex;
          align-items: center;

          gap: 10px;

          position: relative;
          z-index: 2;
        }


        .live-status {
          display: flex;
          align-items: center;

          gap: 7px;

          padding: 8px 11px;

          border-radius: 9px;

          color: #42658e;

          background: #f4f8fd;

          border: 1px solid #dfe8f3;

          font-size: 8px;
          font-weight: 800;

          white-space: nowrap;
        }


        .live-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 3px rgba(34, 197, 94, 0.09);
        }


        .scan-counter {
          min-width: 76px;

          padding: 10px 12px;

          text-align: center;

          border-radius: 11px;

          background: #eef5ff;

          border: 1px solid #d6e5f8;
        }


        .scan-counter strong {
          display: block;

          color: #1d4ed8;

          font-size: 19px;
          line-height: 1;

          font-weight: 850;
        }


        .scan-counter span {
          display: block;

          margin-top: 4px;

          color: #7890ae;

          font-size: 7px;
          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: .5px;
        }


        /* =====================================================
           ERROR
        ===================================================== */

        .error-banner {
          width: 100%;
          max-width: 1250px;

          margin: 0 auto 15px;

          padding: 11px 14px;

          display: flex;
          align-items: center;

          gap: 10px;

          border-radius: 12px;

          background: #fff6f6;
          border: 1px solid #f1d4d4;

          color: #9f4545;

          font-size: 10px;
        }


        .error-icon {
          width: 24px;
          height: 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 7px;

          background: #fee2e2;

          color: #dc2626;

          font-weight: 900;
        }


        .error-banner button {
          margin-left: auto;

          padding: 6px 10px;

          border: 1px solid #e6baba;
          border-radius: 7px;

          background: #ffffff;

          color: #a74646;

          font-family: inherit;

          font-size: 9px;
          font-weight: 800;

          cursor: pointer;
        }


        /* =====================================================
           STATS
        ===================================================== */

        .stats-grid {
          width: 100%;
          max-width: 1250px;

          margin: 0 auto 18px;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 10px;
        }


        .stat-card {
          min-height: 145px;

          padding: 16px 17px;

          border: 1px solid #dce5f0;

          border-radius: 15px;

          background: #ffffff;

          box-shadow:
            0 6px 23px rgba(15, 45, 90, 0.035);

          transition:
            transform .2s ease,
            border-color .2s ease,
            box-shadow .2s ease;
        }


        .stat-card:hover {
          transform: translateY(-2px);

          border-color: #c8d9ef;

          box-shadow:
            0 12px 30px rgba(15, 45, 90, 0.065);
        }


        .stat-top {
          display: flex;
          align-items: center;

          gap: 8px;
        }


        .stat-icon {
          width: 29px;
          height: 29px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;
        }


        .stat-icon.blue {
          color: #2563eb;
          background: #eaf2ff;
          border: 1px solid #d8e6fa;
        }


        .stat-icon.green {
          color: #15803d;
          background: #eaf8f0;
          border: 1px solid #d4eddf;
        }


        .stat-icon.violet {
          color: #6d4ed3;
          background: #f0ecff;
          border: 1px solid #e1d9fb;
        }


        .stat-icon.orange {
          color: #b66a27;
          background: #fff3e6;
          border: 1px solid #f2dfca;
        }


        .stat-label {
          color: #74859d;

          font-size: 9px;
          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: .7px;
        }


        .stat-main {
          margin-top: 12px;

          display: flex;
          align-items: baseline;

          gap: 4px;
        }


        .stat-main strong {
          color: #172f53;

          font-size: 28px;
          line-height: 1;

          font-weight: 850;

          letter-spacing: -1px;
        }


        .stat-main span {
          color: #94a3b8;

          font-size: 9px;
          font-weight: 700;
        }


        .stat-progress {
          width: 100%;
          height: 4px;

          margin-top: 11px;

          overflow: hidden;

          border-radius: 999px;

          background: #edf2f8;
        }


        .stat-progress-fill {
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #60a5fa
            );
        }


        .stat-card p {
          margin: 9px 0 0;

          color: #94a0b0;

          font-size: 8px;
          line-height: 1.4;
        }


        .stat-mini-status {
          width: fit-content;

          margin-top: 10px;

          padding: 5px 7px;

          display: flex;
          align-items: center;

          gap: 5px;

          border-radius: 6px;

          color: #21804b;

          background: #eefaf3;

          font-size: 7px;
          font-weight: 800;
        }


        .stat-mini-status.neutral {
          color: #58769e;
          background: #f1f6fc;
        }


        .stat-card-action {
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f7faff
            );
        }


        .stat-action-title {
          margin-top: 12px;

          color: #29486e;

          font-size: 16px;
          font-weight: 800;
        }


        .stat-action-hint {
          margin-top: 9px;

          display: flex;
          align-items: center;

          gap: 5px;

          color: #5576a6;

          font-size: 8px;
          font-weight: 800;
        }


        /* =====================================================
           TOOLBAR
        ===================================================== */

        .history-toolbar {
          width: 100%;
          max-width: 1250px;

          margin: 0 auto 10px;

          padding: 12px 14px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border: 1px solid #dce5ef;
          border-radius: 13px;

          background: rgba(255,255,255,.9);

          box-shadow:
            0 4px 16px rgba(15,45,90,.025);
        }


        .toolbar-left {
          display: flex;
          align-items: center;

          gap: 9px;
        }


        .toolbar-icon {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 8px;

          color: #2563eb;

          background: #eaf2ff;

          border: 1px solid #d8e6fa;
        }


        .toolbar-left strong {
          display: block;

          color: #344b6a;

          font-size: 10px;
          font-weight: 850;
        }


        .toolbar-left span {
          display: block;

          margin-top: 2px;

          color: #8b99aa;

          font-size: 8px;
        }


        .selection-badge {
          padding: 6px 9px;

          display: flex;
          align-items: center;

          gap: 5px;

          border-radius: 7px;

          color: #4e6787;

          background: #f3f6fa;

          border: 1px solid #e3e9f0;

          font-size: 8px;
          font-weight: 850;

          white-space: nowrap;
        }


        .selection-badge span {
          color: #92a0b1;

          font-weight: 700;
        }


        .selection-dot {
          width: 5px;
          height: 5px;

          padding: 0 !important;

          border-radius: 50%;

          background: #2563eb;
        }


        /* =====================================================
           ANALYSIS LIST
        ===================================================== */

        .analysis-list {
          width: 100%;
          max-width: 1250px;

          margin: 0 auto;

          display: flex;
          flex-direction: column;

          gap: 8px;
        }


        .analysis-card {
          position: relative;

          min-height: 86px;

          padding: 12px 14px;

          display: flex;
          align-items: center;

          gap: 12px;

          border: 1px solid #dce5ef;
          border-radius: 14px;

          background: #ffffff;

          cursor: pointer;

          box-shadow:
            0 5px 20px rgba(15,45,90,.03);

          transition:
            transform .2s ease,
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }


        .analysis-card:hover {
          transform: translateY(-2px);

          border-color: #b9d0ed;

          box-shadow:
            0 12px 30px rgba(15,45,90,.065);
        }


        .analysis-selected {
          border-color: #77a8e9;

          background:
            linear-gradient(
              135deg,
              #f3f8ff,
              #fbfdff
            );

          box-shadow:
            0 0 0 3px rgba(37,99,235,.055),
            0 12px 28px rgba(37,99,235,.06);
        }


        .analysis-card input {
          position: absolute;

          opacity: 0;

          pointer-events: none;
        }


        .selection-check {
          width: 21px;
          height: 21px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1.5px solid #cbd5e1;

          border-radius: 6px;

          color: #ffffff;

          background: #ffffff;

          transition: .18s ease;
        }


        .analysis-card:hover .selection-check {
          border-color: #8fb5e8;
        }


        .analysis-selected .selection-check {
          border-color: #2563eb;

          background: #2563eb;

          box-shadow:
            0 4px 10px rgba(37,99,235,.2);
        }


        .analysis-index {
          width: 25px;

          flex-shrink: 0;

          color: #b1bdcb;

          font-size: 8px;

          font-weight: 850;

          letter-spacing: .4px;
        }


        .score-block {
          width: 58px;

          flex-shrink: 0;

          text-align: center;
        }


        .score-number {
          color: #18345d;

          font-size: 23px;
          line-height: 1;

          font-weight: 850;

          letter-spacing: -.8px;
        }


        .score-label {
          margin-top: 4px;

          color: #9aa7b8;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: 1px;
        }


        .score-bar-wrap {
          width: 110px;

          flex-shrink: 0;
        }


        .score-bar {
          width: 100%;
          height: 4px;

          overflow: hidden;

          border-radius: 999px;

          background: #edf2f7;
        }


        .score-bar-fill {
          height: 100%;

          border-radius: inherit;

          transition: width .4s ease;
        }


        .bar-excellent {
          background: #22a866;
        }


        .bar-good {
          background: #4d84c9;
        }


        .bar-improve {
          background: #d89555;
        }


        .score-bar-wrap span {
          display: block;

          margin-top: 5px;

          color: #9aa7b7;

          font-size: 6.5px;

          white-space: nowrap;
        }


        .analysis-details {
          flex: 1;

          min-width: 0;
        }


        .analysis-title {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 5px;
        }


        .analysis-title strong {
          max-width: 235px;

          overflow: hidden;

          color: #263d5d;

          font-size: 11px;
          font-weight: 800;

          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .analysis-title span {
          max-width: 240px;

          overflow: hidden;

          color: #66809f;

          font-size: 10px;
          font-weight: 650;

          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .title-arrow {
          flex-shrink: 0;

          color: #a5b3c3;
        }


        .analysis-meta {
          margin-top: 6px;

          display: flex;
          align-items: center;

          gap: 7px;

          color: #96a2b2;

          font-size: 8px;
        }


        .meta-item {
          display: flex;
          align-items: center;

          gap: 4px;
        }


        .meta-divider {
          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: #c8d1dc;
        }


        .analysis-status {
          flex-shrink: 0;
        }


        .status-pill {
          padding: 6px 8px;

          display: flex;
          align-items: center;

          gap: 5px;

          border-radius: 999px;

          font-size: 7.5px;

          font-weight: 850;

          white-space: nowrap;
        }


        .status-dot {
          width: 5px;
          height: 5px;

          flex-shrink: 0;

          border-radius: 50%;

          background: currentColor;
        }


        .status-excellent {
          color: #24794b;

          background: #eaf8f0;

          border: 1px solid #d1ebdc;
        }


        .status-good {
          color: #486c99;

          background: #edf4fc;

          border: 1px solid #dbe7f5;
        }


        .status-improve {
          color: #98643b;

          background: #fff4e8;

          border: 1px solid #f1dfcc;
        }


        .row-arrow {
          width: 28px;
          height: 28px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          color: #8498b1;

          background: #f5f7fa;

          border: 1px solid #e6ebf1;

          transition: .18s ease;
        }


        .analysis-card:hover .row-arrow {
          color: #2563eb;

          background: #eaf2ff;

          border-color: #d5e4f8;

          transform: translateX(2px);
        }


        /* =====================================================
           LOADING
        ===================================================== */

        .loading-list {
          width: 100%;
          max-width: 1250px;

          margin: 0 auto;

          display: flex;
          flex-direction: column;

          gap: 8px;
        }


        .skeleton-card {
          height: 86px;

          padding: 12px 14px;

          display: flex;
          align-items: center;

          gap: 13px;

          border: 1px solid #e1e8f1;

          border-radius: 14px;

          background: #ffffff;
        }


        .skeleton {
          position: relative;

          overflow: hidden;

          border-radius: 7px;

          background: #edf2f7;
        }


        .skeleton::after {
          content: '';

          position: absolute;

          inset: 0;

          transform: translateX(-100%);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.75),
              transparent
            );

          animation: shimmer 1.25s infinite;
        }


        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }


        .skeleton-check {
          width: 21px;
          height: 21px;
        }


        .skeleton-score {
          width: 45px;
          height: 27px;
        }


        .skeleton-content {
          flex: 1;
        }


        .skeleton-title {
          width: 42%;
          height: 12px;
        }


        .skeleton-meta {
          width: 23%;
          height: 7px;

          margin-top: 8px;
        }


        .skeleton-status {
          width: 85px;
          height: 25px;
        }


        /* =====================================================
           EMPTY
        ===================================================== */

        .empty-state {
          width: 100%;
          max-width: 620px;

          margin: 45px auto;

          padding: 52px 30px;

          text-align: center;

          border: 1px solid #dce6f1;

          border-radius: 20px;

          background: #ffffff;

          box-shadow:
            0 15px 45px rgba(15,45,90,.055);
        }


        .empty-visual {
          width: 80px;
          height: 80px;

          margin: 0 auto 18px;

          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        .empty-ring {
          position: absolute;

          border: 1px solid #d7e6fa;

          border-radius: 50%;
        }


        .ring-one {
          width: 80px;
          height: 80px;
        }


        .ring-two {
          width: 62px;
          height: 62px;

          border-color: #e4edf8;
        }


        .empty-icon {
          width: 43px;
          height: 43px;

          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          color: #2563eb;

          background: #edf5ff;

          border: 1px solid #d4e4f9;
        }


        .empty-eyebrow {
          color: #6683a8;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }


        .empty-state h2 {
          margin: 7px 0 0;

          color: #263c5b;

          font-size: 21px;
        }


        .empty-state p {
          max-width: 410px;

          margin: 9px auto 0;

          color: #8a99ab;

          font-size: 11px;

          line-height: 1.6;
        }


        .empty-features {
          margin-top: 19px;

          display: flex;
          justify-content: center;
          flex-wrap: wrap;

          gap: 7px;
        }


        .empty-features span {
          padding: 6px 8px;

          display: flex;
          align-items: center;

          gap: 4px;

          border-radius: 7px;

          color: #597594;

          background: #f4f7fb;

          border: 1px solid #e4eaf1;

          font-size: 7px;
          font-weight: 800;
        }


        /* =====================================================
           COMPARE BAR
        ===================================================== */

        .compare-bar {
          width: 100%;
          max-width: 1250px;

          margin: 17px auto 25px;

          padding: 13px 14px 13px 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border: 1px solid #bcd3f3;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #edf5ff,
              #f9fbff
            );

          box-shadow:
            0 10px 28px rgba(37,99,235,.055);
        }


        .compare-left {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 10px;
        }


        .compare-icon {
          width: 34px;
          height: 34px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #2563eb;

          background: #dceaff;

          border: 1px solid #c9ddf8;
        }


        .compare-left strong {
          display: block;

          color: #29476d;

          font-size: 10px;
          font-weight: 850;
        }


        .compare-left span {
          display: block;

          margin-top: 2px;

          color: #7e91aa;

          font-size: 8px;
        }


        .compare-button {
          min-height: 38px;

          padding: 0 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border: 0;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          color: #ffffff;

          font-family: inherit;

          font-size: 9px;
          font-weight: 850;

          cursor: pointer;

          box-shadow:
            0 7px 18px rgba(37,99,235,.22);

          transition: .18s ease;
        }


        .compare-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 10px 23px rgba(37,99,235,.27);
        }


        .compare-button:disabled {
          opacity: .7;

          cursor: wait;

          transform: none;
        }


        .button-spinner {
          width: 12px;
          height: 12px;

          border: 2px solid rgba(255,255,255,.4);
          border-top-color: #ffffff;

          border-radius: 50%;

          animation: spin .7s linear infinite;
        }


        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* =====================================================
           COMPARISON
        ===================================================== */

        .comparison-section {
          width: 100%;
          max-width: 1250px;

          margin: 0 auto;

          padding: 23px;

          border: 1px solid #d9e3ee;

          border-radius: 20px;

          background: #ffffff;

          box-shadow:
            0 14px 40px rgba(15,45,90,.055);
        }


        .comparison-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding-bottom: 18px;

          border-bottom: 1px solid #edf1f5;
        }


        .comparison-heading {
          min-width: 0;
        }


        .comparison-title-row {
          display: flex;
          align-items: center;

          gap: 9px;
        }


        .comparison-title-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          color: #2563eb;

          background: #eaf2ff;

          border: 1px solid #d8e6fa;
        }


        .comparison-header h2 {
          margin: 0;

          color: #263d5c;

          font-size: 18px;
          line-height: 1.1;
        }


        .comparison-header p {
          margin: 4px 0 0;

          color: #8a99ab;

          font-size: 9px;
        }


        .comparison-count {
          padding: 7px 9px;

          border-radius: 7px;

          color: #72869f;

          background: #f3f6fa;

          border: 1px solid #e3e9f0;

          font-size: 8px;
          font-weight: 800;

          white-space: nowrap;
        }


        .comparison-count span {
          color: #2d4f78;

          font-size: 12px;
        }


        /* Summary */

        .comparison-summary {
          margin-top: 16px;

          padding: 12px 16px;

          display: flex;
          align-items: center;

          border: 1px solid #e4eaf1;

          border-radius: 11px;

          background: #f8fafc;
        }


        .summary-item {
          flex: 1;

          display: flex;
          align-items: baseline;

          justify-content: center;

          gap: 4px;
        }


        .summary-label {
          margin-right: 4px;

          color: #8190a2;

          font-size: 7px;
          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: .5px;
        }


        .summary-item strong {
          color: #29466d;

          font-size: 16px;

          font-weight: 850;
        }


        .summary-unit {
          color: #9aa7b7;

          font-size: 7px;
        }


        .summary-divider {
          width: 1px;
          height: 25px;

          background: #dfe6ee;
        }


        /* Comparison grid */

        .comparison-grid {
          margin-top: 17px;

          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(180px, 1fr)
            );

          gap: 11px;
        }


        .comparison-card {
          min-height: 285px;

          position: relative;

          padding: 16px 13px;

          display: flex;
          flex-direction: column;
          align-items: center;

          border: 1px solid #dfe7f0;

          border-radius: 15px;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #f8fafd
            );

          box-shadow:
            0 5px 18px rgba(15,45,90,.025);

          transition: .2s ease;
        }


        .comparison-card:hover {
          transform: translateY(-2px);

          border-color: #c5d8ee;

          box-shadow:
            0 12px 28px rgba(15,45,90,.065);
        }


        .comparison-top {
          border-color: #bcd4f2;

          background:
            linear-gradient(
              180deg,
              #f9fcff,
              #f4f8fe
            );
        }


        .best-badge {
          position: absolute;

          top: 10px;
          right: 10px;

          padding: 4px 6px;

          display: flex;
          align-items: center;

          gap: 4px;

          border-radius: 6px;

          color: #2b5e91;

          background: #eaf3ff;

          border: 1px solid #d5e6fa;

          font-size: 6.5px;
          font-weight: 900;
        }


        .comparison-card-top {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }


        .comparison-number {
          padding: 4px 6px;

          border-radius: 5px;

          color: #54739c;

          background: #edf4fc;

          border: 1px solid #dbe7f5;

          font-size: 7px;
          font-weight: 900;
        }


        .comparison-date {
          color: #9aa7b6;

          font-size: 7px;
        }


        .comparison-gauge {
          margin-top: 12px;
        }


        .comparison-score {
          margin-top: 2px;

          display: flex;
          align-items: baseline;

          gap: 4px;
        }


        .comparison-score strong {
          color: #1d3b64;

          font-size: 25px;

          line-height: 1;

          font-weight: 850;

          letter-spacing: -.8px;
        }


        .comparison-score span {
          color: #9aa7b6;

          font-size: 8px;
          font-weight: 700;
        }


        .comparison-status {
          margin-top: 8px;

          padding: 5px 8px;

          display: flex;
          align-items: center;

          gap: 5px;

          border-radius: 999px;

          font-size: 7px;
          font-weight: 850;
        }


        .comparison-line {
          width: 100%;

          margin-top: 14px;

          border-top: 1px solid #e8edf3;
        }


        .comparison-meta {
          width: 100%;

          margin-top: 9px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #98a5b5;

          font-size: 7px;
        }


        /* =====================================================
           LARGE TABLET
        ===================================================== */

        @media (max-width: 1050px) {

          .history-page {
            padding: 24px 22px 65px;
          }


          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }


          .score-bar-wrap {
            display: none;
          }


          .analysis-title strong {
            max-width: 190px;
          }


          .analysis-title span {
            max-width: 190px;
          }

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 800px) {

          .history-page {
            padding: 18px;
          }


          .history-header {
            min-height: auto;

            padding: 20px;

            align-items: flex-start;
          }


          .header-right {
            flex-direction: column;
            align-items: flex-end;
          }


          .live-status {
            display: none;
          }


          .analysis-status {
            display: none;
          }


          .analysis-index {
            display: none;
          }


          .comparison-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .history-page {
            padding: 10px;
            padding-bottom: 35px;
          }


          .history-header {
            margin-bottom: 12px;

            padding: 16px;

            border-radius: 16px;

            gap: 10px;
          }


          .header-left {
            gap: 11px;
          }


          .header-icon {
            width: 43px;
            height: 43px;

            border-radius: 11px;
          }


          .eyebrow {
            font-size: 7px;

            letter-spacing: 1.2px;
          }


          .history-header h1 {
            font-size: 21px;

            letter-spacing: -.6px;
          }


          .history-header p {
            max-width: 230px;

            margin-top: 5px;

            font-size: 9px;
          }


          .header-right {
            gap: 0;
          }


          .scan-counter {
            min-width: 52px;

            padding: 8px 7px;

            border-radius: 9px;
          }


          .scan-counter strong {
            font-size: 16px;
          }


          .scan-counter span {
            font-size: 5.5px;
          }


          /* STATS */

          .stats-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 7px;

            margin-bottom: 12px;
          }


          .stat-card {
            min-height: 125px;

            padding: 12px;

            border-radius: 12px;
          }


          .stat-icon {
            width: 26px;
            height: 26px;
          }


          .stat-label {
            font-size: 7px;
          }


          .stat-main {
            margin-top: 9px;
          }


          .stat-main strong {
            font-size: 22px;
          }


          .stat-main span {
            font-size: 7px;
          }


          .stat-progress {
            margin-top: 8px;
          }


          .stat-card p {
            font-size: 6.5px;
          }


          .stat-action-title {
            margin-top: 9px;

            font-size: 13px;
          }


          .stat-action-hint {
            font-size: 6.5px;
          }


          .stat-mini-status {
            font-size: 6px;
          }


          /* TOOLBAR */

          .history-toolbar {
            padding: 10px;

            border-radius: 11px;
          }


          .toolbar-icon {
            width: 27px;
            height: 27px;
          }


          .toolbar-left strong {
            font-size: 9px;
          }


          .toolbar-left span {
            max-width: 190px;

            font-size: 7px;

            line-height: 1.35;
          }


          .selection-badge {
            font-size: 7px;

            padding: 6px 7px;
          }


          /* ANALYSIS */

          .analysis-list {
            gap: 7px;
          }


          .analysis-card {
            min-height: 76px;

            padding: 9px;

            gap: 7px;

            border-radius: 11px;
          }


          .selection-check {
            width: 19px;
            height: 19px;

            border-radius: 5px;
          }


          .score-block {
            width: 39px;
          }


          .score-number {
            font-size: 18px;
          }


          .score-label {
            font-size: 5px;
          }


          .analysis-title {
            display: block;

            line-height: 1.4;
          }


          .analysis-title strong {
            display: inline;

            max-width: none;

            font-size: 8px;

            white-space: normal;
          }


          .analysis-title span {
            display: inline;

            max-width: none;

            font-size: 8px;

            white-space: normal;
          }


          .title-arrow {
            width: 9px;
            height: 9px;

            margin: 0 2px;
          }


          .analysis-meta {
            margin-top: 4px;

            gap: 5px;

            font-size: 6.5px;
          }


          .row-arrow {
            width: 22px;
            height: 22px;

            border-radius: 6px;
          }


          /* COMPARE */

          .compare-bar {
            margin-top: 12px;

            margin-bottom: 18px;

            padding: 12px;

            flex-direction: column;

            align-items: stretch;

            border-radius: 12px;
          }


          .compare-button {
            width: 100%;

            min-height: 38px;
          }


          /* COMPARISON */

          .comparison-section {
            padding: 15px;

            border-radius: 15px;
          }


          .comparison-header {
            align-items: flex-start;

            flex-direction: column;

            gap: 10px;
          }


          .comparison-header h2 {
            font-size: 16px;
          }


          .comparison-header p {
            font-size: 8px;

            line-height: 1.5;
          }


          .comparison-summary {
            padding: 10px;

            gap: 5px;
          }


          .summary-label {
            display: none;
          }


          .summary-item strong {
            font-size: 14px;
          }


          .comparison-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 7px;
          }


          .comparison-card {
            min-height: 235px;

            padding: 11px 7px;

            border-radius: 11px;
          }


          .comparison-gauge {
            transform: scale(.82);
            transform-origin: center;
            margin-top: 3px;
          }


          .comparison-score strong {
            font-size: 19px;
          }


          .comparison-status {
            font-size: 6px;

            padding: 5px 6px;
          }


          .comparison-meta {
            font-size: 6px;
          }


          /* EMPTY */

          .empty-state {
            margin: 30px auto;

            padding: 38px 18px;

            border-radius: 15px;
          }


          .empty-state h2 {
            font-size: 18px;
          }


          .empty-state p {
            font-size: 9px;
          }


          .empty-features span {
            font-size: 6px;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .history-page {
            padding: 8px;
          }


          .history-header {
            padding: 13px;

            border-radius: 14px;
          }


          .header-icon {
            width: 39px;
            height: 39px;
          }


          .history-header h1 {
            font-size: 19px;
          }


          .history-header p {
            max-width: 190px;

            font-size: 8px;
          }


          .stats-grid {
            gap: 6px;
          }


          .stat-card {
            min-height: 118px;

            padding: 10px;
          }


          .stat-icon {
            width: 24px;
            height: 24px;
          }


          .stat-main strong {
            font-size: 20px;
          }


          .stat-card p {
            font-size: 6px;
          }


          .analysis-card {
            padding: 8px;

            gap: 6px;
          }


          .score-block {
            width: 35px;
          }


          .score-number {
            font-size: 17px;
          }


          .analysis-title strong,
          .analysis-title span {
            font-size: 7.5px;
          }


          .analysis-meta {
            font-size: 6px;
          }


          .row-arrow {
            width: 20px;
            height: 20px;
          }


          .comparison-section {
            padding: 12px;
          }


          .comparison-card {
            min-height: 225px;
          }

        }


        /* =====================================================
           VERY SMALL
        ===================================================== */

        @media (max-width: 360px) {

          .history-page {
            padding: 6px;
          }


          .history-header {
            padding: 11px;
          }


          .header-icon {
            display: none;
          }


          .history-header h1 {
            font-size: 18px;
          }


          .history-header p {
            max-width: 170px;

            font-size: 7.5px;
          }


          .scan-counter {
            min-width: 46px;

            padding: 6px;
          }


          .stats-grid {
            grid-template-columns: 1fr;
          }


          .stat-card {
            min-height: 105px;
          }


          .history-toolbar {
            align-items: flex-start;

            flex-direction: column;
          }


          .selection-badge {
            align-self: flex-end;
          }


          .analysis-card {
            min-height: 72px;

            padding: 7px;

            gap: 5px;
          }


          .selection-check {
            width: 18px;
            height: 18px;
          }


          .score-block {
            width: 32px;
          }


          .score-number {
            font-size: 16px;
          }


          .analysis-title strong,
          .analysis-title span {
            font-size: 7px;
          }


          .analysis-meta {
            font-size: 5.5px;
          }


          .row-arrow {
            width: 18px;
            height: 18px;
          }


          .comparison-grid {
            grid-template-columns: 1fr;
          }


          .comparison-card {
            min-height: 240px;
          }

        }

      `}</style>

    </div>
  )
}