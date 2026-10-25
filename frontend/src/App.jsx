import { useCallback, useEffect, useState } from 'react'
import ProjectsPage from './ProjectsPage'
import { loginUser } from './api/authApi'
import { fetchDashboard } from './api/dashboardApi'

const TOKEN_KEY = 'smartbuild_token'

function App() {
  const [token, setToken] = useState(() => {
    const savedToken = sessionStorage.getItem(TOKEN_KEY)
    return savedToken && savedToken !== 'undefined' ? savedToken : ''
  })

  const [page, setPage] = useState('dashboard')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async (currentToken) => {
    if (!currentToken) return

    setLoading(true)
    setError('')

    try {
      const data = await fetchDashboard(currentToken)
      setDashboard(data)
    } catch (err) {
      setError(err.message || 'Dashboard load nahi ho saka.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      loadDashboard(token)
    }
  }, [token, loadDashboard])

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setLoggingIn(true)

    try {
      const result = await loginUser(username.trim(), password)
      const receivedToken = result?.token

      if (
        typeof receivedToken !== 'string' ||
        !receivedToken.trim() ||
        receivedToken === 'undefined'
      ) {
        throw new Error('Login response mein valid token nahi mila.')
      }

      sessionStorage.setItem(TOKEN_KEY, receivedToken)
      setToken(receivedToken)
      setUsername(result.username || username.trim())
      setPassword('')
      setPage('dashboard')
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoggingIn(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setDashboard(null)
    setUsername('')
    setPassword('')
    setError('')
    setPage('dashboard')
  }

  // Redesigned login page
  if (!token) {
    return (
      <main className="sb-login-page">
        <section className="sb-login-shell">
          <div className="sb-login-showcase">
            <div className="sb-login-brand">
              <div className="sb-brand-mark">SB</div>

              <div>
                <strong>SmartBuild AI</strong>
                <span>CONSTRUCTION WORKSPACE</span>
              </div>
            </div>

            <div className="sb-login-showcase-copy">
              <span className="sb-login-kicker">
                PLAN SMARTER. BUILD BETTER.
              </span>

              <h1>Your vision deserves a solid plan.</h1>

              <p>
                Bring your construction projects, budgets and progress
                together in one clear workspace.
              </p>
            </div>

            <div className="sb-login-illustration" aria-hidden="true">
              <div className="sb-login-sun" />

              <div className="sb-login-tower sb-login-tower-one">
                {Array.from({ length: 12 }, (_, index) => (
                  <i key={index} />
                ))}
              </div>

              <div className="sb-login-tower sb-login-tower-two">
                {Array.from({ length: 16 }, (_, index) => (
                  <i key={index} />
                ))}
              </div>

              <div className="sb-login-tower sb-login-tower-three">
                {Array.from({ length: 8 }, (_, index) => (
                  <i key={index} />
                ))}
              </div>

              <div className="sb-login-ground" />
            </div>

            <div className="sb-login-showcase-footer">
              <span>SMART PLANNING</span>
              <span>•</span>
              <span>CONFIDENT BUILDING</span>
            </div>
          </div>

          <div className="sb-login-form-side">
            <div className="sb-login-form-card">
              <span className="sb-login-welcome">WELCOME BACK</span>

              <h2>Sign in to your workspace</h2>

              <p className="sb-login-description">
                Enter your account details to continue.
              </p>

              <form onSubmit={handleLogin} className="sb-login-form">
                <label>
                  Username

                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                </label>

                <label>
                  Password

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </label>

                {error && (
                  <p className="sb-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="sb-primary-button sb-login-submit"
                  disabled={loggingIn}
                >
                  {loggingIn
                    ? 'Signing in...'
                    : 'Sign in to SmartBuild'}

                  {!loggingIn && <span>→</span>}
                </button>
              </form>

              <div className="sb-login-secure-note">
                <span aria-hidden="true">▣</span>
                Your workspace is protected by secure sign-in.
              </div>
            </div>

            <p className="sb-login-copyright">
              © SmartBuild AI · Plan carefully. Build confidently.
            </p>
          </div>
        </section>
      </main>
    )
  }

  // My Projects page
  if (page === 'projects') {
    return (
      <ProjectsPage
        token={token}
        onBack={() => {
          setPage('dashboard')
          loadDashboard(token)
        }}
        onLogout={handleLogout}
      />
    )
  }

  // Dashboard data
  const stats = dashboard || {}
  const totalProjects = Number(stats.totalProjects) || 0
  const totalBudget = Number(stats.totalBudget) || 0
  const totalExpenses = Number(stats.totalExpenses) || 0

  const averageProgress = Math.min(
    100,
    Math.max(0, Number(stats.averageProgressPercentage) || 0),
  )

  const totalTasks = Number(stats.totalTasks) || 0
  const completedTasks = Number(stats.completedTasks) || 0
  const pendingTasks = Math.max(0, totalTasks - completedTasks)

  const money = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  const compactMoney = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })} Cr`
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })} L`
    }

    return money(amount)
  }

  // Dashboard UI
  return (
    <div className="sb-app">
      <aside className="sb-sidebar">
        <div className="sb-sidebar-brand">
          <div className="sb-brand-mark">SB</div>

          <div>
            <strong>SmartBuild</strong>
            <span>AI CONSTRUCTION</span>
          </div>
        </div>

        <p className="sb-nav-label">WORKSPACE</p>

        <button
          type="button"
          className="sb-nav-item sb-nav-active"
          onClick={() => setPage('dashboard')}
        >
          <span>▦</span> Dashboard
        </button>

        <button
          type="button"
          className="sb-nav-item"
          onClick={() => {
            setError('')
            setPage('projects')
          }}
        >
          <span>▤</span> My Projects
        </button>

        <div className="sb-sidebar-bottom">
          <div className="sb-profile">
            <div className="sb-avatar">
              {(username || 'U').charAt(0).toUpperCase()}
            </div>

            <div className="sb-profile-text">
              <strong>{username || 'User'}</strong>
              <span>Project owner</span>
            </div>
          </div>

          <button
            type="button"
            className="sb-logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="sb-main">
        <header className="sb-topbar">
          <div>
            <p className="sb-breadcrumb">Workspace / Dashboard</p>

            <h1>Good to see you, {username}.</h1>

            <p className="sb-muted">
              Here is your construction overview.
            </p>
          </div>

          <button
            type="button"
            className="sb-refresh-button"
            onClick={() => loadDashboard(token)}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '↻ Refresh data'}
          </button>
        </header>

        {error && (
          <div className="sb-error-banner" role="alert">
            {error}
          </div>
        )}

        <section className="sb-welcome-banner">
          <div className="sb-welcome-copy">
            <span className="sb-banner-label">
              YOUR BUILDING JOURNEY
            </span>

            <h2>Turn your plans into progress.</h2>

            <p>
              Keep your projects, budget and construction activity
              organised in one place.
            </p>

            <button
              type="button"
              className="sb-banner-button"
              onClick={() => {
                setError('')
                setPage('projects')
              }}
            >
              Explore my projects <span>→</span>
            </button>
          </div>

          <div className="sb-building-art" aria-hidden="true">
            <div className="sb-building sb-building-one">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="sb-building sb-building-two">
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="sb-building sb-building-three">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>

        <div className="sb-section-title">
          <div>
            <h2>Project overview</h2>
            <p>Your latest portfolio numbers</p>
          </div>

          {loading && (
            <span className="sb-loading-label">Updating...</span>
          )}
        </div>

        <section className="sb-stats-grid">
          <article className="sb-stat-card">
            <div className="sb-stat-top">
              <span className="sb-stat-icon sb-icon-blue">▤</span>
              <span className="sb-stat-caption">PORTFOLIO</span>
            </div>

            <p className="sb-stat-label">Total projects</p>
            <h3>{totalProjects}</h3>
            <p className="sb-stat-foot">
              Projects in your workspace
            </p>
          </article>

          <article className="sb-stat-card">
            <div className="sb-stat-top">
              <span className="sb-stat-icon sb-icon-green">₹</span>
              <span className="sb-stat-caption">PLANNING</span>
            </div>

            <p className="sb-stat-label">Total budget</p>
            <h3>{compactMoney(totalBudget)}</h3>
            <p className="sb-stat-foot">
              {money(totalBudget)} planned
            </p>
          </article>

          <article className="sb-stat-card">
            <div className="sb-stat-top">
              <span className="sb-stat-icon sb-icon-orange">↗</span>
              <span className="sb-stat-caption">SPENDING</span>
            </div>

            <p className="sb-stat-label">Total expenses</p>
            <h3>{compactMoney(totalExpenses)}</h3>
            <p className="sb-stat-foot">
              {money(totalExpenses)} recorded
            </p>
          </article>

          <article className="sb-stat-card">
            <div className="sb-stat-top">
              <span className="sb-stat-icon sb-icon-purple">◷</span>
              <span className="sb-stat-caption">CONSTRUCTION</span>
            </div>

            <p className="sb-stat-label">Average progress</p>
            <h3>{averageProgress}%</h3>

            <div
              className="sb-progress-track"
              role="progressbar"
              aria-label="Average construction progress"
              aria-valuenow={averageProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="sb-progress-fill"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
          </article>
        </section>

        <section className="sb-lower-grid">
          <article className="sb-content-card">
            <div className="sb-card-heading">
              <div>
                <h2>Tasks overview</h2>
                <p>Track your work at a glance</p>
              </div>

              <span className="sb-stat-icon sb-icon-blue">✓</span>
            </div>

            <div className="sb-task-numbers">
              <div>
                <span>Total tasks</span>
                <strong>{totalTasks}</strong>
              </div>

              <div>
                <span>Completed</span>
                <strong className="sb-green-text">
                  {completedTasks}
                </strong>
              </div>

              <div>
                <span>Pending</span>
                <strong className="sb-orange-text">
                  {pendingTasks}
                </strong>
              </div>
            </div>

            <div className="sb-task-track">
              <div
                className="sb-task-fill"
                style={{
                  width: `${
                    totalTasks > 0
                      ? Math.min(
                          100,
                          (completedTasks / totalTasks) * 100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="sb-card-note">
              {totalTasks === 0
                ? 'Your tasks will appear here when they are added.'
                : `${completedTasks} of ${totalTasks} tasks completed.`}
            </p>
          </article>

          <article className="sb-content-card sb-project-shortcut">
            <div className="sb-shortcut-icon">⌂</div>

            <h2>Ready to plan your next build?</h2>

            <p>
              Open your project workspace to review existing projects or
              create a new construction plan.
            </p>

            <button
              type="button"
              className="sb-primary-button"
              onClick={() => {
                setError('')
                setPage('projects')
              }}
            >
              Open My Projects <span>→</span>
            </button>
          </article>
        </section>

        <footer className="sb-footer">
          <span>© SmartBuild AI</span>
          <span>Plan carefully. Build confidently.</span>
        </footer>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .sb-app {
          --sb-ink: #17243b;
          --sb-muted: #748197;
          --sb-border: #e5eaf1;
          --sb-primary: #2858c5;
          min-height: 100vh;
          display: flex;
          background: #f5f7fb;
          color: var(--sb-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .sb-sidebar {
          width: 248px;
          flex: 0 0 248px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 28px 18px 20px;
          background: #fff;
          border-right: 1px solid var(--sb-border);
        }

        .sb-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 8px 36px;
        }

        .sb-brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          color: #fff;
          background: linear-gradient(135deg, #3478ec, #2549ae);
          font-weight: 800;
          letter-spacing: -1px;
        }

        .sb-sidebar-brand strong,
        .sb-sidebar-brand span {
          display: block;
        }

        .sb-sidebar-brand strong {
          font-size: 17px;
        }

        .sb-sidebar-brand span {
          margin-top: 4px;
          color: #8793a6;
          font-size: 9px;
          letter-spacing: 1.2px;
          font-weight: 700;
        }

        .sb-nav-label {
          padding: 0 12px;
          margin: 0 0 12px;
          color: #98a2b3;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .sb-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          margin-bottom: 6px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #66738a;
          text-align: left;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }

        .sb-nav-item span {
          font-size: 18px;
        }

        .sb-nav-active {
          color: #2858c5;
          background: #edf3ff;
        }

        .sb-sidebar-bottom {
          margin-top: auto;
        }

        .sb-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 4px;
          border-top: 1px solid var(--sb-border);
        }

        .sb-avatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e7edff;
          color: #2858c5;
          font-weight: 800;
        }

        .sb-profile-text {
          min-width: 0;
        }

        .sb-profile-text strong,
        .sb-profile-text span {
          display: block;
          overflow-wrap: anywhere;
        }

        .sb-profile-text strong {
          font-size: 12px;
        }

        .sb-profile-text span {
          margin-top: 4px;
          color: #8994a6;
          font-size: 11px;
        }

        .sb-logout-button {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--sb-border);
          border-radius: 8px;
          background: #fff;
          color: #56647b;
          font-weight: 650;
          cursor: pointer;
        }

        .sb-main {
          width: 100%;
          min-width: 0;
          max-width: 1600px;
          margin: 0 auto;
          padding: 34px clamp(20px, 3.5vw, 52px) 20px;
        }

        .sb-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .sb-breadcrumb {
          margin: 0 0 12px;
          color: #8793a6;
          font-size: 12px;
        }

        .sb-topbar h1 {
          margin: 0;
          color: #17243b;
          font-size: clamp(25px, 3vw, 34px);
          line-height: 1.2;
          letter-spacing: -1.1px;
        }

        .sb-muted {
          margin: 9px 0 0;
          color: var(--sb-muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .sb-refresh-button {
          padding: 11px 15px;
          border: 1px solid #dce3ee;
          border-radius: 9px;
          background: #fff;
          color: #34445e;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .sb-refresh-button:disabled {
          opacity: .6;
          cursor: wait;
        }

        .sb-welcome-banner {
          position: relative;
          min-height: 210px;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 30px clamp(22px, 4vw, 42px);
          border-radius: 17px;
          background: linear-gradient(
            110deg,
            #18366f 0%,
            #2858a9 56%,
            #3476ca 100%
          );
          color: #fff;
          box-shadow: 0 12px 30px rgba(36, 79, 154, .12);
        }

        .sb-welcome-copy {
          position: relative;
          z-index: 2;
          max-width: 490px;
        }

        .sb-banner-label {
          color: #bdd7ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .sb-welcome-copy h2 {
          margin: 13px 0 9px;
          color: #fff;
          font-size: clamp(22px, 2.5vw, 30px);
          letter-spacing: -.7px;
        }

        .sb-welcome-copy p {
          max-width: 430px;
          margin: 0;
          color: #dce8ff;
          font-size: 13px;
          line-height: 1.7;
        }

        .sb-banner-button {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          margin-top: 19px;
          padding: 11px 15px;
          border: 0;
          border-radius: 8px;
          background: #fff;
          color: #244b99;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        .sb-banner-button span {
          font-size: 17px;
        }

        .sb-building-art {
          position: absolute;
          right: 6%;
          bottom: 0;
          width: 330px;
          height: 180px;
          opacity: .45;
          display: flex;
          align-items: end;
          gap: 9px;
          pointer-events: none;
        }

        .sb-building {
          display: flex;
          flex-wrap: wrap;
          align-content: start;
          justify-content: space-evenly;
          gap: 8px;
          padding: 12px 8px;
          border: 1px solid rgba(255, 255, 255, .5);
          background: rgba(255, 255, 255, .15);
        }

        .sb-building i {
          display: block;
          width: 11px;
          height: 13px;
          border: 1px solid rgba(255, 255, 255, .45);
          background: rgba(255, 255, 255, .32);
        }

        .sb-building-one {
          width: 86px;
          height: 115px;
        }

        .sb-building-two {
          width: 95px;
          height: 158px;
        }

        .sb-building-three {
          width: 83px;
          height: 91px;
        }

        .sb-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 30px 0 17px;
        }

        .sb-section-title h2,
        .sb-card-heading h2 {
          margin: 0;
          color: #1b2940;
          font-size: 17px;
          letter-spacing: -.3px;
        }

        .sb-section-title p,
        .sb-card-heading p {
          margin: 6px 0 0;
          color: #8793a6;
          font-size: 12px;
        }

        .sb-loading-label {
          color: #75839a;
          font-size: 12px;
        }

        .sb-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .sb-stat-card,
        .sb-content-card {
          min-width: 0;
          padding: 21px;
          border: 1px solid #e7ebf2;
          border-radius: 13px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(29, 47, 79, .025);
        }

        .sb-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .sb-stat-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          font-size: 20px;
          font-weight: 800;
        }

        .sb-icon-blue {
          background: #edf3ff;
          color: #3266ce;
        }

        .sb-icon-green {
          background: #e6f8ef;
          color: #21865b;
        }

        .sb-icon-orange {
          background: #fff2e3;
          color: #c77a21;
        }

        .sb-icon-purple {
          background: #f1eaff;
          color: #8055c8;
        }

        .sb-stat-caption {
          color: #9aa5b5;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .sb-stat-label {
          margin: 20px 0 6px;
          color: #718097;
          font-size: 12px;
        }

        .sb-stat-card h3 {
          margin: 0;
          color: #192840;
          font-size: clamp(22px, 2vw, 29px);
          letter-spacing: -.8px;
          overflow-wrap: anywhere;
        }

        .sb-stat-foot {
          margin: 9px 0 0;
          color: #96a0b0;
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .sb-progress-track,
        .sb-task-track {
          height: 6px;
          overflow: hidden;
          border-radius: 20px;
          background: #edf0f6;
        }

        .sb-progress-track {
          margin-top: 14px;
        }

        .sb-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #8864dc, #b7a0ff);
          transition: width .3s ease;
        }

        .sb-lower-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
          margin-top: 19px;
        }

        .sb-card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .sb-task-numbers {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 28px 0 19px;
        }

        .sb-task-numbers span,
        .sb-task-numbers strong {
          display: block;
        }

        .sb-task-numbers span {
          color: #8591a4;
          font-size: 11px;
        }

        .sb-task-numbers strong {
          margin-top: 8px;
          color: #23324a;
          font-size: 25px;
        }

        .sb-green-text {
          color: #25845d !important;
        }

        .sb-orange-text {
          color: #c77a21 !important;
        }

        .sb-task-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2e9b72, #71d3a7);
          transition: width .3s ease;
        }

        .sb-card-note {
          margin: 12px 0 0;
          color: #8a95a7;
          font-size: 11px;
        }

        .sb-project-shortcut {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .sb-shortcut-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #edf3ff;
          color: #3266ce;
          font-size: 27px;
        }

        .sb-project-shortcut h2 {
          margin: 16px 0 8px;
          color: #1b2940;
          font-size: 17px;
        }

        .sb-project-shortcut p {
          margin: 0;
          color: #7e8a9e;
          font-size: 12px;
          line-height: 1.8;
        }

        .sb-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 18px;
          padding: 12px 16px;
          border: 0;
          border-radius: 8px;
          background: #2858c5;
          color: #fff;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .sb-primary-button:hover {
          background: #2048a5;
          transform: translateY(-1px);
        }

        .sb-primary-button:disabled {
          opacity: .65;
          cursor: wait;
        }

        .sb-error,
        .sb-error-banner {
          color: #a82929;
          font-size: 13px;
          line-height: 1.6;
        }

        .sb-error-banner {
          margin-bottom: 18px;
          padding: 12px 15px;
          border: 1px solid #f2c8c8;
          border-radius: 9px;
          background: #fff0f0;
          overflow-wrap: anywhere;
        }

        .sb-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 32px;
          padding: 18px 0 5px;
          border-top: 1px solid #e5eaf1;
          color: #98a2b2;
          font-size: 11px;
        }

        /* Redesigned split-screen login */
        .sb-login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: clamp(16px, 4vw, 48px);
          background: #f4f6fb;
          color: #17243b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .sb-login-shell {
          width: min(1120px, 100%);
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.02fr .98fr;
          overflow: hidden;
          border: 1px solid #e3e8f1;
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 28px 80px rgba(29, 48, 83, .12);
        }

        .sb-login-showcase {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 650px;
          padding: 38px 42px 25px;
          color: #fff;
          background: linear-gradient(
            145deg,
            #142b58 0%,
            #1d4385 55%,
            #2866b7 100%
          );
        }

        .sb-login-brand {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sb-login-brand strong,
        .sb-login-brand span {
          display: block;
        }

        .sb-login-brand strong {
          font-size: 17px;
          letter-spacing: -.3px;
        }

        .sb-login-brand span {
          margin-top: 5px;
          color: #b8d1f8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .sb-login-showcase-copy {
          position: relative;
          z-index: 2;
          max-width: 390px;
          margin-top: 76px;
        }

        .sb-login-kicker {
          color: #a9cbff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .sb-login-showcase-copy h1 {
          margin: 17px 0 14px;
          color: #fff;
          font-size: clamp(32px, 4vw, 45px);
          line-height: 1.12;
          letter-spacing: -1.7px;
        }

        .sb-login-showcase-copy p {
          max-width: 350px;
          margin: 0;
          color: #d3e1f8;
          font-size: 14px;
          line-height: 1.9;
        }

        .sb-login-illustration {
          position: relative;
          flex: 1;
          min-height: 210px;
          margin: 12px -12px 0;
        }

        .sb-login-sun {
          position: absolute;
          right: 18%;
          bottom: 72px;
          width: 116px;
          height: 116px;
          border-radius: 50%;
          background: rgba(139, 190, 255, .18);
          box-shadow: 0 0 0 22px rgba(139, 190, 255, .06);
        }

        .sb-login-tower {
          position: absolute;
          bottom: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          align-content: start;
          gap: 10px 8px;
          padding: 16px 12px;
          border: 1px solid rgba(221, 237, 255, .55);
          background: linear-gradient(
            160deg,
            rgba(224, 239, 255, .23),
            rgba(224, 239, 255, .07)
          );
          box-shadow: 0 15px 30px rgba(8, 22, 53, .12);
        }

        .sb-login-tower i {
          height: 13px;
          border: 1px solid rgba(230, 242, 255, .45);
          background: rgba(206, 228, 255, .34);
        }

        .sb-login-tower-one {
          left: 9%;
          width: 94px;
          height: 138px;
        }

        .sb-login-tower-two {
          left: 36%;
          width: 116px;
          height: 192px;
        }

        .sb-login-tower-three {
          right: 5%;
          width: 90px;
          height: 112px;
        }

        .sb-login-ground {
          position: absolute;
          right: -15px;
          bottom: 22px;
          left: -15px;
          height: 1px;
          background: rgba(221, 237, 255, .45);
        }

        .sb-login-showcase-footer {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 10px;
          color: #b8d1f8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .sb-login-form-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(28px, 5vw, 64px);
        }

        .sb-login-form-card {
          width: 100%;
          max-width: 370px;
          margin: 0 auto;
        }

        .sb-login-welcome {
          color: #3266ce;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.8px;
        }

        .sb-login-form-card h2 {
          margin: 13px 0 9px;
          color: #17243b;
          font-size: clamp(25px, 3vw, 31px);
          line-height: 1.25;
          letter-spacing: -1px;
        }

        .sb-login-description {
          margin: 0;
          color: #7b879a;
          font-size: 13px;
          line-height: 1.7;
        }

        .sb-login-form {
          display: grid;
          gap: 20px;
          margin-top: 34px;
        }

        .sb-login-form label {
          display: block;
          color: #35445c;
          font-size: 12px;
          font-weight: 750;
        }

        .sb-login-form input {
          display: block;
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          border: 1px solid #dbe2ed;
          border-radius: 10px;
          background: #fbfcfe;
          color: #17243b;
          font-size: 13px;
          transition: border-color .2s ease, box-shadow .2s ease,
            background .2s ease;
        }

        .sb-login-form input::placeholder {
          color: #a2acba;
        }

        .sb-login-form input:focus {
          outline: none;
          border-color: #5680d7;
          background: #fff;
          box-shadow: 0 0 0 4px #eaf0ff;
        }

        .sb-login-submit {
          width: 100%;
          min-height: 49px;
          justify-content: space-between;
          margin-top: 2px;
          padding: 14px 17px;
          border-radius: 10px;
          font-size: 13px;
          box-shadow: 0 7px 16px rgba(40, 88, 197, .18);
        }

        .sb-login-submit span {
          font-size: 18px;
        }

        .sb-login-form .sb-error {
          margin: -5px 0 0;
          padding: 10px 12px;
          border: 1px solid #f1caca;
          border-radius: 8px;
          background: #fff2f2;
          overflow-wrap: anywhere;
        }

        .sb-login-secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 26px;
          color: #8793a6;
          font-size: 10px;
          text-align: center;
        }

        .sb-login-secure-note span {
          color: #328765;
          font-size: 14px;
        }

        .sb-login-copyright {
          margin: 38px auto 0;
          color: #9aa4b3;
          font-size: 10px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 1100px) {
          .sb-sidebar {
            width: 215px;
            flex-basis: 215px;
          }

          .sb-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sb-building-art {
            right: 1%;
            opacity: .25;
          }
        }

        @media (max-width: 760px) {
          .sb-login-page {
            padding: 14px;
          }

          .sb-login-shell {
            grid-template-columns: 1fr;
            max-width: 520px;
            min-height: auto;
          }

          .sb-login-showcase {
            min-height: 300px;
            padding: 25px 27px 18px;
          }

          .sb-login-showcase-copy {
            margin-top: 35px;
          }

          .sb-login-showcase-copy h1 {
            max-width: 340px;
            font-size: 31px;
          }

          .sb-login-showcase-copy p {
            max-width: 340px;
            font-size: 12px;
          }

          .sb-login-illustration {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 220px;
            min-height: 170px;
            opacity: .55;
          }

          .sb-login-sun {
            width: 70px;
            height: 70px;
            right: 18%;
            bottom: 54px;
          }

          .sb-login-tower-one {
            left: 3%;
            width: 57px;
            height: 82px;
            gap: 5px;
            padding: 8px 6px;
          }

          .sb-login-tower-two {
            left: 34%;
            width: 72px;
            height: 117px;
            gap: 5px;
            padding: 8px 6px;
          }

          .sb-login-tower-three {
            right: 1%;
            width: 54px;
            height: 68px;
            gap: 5px;
            padding: 8px 6px;
          }

          .sb-login-tower i {
            height: 8px;
          }

          .sb-login-ground {
            bottom: 22px;
          }

          .sb-login-showcase-footer {
            font-size: 8px;
          }

          .sb-login-form-side {
            padding: 32px 27px 22px;
          }

          .sb-login-copyright {
            margin-top: 25px;
          }

          .sb-app {
            display: block;
          }

          .sb-sidebar {
            width: 100%;
            min-height: auto;
            padding: 14px 16px;
            border-right: 0;
            border-bottom: 1px solid var(--sb-border);
          }

          .sb-sidebar-brand {
            padding: 0 2px 14px;
          }

          .sb-sidebar-bottom {
            display: none;
          }

          .sb-nav-label {
            display: none;
          }

          .sb-nav-item {
            display: inline-flex;
            width: auto;
            margin: 0 5px 0 0;
            padding: 9px 12px;
          }

          .sb-main {
            padding: 23px 16px 18px;
          }

          .sb-welcome-banner {
            min-height: 220px;
          }

          .sb-building-art {
            right: -85px;
            opacity: .18;
          }

          .sb-lower-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 430px) {
          .sb-stats-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .sb-stat-card {
            padding: 18px;
          }

          .sb-task-numbers {
            gap: 8px;
          }

          .sb-task-numbers strong {
            font-size: 21px;
          }

          .sb-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default App