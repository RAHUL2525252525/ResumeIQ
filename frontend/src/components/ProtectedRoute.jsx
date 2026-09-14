import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="protected-loading">
        <div className="loading-card">
          <div className="loading-logo">R</div>

          <div className="loading-spinner"></div>

          <div className="loading-title">
            Resume<span>IQ</span>
          </div>

          <p>Loading your workspace...</p>
        </div>

        <style>{`
          .protected-loading {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 24px;
            background: #f8fafc;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }

          .loading-card {
            width: 100%;
            max-width: 360px;
            padding: 36px 28px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            box-shadow: 0 12px 35px rgba(15, 23, 42, 0.07);
          }

          .loading-logo {
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            border-radius: 13px;
            background: #2563eb;
            color: #ffffff;
            font-size: 21px;
            font-weight: 800;
            box-shadow: 0 8px 18px rgba(37, 99, 235, 0.2);
          }

          .loading-spinner {
            width: 24px;
            height: 24px;
            margin-bottom: 16px;
            border: 3px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: resumeiq-spin 0.8s linear infinite;
          }

          .loading-title {
            color: #0f172a;
            font-size: 19px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }

          .loading-title span {
            color: #2563eb;
          }

          .loading-card p {
            margin: 6px 0 0;
            color: #64748b;
            font-size: 13px;
          }

          @keyframes resumeiq-spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 480px) {
            .protected-loading {
              padding: 18px;
            }

            .loading-card {
              padding: 30px 22px;
              border-radius: 16px;
            }

            .loading-logo {
              width: 42px;
              height: 42px;
              font-size: 19px;
            }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}