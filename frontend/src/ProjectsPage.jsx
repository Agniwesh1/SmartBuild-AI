import { useCallback, useEffect, useState } from 'react'

function ProjectsPage({ token, onBack, onLogout }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')

  const loadProjects = useCallback(async () => {
    if (!token || token === 'undefined') {
      setProjects([])
      setError('Login session nahi mila. Dobara login karein.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Could not load projects (${response.status}).`)
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Server se unexpected project data mila.')
      }

      setProjects(data)
    } catch (err) {
      setError(err.message || 'Could not load projects.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  async function handleCreate(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const cleanName = name.trim()
    const cleanLocation = location.trim()
    const numericBudget = Number(budget)

    if (!cleanName || !cleanLocation) {
      setError('Project name aur location enter karein.')
      return
    }

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setError('Budget zero se zyada hona chahiye.')
      return
    }

    if (!token || token === 'undefined') {
      setError('Login session nahi mila. Dobara login karein.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          location: cleanLocation,
          budget: numericBudget,
        }),
      })

      if (!response.ok) {
        let message = ''

        try {
          const body = await response.json()
          message = body.message || body.error || ''
        } catch {
          // The server did not return a JSON error response.
        }

        throw new Error(
          message || `Project creation failed (${response.status}).`,
        )
      }

      const responseText = await response.text()
      let createdProject = null

      if (responseText.trim()) {
        try {
          createdProject = JSON.parse(responseText)
        } catch {
          // The server may return a non-JSON success response.
        }
      }

      setName('')
      setLocation('')
      setBudget('')

      await loadProjects()

      setSuccess(`"${cleanName}" was submitted successfully.`)

      if (
        createdProject &&
        createdProject.name &&
        createdProject.name !== cleanName
      ) {
        setError(
          'Server response mein project name form se alag hai. Saved project data verify karein.',
        )
      }
    } catch (err) {
      setError(err.message || 'Could not create project.')
    } finally {
      setSaving(false)
    }
  }

  const money = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)

  const compactMoney = (amount) => {
    const value = Number(amount) || 0

    if (value >= 10000000) {
      return `₹${(value / 10000000).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })} Cr`
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })} L`
    }

    return money(value)
  }

  const totalBudget = projects.reduce(
    (total, project) => total + (Number(project.budget) || 0),
    0,
  )

  return (
    <div className="sb-app sp-app">
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
          className="sb-nav-item"
          onClick={onBack}
        >
          <span>▦</span> Dashboard
        </button>

        <button
          type="button"
          className="sb-nav-item sb-nav-active"
          aria-current="page"
        >
          <span>▤</span> My Projects
        </button>

        <div className="sb-sidebar-bottom">
          <div className="sb-profile">
            <div className="sb-avatar">P</div>

            <div className="sb-profile-text">
              <strong>Project workspace</strong>
              <span>Construction planner</span>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              className="sb-logout-button"
              onClick={onLogout}
            >
              Log out
            </button>
          )}
        </div>
      </aside>

      <main className="sb-main sp-main">
        <header className="sb-topbar">
          <div>
            <p className="sb-breadcrumb">Workspace / My Projects</p>

            <h1>My Projects</h1>

            <p className="sb-muted">
              Turn your construction plans into organised projects.
            </p>
          </div>

          <div className="sp-header-actions">
            <button
              type="button"
              className="sb-refresh-button"
              onClick={loadProjects}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '↻ Refresh projects'}
            </button>

            <button
              type="button"
              className="sb-primary-button sp-header-button"
              onClick={() => {
                document.getElementById('sp-project-name')?.focus()
              }}
            >
              + New project
            </button>
          </div>
        </header>

        {error && (
          <div className="sb-error-banner" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="sp-success-banner" role="status">
            <span className="sp-success-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        <section className="sp-hero">
          <div className="sp-hero-copy">
            <span className="sb-banner-label">YOUR CONSTRUCTION PORTFOLIO</span>

            <h2>Every great build starts with a plan.</h2>

            <p>
              Keep your project locations, budgets and construction plans
              organised in one place.
            </p>

            <button
              type="button"
              className="sp-hero-button"
              onClick={() => {
                document.getElementById('sp-project-name')?.focus()
              }}
            >
              Create a project <span>→</span>
            </button>
          </div>

          <div className="sp-hero-art" aria-hidden="true">
            <div className="sp-sun" />

            <div className="sp-tower sp-tower-one">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} />
              ))}
            </div>

            <div className="sp-tower sp-tower-two">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} />
              ))}
            </div>

            <div className="sp-tower sp-tower-three">
              {Array.from({ length: 9 }, (_, index) => (
                <i key={index} />
              ))}
            </div>

            <div className="sp-ground" />
          </div>
        </section>

        <section className="sp-summary-grid">
          <article className="sp-summary-card">
            <div className="sp-summary-icon sp-summary-blue">▤</div>

            <div>
              <p>Total projects</p>
              <h3>{projects.length}</h3>
              <span>Projects in your workspace</span>
            </div>
          </article>

          <article className="sp-summary-card">
            <div className="sp-summary-icon sp-summary-green">₹</div>

            <div>
              <p>Combined budget</p>
              <h3>{compactMoney(totalBudget)}</h3>
              <span>{money(totalBudget)} planned across projects</span>
            </div>
          </article>

          <article className="sp-summary-card">
            <div className="sp-summary-icon sp-summary-purple">⌂</div>

            <div>
              <p>Workspace status</p>
              <h3>{loading ? 'Updating' : 'Ready'}</h3>
              <span>
                {loading
                  ? 'Retrieving your projects'
                  : 'Project management workspace'}
              </span>
            </div>
          </article>
        </section>

        <section className="sp-create-section">
          <div className="sp-section-heading">
            <div>
              <span className="sp-section-kicker">GET STARTED</span>
              <h2>Create a new project</h2>
              <p>Add the basic details of your construction plan.</p>
            </div>

            <div className="sp-form-number">01</div>
          </div>

          <form onSubmit={handleCreate} className="sp-create-form">
            <label className="sp-field">
              <span>Project name</span>

              <input
                id="sp-project-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. My Dream House"
                maxLength={120}
                autoComplete="off"
                required
              />

              <small>Choose a name you will recognise.</small>
            </label>

            <label className="sp-field">
              <span>Project location</span>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Gurugram, Haryana"
                maxLength={200}
                autoComplete="off"
                required
              />

              <small>Where will your construction take place?</small>
            </label>

            <label className="sp-field">
              <span>Estimated budget (₹)</span>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="e.g. 7500000"
                required
              />

              <small>Enter the planned construction budget.</small>
            </label>

            <div className="sp-form-footer">
              <p>
                <span>✓</span> Your project details will be saved to your
                workspace.
              </p>

              <button
                type="submit"
                className="sb-primary-button sp-submit-button"
                disabled={saving}
              >
                {saving ? 'Creating project...' : '+ Create project'}
                {!saving && <span>→</span>}
              </button>
            </div>
          </form>
        </section>

        <section className="sp-projects-section">
          <div className="sp-section-heading sp-projects-heading">
            <div>
              <span className="sp-section-kicker">YOUR WORKSPACE</span>
              <h2>All projects</h2>
              <p>Review the projects you have created.</p>
            </div>

            <span className="sp-project-count">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          {loading && (
            <div className="sp-state-card">
              <div className="sp-spinner" />
              <h3>Loading your projects</h3>
              <p>Retrieving your saved construction projects...</p>
            </div>
          )}

          {!loading && projects.length === 0 && !error && (
            <div className="sp-state-card">
              <div className="sp-empty-icon">⌂</div>

              <h3>Your next project starts here</h3>

              <p>
                You haven't created a project yet. Add your first construction
                plan using the form above.
              </p>

              <button
                type="button"
                className="sb-primary-button"
                onClick={() => {
                  document.getElementById('sp-project-name')?.focus()
                }}
              >
                Create your first project <span>→</span>
              </button>
            </div>
          )}

          {!loading && projects.length === 0 && error && (
            <div className="sp-state-card">
              <div className="sp-empty-icon">!</div>
              <h3>Projects couldn't be loaded</h3>
              <p>Check the error message above and try refreshing.</p>

              <button
                type="button"
                className="sb-primary-button"
                onClick={loadProjects}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="sp-project-grid">
              {projects.map((project) => (
                <article className="sp-project-card" key={project.id}>
                  <div className="sp-project-card-top">
                    <div className="sp-project-icon">⌂</div>

                    <span className="sp-project-id">
                      PROJECT #{project.id}
                    </span>
                  </div>

                  <h3>{project.name}</h3>

                  <p className="sp-project-location">
                    <span aria-hidden="true">⌖</span>
                    {project.location || 'Location not specified'}
                  </p>

                  <div className="sp-project-divider" />

                  <div className="sp-budget-label">PLANNED BUDGET</div>

                  <div className="sp-project-budget">
                    {money(project.budget)}
                  </div>

                  <div className="sp-project-meta">
                    <span>Created on</span>

                    <strong>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : 'Date unavailable'}
                    </strong>
                  </div>

                  <div className="sp-project-card-footer">
                    <span className="sp-status-dot" />
                    Project saved
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="sb-footer">
          <span>© SmartBuild AI</span>
          <span>Plan carefully. Build confidently.</span>
        </footer>
      </main>

      <style>{`
        .sp-app {
          --sp-border: #e5eaf1;
          --sp-muted: #7b879b;
        }

        .sp-main {
          flex: 1;
        }

        .sp-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sp-header-button {
          margin-top: 0;
          min-height: 40px;
        }

        .sp-success-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding: 13px 16px;
          border: 1px solid #bce8d0;
          border-radius: 10px;
          background: #effbf4;
          color: #197348;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .sp-success-icon {
          display: grid;
          place-items: center;
          width: 23px;
          height: 23px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #d5f4e2;
          font-weight: 800;
        }

        .sp-hero {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 225px;
          overflow: hidden;
          padding: 32px clamp(22px, 4vw, 42px);
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

        .sp-hero-copy {
          position: relative;
          z-index: 2;
          max-width: 490px;
        }

        .sp-hero-copy h2 {
          margin: 13px 0 9px;
          color: #fff;
          font-size: clamp(23px, 2.7vw, 31px);
          line-height: 1.2;
          letter-spacing: -.8px;
        }

        .sp-hero-copy p {
          max-width: 430px;
          margin: 0;
          color: #dce8ff;
          font-size: 13px;
          line-height: 1.8;
        }

        .sp-hero-button {
          display: inline-flex;
          align-items: center;
          gap: 17px;
          margin-top: 20px;
          padding: 11px 15px;
          border: 0;
          border-radius: 8px;
          background: #fff;
          color: #244b99;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        .sp-hero-button span {
          font-size: 17px;
        }

        .sp-hero-art {
          position: absolute;
          right: 5%;
          bottom: 0;
          width: 310px;
          height: 195px;
          opacity: .6;
          pointer-events: none;
        }

        .sp-sun {
          position: absolute;
          top: 5px;
          right: 40px;
          width: 95px;
          height: 95px;
          border-radius: 50%;
          background: rgba(200, 225, 255, .14);
        }

        .sp-tower {
          position: absolute;
          bottom: 22px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          align-content: start;
          gap: 8px;
          padding: 12px 9px;
          border: 1px solid rgba(255,255,255,.48);
          background: rgba(255,255,255,.14);
        }

        .sp-tower i {
          height: 12px;
          border: 1px solid rgba(255,255,255,.42);
          background: rgba(255,255,255,.32);
        }

        .sp-tower-one {
          left: 4%;
          width: 77px;
          height: 111px;
        }

        .sp-tower-two {
          left: 33%;
          width: 99px;
          height: 160px;
        }

        .sp-tower-three {
          right: 1%;
          width: 75px;
          height: 90px;
        }

        .sp-ground {
          position: absolute;
          right: -20px;
          bottom: 21px;
          left: 0;
          height: 1px;
          background: rgba(255,255,255,.5);
        }

        .sp-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .sp-summary-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 0;
          padding: 20px;
          border: 1px solid #e7ebf2;
          border-radius: 13px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(29, 47, 79, .025);
        }

        .sp-summary-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 12px;
          font-size: 21px;
          font-weight: 800;
        }

        .sp-summary-blue {
          color: #3266ce;
          background: #edf3ff;
        }

        .sp-summary-green {
          color: #21865b;
          background: #e6f8ef;
        }

        .sp-summary-purple {
          color: #8055c8;
          background: #f1eaff;
        }

        .sp-summary-card p {
          margin: 1px 0 7px;
          color: #748197;
          font-size: 12px;
        }

        .sp-summary-card h3 {
          margin: 0;
          color: #192840;
          font-size: clamp(20px, 2vw, 26px);
          letter-spacing: -.7px;
          overflow-wrap: anywhere;
        }

        .sp-summary-card span {
          display: block;
          margin-top: 7px;
          color: #96a0b0;
          font-size: 10px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .sp-create-section {
          margin-top: 22px;
          padding: clamp(20px, 3vw, 30px);
          border: 1px solid #e7ebf2;
          border-radius: 15px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(29, 47, 79, .025);
        }

        .sp-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 24px;
        }

        .sp-section-kicker {
          color: #3266ce;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.5px;
        }

        .sp-section-heading h2 {
          margin: 8px 0 6px;
          color: #1b2940;
          font-size: 21px;
          letter-spacing: -.6px;
        }

        .sp-section-heading p {
          margin: 0;
          color: #8793a6;
          font-size: 12px;
          line-height: 1.7;
        }

        .sp-form-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #edf3ff;
          color: #3266ce;
          font-size: 15px;
          font-weight: 800;
        }

        .sp-create-form {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .sp-field {
          display: block;
          min-width: 0;
          color: #35445c;
          font-size: 12px;
          font-weight: 750;
        }

        .sp-field > span {
          display: block;
          margin-bottom: 9px;
        }

        .sp-field input {
          display: block;
          width: 100%;
          min-height: 46px;
          padding: 12px 13px;
          border: 1px solid #dbe2ed;
          border-radius: 9px;
          background: #fbfcfe;
          color: #17243b;
          font: inherit;
          font-weight: 450;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .sp-field input::placeholder {
          color: #a2acba;
        }

        .sp-field input:focus {
          outline: none;
          border-color: #5680d7;
          background: #fff;
          box-shadow: 0 0 0 4px #eaf0ff;
        }

        .sp-field small {
          display: block;
          margin-top: 8px;
          color: #98a2b2;
          font-size: 10px;
          font-weight: 400;
          line-height: 1.6;
        }

        .sp-form-footer {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 6px;
          padding-top: 20px;
          border-top: 1px solid #edf0f5;
        }

        .sp-form-footer p {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 0;
          color: #8793a6;
          font-size: 11px;
          line-height: 1.7;
        }

        .sp-form-footer p span {
          color: #21865b;
          font-weight: 900;
        }

        .sp-submit-button {
          margin-top: 0;
          min-height: 43px;
        }

        .sp-submit-button span {
          font-size: 16px;
        }

        .sp-projects-section {
          margin-top: 34px;
        }

        .sp-projects-heading {
          margin-bottom: 19px;
        }

        .sp-project-count {
          padding: 8px 12px;
          border: 1px solid #e0e8f8;
          border-radius: 20px;
          background: #edf3ff;
          color: #3266ce;
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
        }

        .sp-project-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
        }

        .sp-project-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e5eaf1;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(29, 47, 79, .025);
          transition: transform .2s ease, box-shadow .2s ease,
            border-color .2s ease;
        }

        .sp-project-card:hover {
          transform: translateY(-3px);
          border-color: #d0ddf5;
          box-shadow: 0 12px 28px rgba(29, 47, 79, .07);
        }

        .sp-project-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
        }

        .sp-project-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: #edf3ff;
          color: #3266ce;
          font-size: 25px;
        }

        .sp-project-id {
          color: #9aa5b5;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1px;
          overflow-wrap: anywhere;
        }

        .sp-project-card h3 {
          margin: 0;
          color: #1b2940;
          font-size: 18px;
          line-height: 1.45;
          letter-spacing: -.4px;
          overflow-wrap: anywhere;
        }

        .sp-project-location {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin: 10px 0 0;
          color: #7b879b;
          font-size: 12px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .sp-project-location span {
          color: #3266ce;
          font-size: 17px;
          line-height: 1.1;
        }

        .sp-project-divider {
          height: 1px;
          margin: 20px 0 16px;
          background: #edf0f5;
        }

        .sp-budget-label {
          color: #96a0b0;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.1px;
        }

        .sp-project-budget {
          margin-top: 7px;
          color: #1c3154;
          font-size: clamp(21px, 2vw, 26px);
          font-weight: 800;
          letter-spacing: -.8px;
          overflow-wrap: anywhere;
        }

        .sp-project-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 19px;
          padding-top: 15px;
          border-top: 1px solid #edf0f5;
          color: #8a95a7;
          font-size: 10px;
        }

        .sp-project-meta strong {
          color: #56647b;
          font-size: 10px;
        }

        .sp-project-card-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 17px;
          color: #25845d;
          font-size: 10px;
          font-weight: 700;
        }

        .sp-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #35ad78;
          box-shadow: 0 0 0 3px #e7f8ef;
        }

        .sp-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 250px;
          padding: 30px 22px;
          border: 1px dashed #d6deeb;
          border-radius: 14px;
          background: rgba(255, 255, 255, .7);
          text-align: center;
        }

        .sp-state-card h3 {
          margin: 15px 0 7px;
          color: #1b2940;
          font-size: 17px;
        }

        .sp-state-card p {
          max-width: 390px;
          margin: 0;
          color: #8793a6;
          font-size: 12px;
          line-height: 1.8;
        }

        .sp-empty-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border-radius: 17px;
          background: #edf3ff;
          color: #3266ce;
          font-size: 32px;
        }

        .sp-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #e1e9f8;
          border-top-color: #3266ce;
          border-radius: 50%;
          animation: sp-spin .8s linear infinite;
        }

        @keyframes sp-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1250px) {
          .sp-project-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 1100px) {
          .sp-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sp-hero-art {
            right: -30px;
            opacity: .3;
          }

          .sp-create-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .sp-main {
            padding: 23px 16px 18px;
          }

          .sp-header-actions {
            width: 100%;
          }

          .sp-hero {
            min-height: 235px;
          }

          .sp-hero-art {
            right: -105px;
            opacity: .22;
          }

          .sp-project-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .sp-create-form {
            grid-template-columns: minmax(0, 1fr);
          }

          .sp-form-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .sp-submit-button {
            width: 100%;
          }

          .sp-summary-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 430px) {
          .sp-create-section {
            padding: 19px;
          }

          .sp-project-card {
            padding: 19px;
          }

          .sp-hero-copy h2 {
            font-size: 24px;
          }

          .sp-projects-heading {
            align-items: flex-start;
          }

          .sp-project-count {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectsPage