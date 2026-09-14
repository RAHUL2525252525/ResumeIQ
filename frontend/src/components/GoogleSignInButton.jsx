import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleSignInButton({ onError }) {
  const divRef = useRef(null)
  const { loginWithGoogle } = useAuth()

  useEffect(() => {
    if (!CLIENT_ID) return

    function render() {
      if (!window.google || !divRef.current) return

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential)
          } catch (err) {
            onError?.(err.response?.data?.detail || 'Google sign-in failed.')
          }
        },
      })

      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: 280,
      })
    }

    if (window.google) {
      render()
    } else {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = render
      document.body.appendChild(script)
    }
  }, [loginWithGoogle, onError])

  if (!CLIENT_ID) {
    return (
      <div className="google-config-warning">
        <div className="google-warning-icon">!</div>

        <div>
          <strong>Google sign-in unavailable</strong>
          <p>
            Set <code>VITE_GOOGLE_CLIENT_ID</code> in the frontend
            <br />
            <span>.env</span> file to enable Google sign-in.
          </p>
        </div>

        <style>{`
          .google-config-warning {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 13px 15px;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            background: #eff6ff;
            color: #1e3a8a;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }

          .google-warning-icon {
            width: 22px;
            height: 22px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #2563eb;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
          }

          .google-config-warning strong {
            display: block;
            margin-bottom: 3px;
            color: #1e40af;
            font-size: 13px;
            font-weight: 700;
          }

          .google-config-warning p {
            margin: 0;
            color: #64748b;
            font-size: 12px;
            line-height: 1.55;
          }

          .google-config-warning code {
            padding: 2px 5px;
            border-radius: 5px;
            background: #ffffff;
            color: #2563eb;
            font-family: monospace;
            font-size: 11px;
            border: 1px solid #dbeafe;
          }

          .google-config-warning span {
            color: #334155;
          }

          @media (max-width: 480px) {
            .google-config-warning {
              padding: 12px;
            }

            .google-config-warning p {
              font-size: 11.5px;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="google-signin-wrapper">
      <div className="google-divider">
        <span>OR CONTINUE WITH</span>
      </div>

      <div className="google-button-container">
        <div ref={divRef} />
      </div>

      <style>{`
        .google-signin-wrapper {
          width: 100%;
          margin-top: 18px;
        }

        .google-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 16px;
          color: #94a3b8;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .google-divider::before,
        .google-divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: #e2e8f0;
        }

        .google-button-container {
          width: 100%;
          display: flex;
          justify-content: center;
          min-height: 44px;
        }

        .google-button-container > div {
          max-width: 100%;
        }

        @media (max-width: 480px) {
          .google-signin-wrapper {
            margin-top: 16px;
          }

          .google-divider {
            margin-bottom: 14px;
          }
        }
      `}</style>
    </div>
  )
}