import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutGrid,
  ScanSearch,
  History as HistoryIcon,
  FileEdit,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/app', label: 'Home', end: true, Icon: LayoutGrid },
  { to: '/app/analyze', label: 'Analyze', Icon: ScanSearch },
  { to: '/app/history', label: 'History', Icon: HistoryIcon },
  { to: '/app/builder', label: 'Resume Builder', Icon: FileEdit },
]

export default function AppShell() {
  const { displayName, logout } = useAuth()

  return (
    <div className="app-shell">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">

          <div className="brand-mark">
            R
          </div>

          <div className="brand-info">
            <strong>
              Resume<span>IQ</span>
            </strong>

            <small>
              AI Resume Intelligence
            </small>
          </div>

        </div>


        {/* Navigation */}
        <nav className="sidebar-nav">

          <div className="nav-heading">
            WORKSPACE
          </div>

          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">
                <Icon size={18} strokeWidth={2} />
              </span>

              <span className="nav-label">
                {label}
              </span>

              <span className="nav-active-indicator"></span>
            </NavLink>
          ))}

        </nav>


        {/* Bottom profile */}
        <div className="sidebar-bottom">

          <div className="profile-card">

            <div className="profile-avatar">
              {displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="profile-info">
              <span>Signed in as</span>
              <strong>{displayName}</strong>
            </div>

          </div>


          <button
            onClick={logout}
            className="logout-btn"
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Log out</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}
      <div className="app-area">

        {/* ================= MOBILE HEADER ================= */}
        <header className="mobile-header">

          <div className="mobile-brand">

            <div className="mobile-brand-mark">
              R
            </div>

            <strong>
              Resume<span>IQ</span>
            </strong>

          </div>


          <div className="mobile-header-actions">

            <div className="mobile-user">
              {displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <button
              onClick={logout}
              className="mobile-logout-btn"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} strokeWidth={2.2} />
            </button>

          </div>

        </header>


        {/* Page content */}
        <main className="main-content">
          <Outlet />
        </main>


        {/* ================= MOBILE NAV ================= */}
        <nav className="mobile-nav">

          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={19} strokeWidth={2} />

              <span>
                {label === 'Resume Builder'
                  ? 'Builder'
                  : label}
              </span>
            </NavLink>
          ))}

        </nav>

      </div>


      {/* ================= STYLES ================= */}
      <style>{`

        * {
          box-sizing: border-box;
        }


        /* ================= ROOT ================= */

        .app-shell {
          min-height: 100vh;

          display: flex;

          background:
            radial-gradient(
              circle at 75% 0%,
              rgba(18, 58, 120, 0.045),
              transparent 30%
            ),
            #f8fafc;

          color: #0f172a;
        }


        /* ================= SIDEBAR ================= */

        .sidebar {
          width: 248px;
          flex: 0 0 248px;

          height: 100vh;

          position: sticky;
          top: 0;

          display: flex;
          flex-direction: column;

          padding: 25px 16px 17px;

          background: #ffffff;

          border-right: 1px solid #dbe3ee;

          z-index: 20;
        }


        /* ================= BRAND ================= */

        .sidebar-brand {
          display: flex;
          align-items: center;

          gap: 11px;

          padding: 4px 9px 28px;

          border-bottom: 1px solid #eef2f7;
        }


        .brand-mark {
          width: 39px;
          height: 39px;

          flex: 0 0 39px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #123a78;

          color: #ffffff;

          font-size: 16px;
          font-weight: 850;

          box-shadow:
            0 7px 18px rgba(18, 58, 120, 0.20);
        }


        .brand-info {
          display: flex;
          flex-direction: column;

          min-width: 0;
        }


        .brand-info strong {
          color: #0f172a;

          font-size: 17px;
          line-height: 1.2;

          letter-spacing: -0.4px;
        }


        .brand-info strong span {
          color: #123a78;
        }


        .brand-info small {
          margin-top: 3px;

          color: #94a3b8;

          font-size: 8px;
          font-weight: 600;

          letter-spacing: 0.3px;
        }


        /* ================= NAV ================= */

        .sidebar-nav {
          flex: 1;

          display: flex;
          flex-direction: column;

          gap: 5px;

          padding-top: 25px;
        }


        .nav-heading {
          padding: 0 12px 10px;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 1.3px;
        }


        .nav-link {
          position: relative;

          min-height: 46px;

          display: flex;
          align-items: center;

          gap: 11px;

          padding: 0 12px;

          border-radius: 10px;

          text-decoration: none;

          color: #64748b;

          font-size: 12px;
          font-weight: 700;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }


        .nav-link:hover {
          color: #123a78;

          background: #f5f8fc;
        }


        .nav-link.active {
          color: #123a78;

          background: #eaf1fb;
        }


        .nav-link.active:hover {
          background: #eaf1fb;
        }


        .nav-icon {
          width: 30px;
          height: 30px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          transition: all 0.2s ease;
        }


        .nav-link.active .nav-icon {
          background: #ffffff;

          color: #123a78;

          box-shadow:
            0 3px 8px rgba(18, 58, 120, 0.08);
        }


        .nav-label {
          flex: 1;
        }


        .nav-active-indicator {
          width: 0;
          height: 18px;

          position: absolute;
          right: 0;

          border-radius: 10px 0 0 10px;

          background: #123a78;

          transition: width 0.2s ease;
        }


        .nav-link.active .nav-active-indicator {
          width: 3px;
        }


        /* ================= SIDEBAR BOTTOM ================= */

        .sidebar-bottom {
          padding-top: 16px;

          border-top: 1px solid #eef2f7;
        }


        .profile-card {
          display: flex;
          align-items: center;

          gap: 10px;

          padding: 10px;

          border-radius: 10px;

          background: #f7f9fc;

          border: 1px solid #e8edf4;
        }


        .profile-avatar {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          background: #d9e6f8;

          color: #123a78;

          font-size: 12px;
          font-weight: 850;
        }


        .profile-info {
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 3px;
        }


        .profile-info span {
          color: #94a3b8;

          font-size: 8px;
          font-weight: 600;
        }


        .profile-info strong {
          overflow: hidden;

          color: #334155;

          font-size: 11px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }


        .logout-btn {
          width: 100%;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          margin-top: 9px;

          border: 1px solid #e2e8f0;
          border-radius: 9px;

          background: #ffffff;

          color: #64748b;

          font-size: 11px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }


        .logout-btn:hover {
          background: #fef2f2;

          border-color: #fecaca;

          color: #dc2626;
        }


        /* ================= APP AREA ================= */

        .app-area {
          flex: 1;
          min-width: 0;

          display: flex;
          flex-direction: column;

          min-height: 100vh;
        }


        /* ================= MAIN CONTENT ================= */

        .main-content {
          width: 100%;
          max-width: 1180px;

          flex: 1;

          padding: 38px 48px 70px;

          margin: 0 auto;
        }


        /* ================= MOBILE HEADER ================= */

        .mobile-header {
          display: none;
        }


        .mobile-header-actions {
          display: flex;
          align-items: center;

          gap: 8px;
        }


        /* ================= MOBILE NAV ================= */

        .mobile-nav {
          display: none;
        }


        /* ================= TABLET ================= */

        @media (max-width: 1000px) {

          .sidebar {
            width: 215px;

            flex-basis: 215px;
          }


          .main-content {
            padding: 32px 30px 60px;
          }

        }


        /* ================= MOBILE ================= */

        @media (max-width: 720px) {

          .app-shell {
            display: block;

            padding-bottom: 72px;
          }


          /* Hide desktop sidebar */

          .sidebar {
            display: none;
          }


          /* ================= MOBILE HEADER ================= */

          .mobile-header {
            height: 64px;

            position: sticky;
            top: 0;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0 17px;

            background: rgba(255, 255, 255, 0.96);

            border-bottom: 1px solid #dbe3ee;

            backdrop-filter: blur(12px);

            z-index: 30;
          }


          .mobile-brand {
            display: flex;
            align-items: center;

            gap: 9px;
          }


          .mobile-brand-mark {
            width: 32px;
            height: 32px;

            display: grid;
            place-items: center;

            border-radius: 8px;

            background: #123a78;

            color: #ffffff;

            font-size: 13px;
            font-weight: 850;

            box-shadow:
              0 5px 12px rgba(18, 58, 120, 0.16);
          }


          .mobile-brand strong {
            color: #0f172a;

            font-size: 16px;

            letter-spacing: -0.4px;
          }


          .mobile-brand strong span {
            color: #123a78;
          }


          /* ================= MOBILE USER ================= */

          .mobile-user {
            width: 31px;
            height: 31px;

            display: grid;
            place-items: center;

            border-radius: 50%;

            background: #d9e6f8;

            color: #123a78;

            font-size: 11px;
            font-weight: 850;
          }


          /* ================= MOBILE LOGOUT ================= */

          .mobile-logout-btn {
            width: 32px;
            height: 32px;

            display: grid;
            place-items: center;

            border: 1px solid #dbe3ee;

            border-radius: 9px;

            background: #ffffff;

            color: #52657d;

            cursor: pointer;

            transition:
              background 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease,
              transform 0.2s ease;
          }


          .mobile-logout-btn:hover {
            background: #fef2f2;

            border-color: #fecaca;

            color: #dc2626;
          }


          .mobile-logout-btn:active {
            transform: scale(0.94);
          }


          /* ================= MAIN ================= */

          .main-content {
            width: 100%;

            padding: 22px 15px 30px;
          }


          /* ================= BOTTOM NAV ================= */

          .mobile-nav {
            position: fixed;

            left: 10px;
            right: 10px;
            bottom: 10px;

            height: 62px;

            display: grid;

            grid-template-columns: repeat(4, 1fr);

            padding: 6px;

            background: rgba(255, 255, 255, 0.97);

            border: 1px solid #d5deeb;

            border-radius: 16px;

            box-shadow:
              0 12px 35px rgba(15, 23, 42, 0.12);

            backdrop-filter: blur(14px);

            z-index: 50;
          }


          .mobile-nav-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            gap: 3px;

            border-radius: 11px;

            text-decoration: none;

            color: #94a3b8;

            font-size: 8px;
            font-weight: 700;

            transition:
              background 0.2s ease,
              color 0.2s ease;
          }


          .mobile-nav-link.active {
            color: #123a78;

            background: #eaf1fb;
          }


          .mobile-nav-link svg {
            transition: transform 0.2s ease;
          }


          .mobile-nav-link.active svg {
            transform: translateY(-1px);
          }

        }


        /* ================= SMALL PHONES ================= */

        @media (max-width: 380px) {

          .main-content {
            padding-left: 11px;
            padding-right: 11px;
          }


          .mobile-header {
            padding-left: 12px;
            padding-right: 12px;
          }


          .mobile-header-actions {
            gap: 6px;
          }


          .mobile-logout-btn {
            width: 30px;
            height: 30px;
          }


          .mobile-user {
            width: 30px;
            height: 30px;
          }


          .mobile-nav {
            left: 6px;
            right: 6px;
            bottom: 6px;

            height: 59px;

            border-radius: 14px;
          }


          .mobile-nav-link {
            font-size: 7px;
          }

        }

      `}</style>

    </div>
  )
}