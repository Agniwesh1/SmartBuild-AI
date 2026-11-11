import { useCallback, useEffect, useState } from 'react'
import './App.css'
import ProjectsPage from './ProjectsPage'
import { loginUser } from './api/authApi'
import AccountSettings from './AccountSettings'
import { fetchDashboard } from './api/dashboardApi'
import ModulesPage from './ModulesPage'

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

  function handleCredentialsChanged() {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setDashboard(null)
    setUsername('')
    setPassword('')
    setError('')
    setPage('dashboard')
  }

  // Login page
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

  // Account Settings page
  if (page === 'account-settings') {
    return (
      <AccountSettings
        token={token}
        username={username}
        onBack={() => {
          setError('')
          setPage('dashboard')
        }}
        onCredentialsChanged={handleCredentialsChanged}
      />
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

  // Integrated construction modules
  const modulePages = ['tasks', 'materials', 'contractors', 'budgets', 'expenses', 'progress', 'assistant', 'reports']
  if (modulePages.includes(page)) {
    return (
      <div className="sb-app">
        <aside className="sb-sidebar">
          <div className="sb-sidebar-brand">
            <div className="sb-brand-mark">SB</div>
            <div><strong>SmartBuild</strong><span>AI CONSTRUCTION</span></div>
          </div>
          <p className="sb-nav-label">WORKSPACE</p>
          <button type="button" className="sb-nav-item" onClick={() => { setPage('dashboard'); loadDashboard(token) }}><span>▦</span> Dashboard</button>
          <button type="button" className="sb-nav-item" onClick={() => setPage('projects')}><span>▤</span> My Projects</button>
          <p className="sb-nav-label">BUILD MANAGEMENT</p>
          {[
            ['tasks', 'Construction Planning'], ['materials', 'Materials & Inventory'],
            ['contractors', 'Contractors & Labour'], ['budgets', 'Budget Setup'],
            ['expenses', 'Expense Register'], ['progress', 'Construction Progress'],
            ['assistant', 'Construction Assistant'], ['reports', 'Reports'],
          ].map(([key, label]) => (
            <button key={key} type="button" className={`sb-nav-item ${page === key ? 'sb-nav-active' : ''}`} onClick={() => setPage(key)}><span>•</span> {label}</button>
          ))}
          <div className="sb-sidebar-bottom">
            <div className="sb-profile"><div className="sb-avatar">{(username || 'U').charAt(0).toUpperCase()}</div><div className="sb-profile-text"><strong>{username || 'User'}</strong><span>Project owner</span></div></div>
            <button className="sb-logout-button" onClick={handleLogout}>Log out</button>
          </div>
        </aside>
        <div className="sb-main">
          <header className="sb-topbar"><div><p className="sb-breadcrumb">Workspace / Build management</p><h1>SmartBuild AI</h1></div></header>
          <ModulesPage module={page} token={token} onBack={() => { setPage('dashboard'); loadDashboard(token) }} />
        </div>
      </div>
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
          className={`sb-nav-item ${
            page === 'dashboard' ? 'sb-nav-active' : ''
          }`}
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

        <p className="sb-nav-label">BUILD MANAGEMENT</p>
        {[
          ['tasks', 'Construction Planning'], ['materials', 'Materials & Inventory'],
          ['contractors', 'Contractors & Labour'], ['budgets', 'Budget Setup'],
          ['expenses', 'Expense Register'], ['progress', 'Construction Progress'],
          ['assistant', 'Construction Assistant'], ['reports', 'Reports'],
        ].map(([key, label]) => (
          <button key={key} type="button" className="sb-nav-item" onClick={() => setPage(key)}>
            <span>•</span> {label}
          </button>
        ))}

        <button
          type="button"
          className={`sb-nav-item ${
            page === 'account-settings' ? 'sb-nav-active' : ''
          }`}
          onClick={() => {
            setError('')
            setPage('account-settings')
          }}
        >
          <span>⚙</span> Account Settings
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
    </div>
  )
}

export default App