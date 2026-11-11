import { useCallback, useEffect, useState } from 'react'
import './ProjectsPage.css'
import RoomManagement from './RoomManagement'
import FloorManagement from './FloorManagement'

function ProjectsPage({ token, onBack, onLogout }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  const [houses, setHouses] = useState([])
  const [housesLoading, setHousesLoading] = useState(false)
  const [houseSaving, setHouseSaving] = useState(false)
  const [houseError, setHouseError] = useState('')
  const [houseSuccess, setHouseSuccess] = useState('')

  const [houseName, setHouseName] = useState('')
  const [totalArea, setTotalArea] = useState('')
  const [numberOfFloors, setNumberOfFloors] = useState('1')

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

  async function loadHouses(projectId) {
    if (!token || token === 'undefined') {
      setHouseError('Login session nahi mila. Dobara login karein.')
      return
    }

    setHousesLoading(true)
    setHouseError('')

    try {
      const response = await fetch('/api/houses', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Could not load houses (${response.status}).`)
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Server se unexpected house data mila.')
      }

      const projectHouses = data.filter(
        (house) => String(house.projectId) === String(projectId),
      )

      setHouses(projectHouses)
    } catch (err) {
      setHouseError(err.message || 'Could not load houses.')
      setHouses([])
    } finally {
      setHousesLoading(false)
    }
  }

  async function handleRoomsSaved() {
    if (!selectedHouse || !token) {
      throw new Error('House details refresh nahi ho sake.')
    }

    const response = await fetch(`/api/houses/${selectedHouse.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`House details refresh failed (${response.status}).`)
    }

    const updatedHouse = await response.json()

    setSelectedHouse(updatedHouse)

    setHouses((currentHouses) =>
      currentHouses.map((house) =>
        String(house.id) === String(updatedHouse.id)
          ? updatedHouse
          : house,
      ),
    )
  }

  async function handleCreateHouse(event) {
    event.preventDefault()
    setHouseError('')
    setHouseSuccess('')

    if (!selectedProject) {
      setHouseError('Pehle ek project select karein.')
      return
    }

    const cleanHouseName = houseName.trim()
    const numericArea = Number(totalArea)
    const numericFloors = Number(numberOfFloors)

    if (!cleanHouseName) {
      setHouseError('House name enter karein.')
      return
    }

    if (!Number.isFinite(numericArea) || numericArea <= 0) {
      setHouseError('Total area zero se zyada hona chahiye.')
      return
    }

    if (!Number.isInteger(numericFloors) || numericFloors < 1) {
      setHouseError('Floors kam se kam 1 hone chahiye.')
      return
    }


    if (!token || token === 'undefined') {
      setHouseError('Login session nahi mila. Dobara login karein.')
      return
    }

    setHouseSaving(true)

    try {
      const response = await fetch('/api/houses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          houseName: cleanHouseName,
          totalArea: numericArea,
          numberOfFloors: numericFloors,
          numberOfBedrooms: 0,
          numberOfBathrooms: 0,
          projectId: selectedProject.id,
        }),
      })

      if (!response.ok) {
        let message = ''

        try {
          const body = await response.json()
          message = body.message || body.error || ''
        } catch {
          // Server ne JSON error response return nahi kiya.
        }

        throw new Error(
          message || `House creation failed (${response.status}).`,
        )
      }

      setHouseName('')
      setTotalArea('')
      setNumberOfFloors('1')

      await loadHouses(selectedProject.id)

      setHouseSuccess(
        `"${cleanHouseName}" house successfully save ho gaya.`,
      )
    } catch (err) {
      setHouseError(err.message || 'Could not create house.')
    } finally {
      setHouseSaving(false)
    }
  }

  async function handleViewDetails(projectId) {
    if (!token || token === 'undefined') {
      setDetailsError('Login session nahi mila. Dobara login karein.')
      return
    }

    setSelectedProject(null)
    setSelectedHouse(null)
    setDetailsError('')
    setHouseError('')
    setHouseSuccess('')
    setDetailsLoading(true)

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        let message = ''

        try {
          const body = await response.json()
          message = body.message || body.error || ''
        } catch {
          // Server ne JSON error response return nahi kiya.
        }

        throw new Error(
          message || `Could not load project details (${response.status}).`,
        )
      }

      const data = await response.json()

      setSelectedProject(data)
      setHouses([])
      setHouseName('')
      setTotalArea('')
      setNumberOfFloors('1')

      await loadHouses(projectId)
    } catch (err) {
      setDetailsError(err.message || 'Could not load project details.')
    } finally {
      setDetailsLoading(false)
    }
  }

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
          // Server ne JSON error response return nahi kiya.
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
          // Server non-JSON success response bhi de sakta hai.
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

  const formatDate = (date) => {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable'
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
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
          onClick={() => {
            setSelectedProject(null)
            setSelectedHouse(null)
            setDetailsError('')
            setHouseError('')
            setHouseSuccess('')
          }}
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
        {selectedProject ? (
          <>
            <header className="sb-topbar">
              <div>
                <p className="sb-breadcrumb">
                  Workspace / My Projects / Project Details
                </p>

                <h1>Project Details</h1>

                <p className="sb-muted">
                  Review the information saved for this construction project.
                </p>
              </div>

              <button
                type="button"
                className="sb-refresh-button"
                onClick={() => {
                  setSelectedProject(null)
                  setSelectedHouse(null)
                  setDetailsError('')
                  setHouseError('')
                  setHouseSuccess('')
                }}
              >
                ← Back to My Projects
              </button>
            </header>

            {detailsError && (
              <div className="sb-error-banner" role="alert">
                <span>!</span>
                {detailsError}
              </div>
            )}

            <section className="sp-details-hero">
              <div className="sp-details-icon">⌂</div>

              <div>
                <span className="sp-section-kicker">
                  PROJECT #{selectedProject.id}
                </span>

                <h2>{selectedProject.name || 'Untitled project'}</h2>

                <p>
                  <span aria-hidden="true">⌖</span>{' '}
                  {selectedProject.location || 'Location not specified'}
                </p>
              </div>
            </section>

            <section
              className="sp-details-grid"
              aria-label="Project information"
            >
              <article className="sp-details-card">
                <span className="sp-details-label">PROJECT ID</span>
                <strong>#{selectedProject.id ?? '—'}</strong>
                <p>Unique identifier for this project.</p>
              </article>

              <article className="sp-details-card">
                <span className="sp-details-label">PLANNED BUDGET</span>
                <strong>{money(selectedProject.budget)}</strong>
                <p>Estimated construction budget.</p>
              </article>

              <article className="sp-details-card">
                <span className="sp-details-label">CREATED ON</span>
                <strong>{formatDate(selectedProject.createdAt)}</strong>
                <p>Date this project was saved.</p>
              </article>
            </section>

            <section className="sp-house-section">
              <div className="sp-section-heading">
                <div>
                  <span className="sp-section-kicker">HOUSE MANAGEMENT</span>
                  <h2>House Details</h2>
                  <p>
                    Add and manage the houses associated with this project.
                  </p>
                </div>

                <div className="sp-form-number">02</div>
              </div>

              {houseError && (
                <div className="sb-error-banner" role="alert">
                  <span>!</span>
                  {houseError}
                </div>
              )}

              {houseSuccess && (
                <div className="sp-success-banner" role="status">
                  <span className="sp-success-icon">✓</span>
                  <span>{houseSuccess}</span>
                </div>
              )}

              <form
                onSubmit={handleCreateHouse}
                className="sp-create-form sp-house-form"
              >
                <label className="sp-field">
                  <span>House name</span>
                  <input
                    type="text"
                    value={houseName}
                    onChange={(event) => setHouseName(event.target.value)}
                    placeholder="e.g. Main Residence"
                    maxLength={120}
                    autoComplete="off"
                    required
                  />
                  <small>Give this house a recognisable name.</small>
                </label>

                <label className="sp-field">
                  <span>Total area</span>
                  <input
                    type="number"
                    value={totalArea}
                    onChange={(event) => setTotalArea(event.target.value)}
                    placeholder="e.g. 1800"
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <small>Enter the area using your preferred unit.</small>
                </label>

                <label className="sp-field">
                  <span>Number of floors</span>
                  <input
                    type="number"
                    value={numberOfFloors}
                    onChange={(event) =>
                      setNumberOfFloors(event.target.value)
                    }
                    min="1"
                    step="1"
                    required
                  />
                  <small>Include all planned floors.</small>
                </label>





                <div className="sp-form-footer">
                  <p>
                    <span>✓</span> This house will be linked to project #
                    {selectedProject.id}.
                  </p>

                  <button
                    type="submit"
                    className="sb-primary-button sp-submit-button"
                    disabled={houseSaving}
                  >
                    {houseSaving ? 'Saving house...' : '+ Add house'}
                    {!houseSaving && <span>→</span>}
                  </button>
                </div>
              </form>

              <div className="sp-house-list-heading">
                <div>
                  <h3>Houses in this project</h3>
                  <p className="sb-muted">
                    {houses.length}{' '}
                    {houses.length === 1 ? 'house' : 'houses'} saved
                  </p>
                </div>

                <button
                  type="button"
                  className="sb-refresh-button"
                  onClick={() => loadHouses(selectedProject.id)}
                  disabled={housesLoading}
                >
                  {housesLoading ? 'Refreshing...' : '↻ Refresh houses'}
                </button>
              </div>

              {housesLoading && (
                <div className="sp-state-card sp-house-state">
                  <div className="sp-spinner" />
                  <h3>Loading houses</h3>
                  <p>Retrieving house details for this project...</p>
                </div>
              )}

              {!housesLoading && houses.length === 0 && !houseError && (
                <div className="sp-state-card sp-house-state">
                  <div className="sp-empty-icon">⌂</div>
                  <h3>No houses added yet</h3>
                  <p>
                    Use the form above to add the first house to this project.
                  </p>
                </div>
              )}

              {!housesLoading && houses.length > 0 && (
                <div className="sp-house-grid">
                  {houses.map((house) => (
                    <article className="sp-house-card" key={house.id}>
                      <div className="sp-house-card-top">
                        <div className="sp-project-icon">⌂</div>
                        <span className="sp-project-id">
                          HOUSE #{house.id}
                        </span>
                      </div>

                      <h3>{house.houseName || 'Unnamed house'}</h3>

                      <p className="sp-house-project-label">
                        Project #{house.projectId ?? selectedProject.id}
                      </p>

                      <div className="sp-house-spec-grid">
                        <div>
                          <span>TOTAL AREA</span>
                          <strong>{house.totalArea ?? '—'}</strong>
                          <small> area units</small>
                        </div>

                        <div>
                          <span>FLOORS</span>
                          <strong>{house.numberOfFloors ?? '—'}</strong>
                        </div>

                        <div>
                          <span>BEDROOMS</span>
                          <strong>{house.numberOfBedrooms ?? '—'}</strong>
                        </div>

                        <div>
                          <span>BATHROOMS</span>
                          <strong>{house.numberOfBathrooms ?? '—'}</strong>
                        </div>
                      </div>

                      <div className="sp-project-meta">
                        <span>Created on</span>
                        <strong>{formatDate(house.createdAt)}</strong>
                      </div>

                      <button
                        type="button"
                        className="sp-details-button sp-manage-rooms-button"
                        onClick={() => setSelectedHouse(house)}
                      >
                        Manage Rooms <span>→</span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {selectedHouse && (
              <section className="sp-room-management-panel">
                <div className="sp-section-heading">
                  <div>
                    <span className="sp-section-kicker">
                      ROOM MANAGEMENT
                    </span>
                    <h2>
                      {selectedHouse.houseName || 'Unnamed house'}
                    </h2>
                    <p>
                      Manage the rooms associated with this house.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="sb-refresh-button"
                    onClick={() => setSelectedHouse(null)}
                  >
                    ← Back to Houses
                  </button>
                </div>

                <RoomManagement
                  house={selectedHouse}
                  token={token}
                  onRoomsSaved={handleRoomsSaved}
                />
                <FloorManagement house={selectedHouse} token={token} />
              </section>
            )}

            {!selectedHouse && (
              <section className="sp-details-next">
                <span className="sp-section-kicker">
                  NEXT IN SMARTBUILD AI
                </span>

                <h2>Build out your project plan</h2>

                <p>
                  This screen will become the home for your rooms, construction
                  phases, materials, contractors, expenses and progress. We will
                  connect these sections as their modules are implemented.
                </p>
              </section>
            )}
          </>
        ) : (
          <>
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
                <span className="sb-banner-label">
                  YOUR CONSTRUCTION PORTFOLIO
                </span>

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
                  {projects.length}{' '}
                  {projects.length === 1 ? 'project' : 'projects'}
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
                    You haven't created a project yet. Add your first
                    construction plan using the form above.
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
                        <strong>{formatDate(project.createdAt)}</strong>
                      </div>

                      <div className="sp-project-card-footer">
                        <span className="sp-status-dot" />
                        Project saved
                      </div>

                      <button
                        type="button"
                        className="sp-details-button"
                        onClick={() => handleViewDetails(project.id)}
                        disabled={detailsLoading}
                      >
                        {detailsLoading
                          ? 'Loading details...'
                          : 'View Details'}
                        <span>→</span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="sb-footer">
          <span>© SmartBuild AI</span>
          <span>Plan carefully. Build confidently.</span>
        </footer>
      </main>
    </div>
  )
}

export default ProjectsPage