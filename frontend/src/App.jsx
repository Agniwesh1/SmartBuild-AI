import { useEffect, useState } from 'react'
import './App.css'
import { loginUser } from './api/authApi'
import { fetchDashboard } from './api/dashboardApi'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => sessionStorage.getItem('smartbuild_token') || '')
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setDashboard(null)
      return
    }

    let cancelled = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchDashboard(token)
        if (!cancelled) {
          setDashboard(data)
        }
      } catch {
        if (!cancelled) {
          setError('Dashboard load nahi hua. Please login again.')
          sessionStorage.removeItem('smartbuild_token')
          setToken('')
          setDashboard(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [token])

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginUser(username, password)

      if (!result.token) {
        throw new Error('Login response mein token nahi mila.')
      }

      sessionStorage.setItem('smartbuild_token', result.token)
      setUsername(result.username || username)
      setPassword('')
      setToken(result.token)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('smartbuild_token')
    setToken('')
    setDashboard(null)
    setPassword('')
    setError('')
  }

  const money = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)

  if (!token) {
    return (
      <main className="main-content" style={{ maxWidth: 460, margin: '70px auto', padding: 24 }}>
        <div className="brand" style={{ marginBottom: 32 }}>
          <div className="brand-icon">S</div>
          <div>
            <h2>SmartBuild</h2>
            <span>AI CONSTRUCTION</span>
          </div>
        </div>

        <section className="panel" style={{ padding: 28 }}>
          <h1>Welcome back</h1>
          <p>Sign in to manage your construction projects.</p>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
            <label>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
                style={{ display: 'block', width: '100%', padding: 12, marginTop: 6 }}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                style={{ display: 'block', width: '100%', padding: 12, marginTop: 6 }}
              />
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" className="ai-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  const data = dashboard

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SmartBuild</h2>
            <span>AI CONSTRUCTION</span>
          </div>
        </div>

        <div className="menu-label">WORKSPACE</div>

        <nav className="navigation">
          <a href="#dashboard" className="nav-item active"><span>▦</span> Dashboard</a>
          <a href="#projects" className="nav-item"><span>⌂</span> My Projects</a>
          <a href="#houses" className="nav-item"><span>▤</span> Houses & Rooms</a>
          <a href="#materials" className="nav-item"><span>▧</span> Materials</a>
          <a href="#tasks" className="nav-item"><span>✓</span> Tasks</a>
          <a href="#expenses" className="nav-item"><span>₹</span> Expenses</a>
          <a href="#contractors" className="nav-item"><span>♙</span> Contractors</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-card">
            <div className="ai-symbol">✦</div>
            <h3>SmartBuild AI</h3>
            <p>Your intelligent construction planning assistant.</p>
            <button type="button" className="ai-button">Explore AI</button>
          </div>

          <div className="profile">
            <div className="avatar">{(data?.username || username || 'A').charAt(0).toUpperCase()}</div>
            <div>
              <strong>{data?.username || username || 'My Account'}</strong>
              <span>Project owner</span>
            </div>
            <button type="button" onClick={handleLogout} aria-label="Log out">Logout</button>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
            <h1>Construction Dashboard</h1>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            <span className="status-text">Workspace overview</span>
            <div className="top-avatar">
              {(data?.username || username || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {error && <p role="alert">{error}</p>}
        {loading && !data && <p>Loading your dashboard...</p>}

        {data && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">YOUR CONSTRUCTION, SIMPLIFIED</p>
                <h2>Build your vision.</h2>
                <p className="welcome-description">
                  Plan smarter, manage your budget, and track every step of your construction journey.
                </p>
              </div>
              <div className="welcome-art" aria-hidden="true">
                <div className="building building-back"></div>
                <div className="building building-front">
                  <div className="building-windows"></div>
                </div>
                <div className="building-ground"></div>
              </div>
            </section>

            <section className="section-heading">
              <div>
                <h2>Project overview</h2>
                <p>Keep an eye on your construction at a glance.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => window.location.reload()}>
                Refresh data
              </button>
            </section>

            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-top"><span>Total projects</span><div className="stat-icon purple">▦</div></div>
                <strong className="stat-number">{data.totalProjects}</strong>
                <span className="stat-note">Your active workspace</span>
              </article>

              <article className="stat-card">
                <div className="stat-top"><span>Total budget</span><div className="stat-icon blue">₹</div></div>
                <strong className="stat-number">{money(data.totalBudget)}</strong>
                <span className="stat-note">Planned construction budget</span>
              </article>

              <article className="stat-card">
                <div className="stat-top"><span>Total expenses</span><div className="stat-icon orange">↗</div></div>
                <strong className="stat-number">{money(data.totalExpenses)}</strong>
                <span className="stat-note">Recorded spending</span>
              </article>

              <article className="stat-card">
                <div className="stat-top"><span>Construction progress</span><div className="stat-icon green">◷</div></div>
                <strong className="stat-number">{Number(data.averageProgressPercentage || 0)}%</strong>
                <span className="stat-note">Average recorded progress</span>
              </article>
            </section>

            <section className="content-grid">
              <article className="panel progress-panel" id="projects">
                <div className="panel-heading">
                  <div><h2>Construction progress</h2><p>Your overall recorded progress</p></div>
                  <span className="pill">In progress</span>
                </div>

                <div className="progress-summary">
                  <div>
                    <strong>{Number(data.averageProgressPercentage || 0)}%</strong>
                    <p>Average completion</p>
                  </div>
                  <div className="progress-circle">
                    <span>{Number(data.averageProgressPercentage || 0)}%</span>
                  </div>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, Math.max(0, Number(data.averageProgressPercentage) || 0))}%` }}
                  ></div>
                </div>

                <div className="progress-footer">
                  <span>Current progress</span>
                  <strong>{Number(data.averageProgressPercentage || 0)} of 100%</strong>
                </div>
              </article>

              <article className="panel tasks-panel" id="tasks">
                <div className="panel-heading">
                  <div><h2>Task summary</h2><p>Construction activities</p></div>
                  <span className="task-icon">✓</span>
                </div>

                <div className="task-numbers">
                  <div className="task-number-card"><span>Total tasks</span><strong>{data.totalTasks}</strong></div>
                  <div className="task-number-card"><span>Completed</span><strong>{data.completedTasks}</strong></div>
                </div>

                <div className="task-message">
                  <span className="task-message-icon">!</span>
                  <p>
                    {Number(data.totalTasks) === Number(data.completedTasks)
                      ? 'All recorded tasks are complete.'
                      : 'You have tasks to complete. Keep your construction moving.'}
                  </p>
                </div>
              </article>
            </section>

            <section className="panel budget-panel" id="expenses">
              <div className="panel-heading">
                <div><h2>Budget snapshot</h2><p>A quick look at your planned and spent amount</p></div>
              </div>

              <div className="budget-numbers">
                <div><span>Planned budget</span><strong>{money(data.totalBudget)}</strong></div>
                <div><span>Recorded expenses</span><strong>{money(data.totalExpenses)}</strong></div>
                <div>
                  <span>Remaining budget*</span>
                  <strong>{money(Number(data.totalBudget) - Number(data.totalExpenses))}</strong>
                </div>
              </div>

              <div className="budget-track">
                <div
                  className="budget-fill"
                  style={{
                    width: `${Number(data.totalBudget) > 0
                      ? Math.min(100, Math.max(0, (Number(data.totalExpenses) / Number(data.totalBudget)) * 100))
                      : 0}%`,
                  }}
                ></div>
              </div>

              <p className="budget-footnote">
                *Calculated by subtracting recorded expenses from the total budget.
              </p>
            </section>
          </>
        )}

        <footer className="page-footer">
          <span>SmartBuild AI</span>
          <span>Plan carefully. Build confidently.</span>
        </footer>
      </main>
    </div>
  )
}

export default App