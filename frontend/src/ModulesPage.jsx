import { useCallback, useEffect, useMemo, useState } from 'react'
import './ModulesPage.css'

const MODULES = {
  tasks: {
    title: 'Construction Planning',
    subtitle: 'Plan work, assign priorities and track due dates.',
    endpoint: '/api/tasks',
    singular: 'task',
    fields: [
      { name: 'taskName', label: 'Task name', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'On Hold'], required: true, defaultValue: 'Pending' },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], required: true, defaultValue: 'Medium' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'dueDate', label: 'Due date', type: 'date' },
      { name: 'houseId', label: 'House ID', type: 'number', required: true },
    ],
    columns: ['taskName', 'status', 'priority', 'startDate', 'dueDate', 'houseId'],
  },
  materials: {
    title: 'Materials & Inventory',
    subtitle: 'Keep material quantities, units and costs in one place.',
    endpoint: '/api/materials',
    singular: 'material',
    fields: [
      { name: 'materialName', label: 'Material name', required: true },
      { name: 'materialType', label: 'Category / type' },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'unit', label: 'Unit', placeholder: 'e.g. bags, kg, m³' },
      { name: 'price', label: 'Unit price (₹)', type: 'number' },
      { name: 'houseId', label: 'House ID', type: 'number', required: true },
    ],
    columns: ['materialName', 'materialType', 'quantity', 'unit', 'price', 'houseId'],
  },
  contractors: {
    title: 'Contractors & Labour',
    subtitle: 'Maintain contractor contacts, specialties and contract values.',
    endpoint: '/api/contractors',
    singular: 'contractor',
    fields: [
      { name: 'name', label: 'Contact name', required: true },
      { name: 'company', label: 'Company' },
      { name: 'phone', label: 'Phone' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'specialization', label: 'Specialization' },
      { name: 'contractAmount', label: 'Contract amount (₹)', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Pending', 'Completed', 'Inactive'], defaultValue: 'Active' },
      { name: 'projectId', label: 'Project ID', type: 'number', required: true },
    ],
    columns: ['name', 'company', 'specialization', 'phone', 'contractAmount', 'status', 'projectId'],
  },
  budgets: {
    title: 'Budget & Expenses',
    subtitle: 'Set a house budget, record expenses and review the budget position.',
    endpoint: '/api/budgets',
    singular: 'budget',
    fields: [
      { name: 'totalBudget', label: 'Total budget (₹)', type: 'number', required: true },
      { name: 'houseId', label: 'House ID', type: 'number', required: true },
    ],
    columns: ['houseId', 'totalBudget', 'createdAt'],
  },
  expenses: {
    title: 'Expense Register',
    subtitle: 'Record costs against the house and categorize spending.',
    endpoint: '/api/expenses',
    singular: 'expense',
    fields: [
      { name: 'expenseName', label: 'Expense name', required: true },
      { name: 'expenseType', label: 'Expense category', required: true },
      { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'houseId', label: 'House ID', type: 'number', required: true },
    ],
    columns: ['expenseName', 'expenseType', 'amount', 'description', 'houseId', 'createdAt'],
  },
  progress: {
    title: 'Construction Progress',
    subtitle: 'Track each construction stage and its completion percentage.',
    endpoint: '/api/construction-progress',
    singular: 'stage',
    fields: [
      { name: 'stageName', label: 'Stage name', required: true },
      { name: 'progressPercentage', label: 'Progress (%)', type: 'number', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Completed', 'On Hold'], defaultValue: 'Not Started' },
      { name: 'houseId', label: 'House ID', type: 'number', required: true },
    ],
    columns: ['stageName', 'progressPercentage', 'status', 'houseId', 'createdAt'],
  },
}

const money = (value) => value == null || value === '' ? '—' : `₹${Number(value).toLocaleString('en-IN')}`
const pretty = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())

function ModuleForm({ config, initial, onSave, onCancel, saving }) {
  const [values, setValues] = useState(() => Object.fromEntries(config.fields.map((field) => [
    field.name, initial?.[field.name] ?? field.defaultValue ?? '',
  ])))
  const update = (name, value) => setValues((current) => ({ ...current, [name]: value }))

  return (
    <form className="sbm-form" onSubmit={(event) => {
      event.preventDefault()
      const payload = Object.fromEntries(config.fields.map((field) => {
        const value = values[field.name]
        return [field.name, value === '' ? null : ['number'].includes(field.type) ? Number(value) : value]
      }).filter(([, value]) => value !== null))
      onSave(payload)
    }}>
      <div className="sbm-form-grid">
        {config.fields.map((field) => (
          <label className={field.type === 'textarea' ? 'sbm-wide' : ''} key={field.name}>
            <span>{field.label}{field.required ? ' *' : ''}</span>
            {field.type === 'textarea' ? (
              <textarea value={values[field.name]} required={field.required} onChange={(e) => update(field.name, e.target.value)} placeholder={field.placeholder || ''} rows="3" />
            ) : field.type === 'select' ? (
              <select value={values[field.name]} required={field.required} onChange={(e) => update(field.name, e.target.value)}>
                <option value="">Choose...</option>
                {field.options.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : (
              <input type={field.type || 'text'} value={values[field.name]} required={field.required} min={field.type === 'number' ? 0 : undefined} step={field.type === 'number' ? 'any' : undefined} onChange={(e) => update(field.name, e.target.value)} placeholder={field.placeholder || ''} />
            )}
          </label>
        ))}
      </div>
      <div className="sbm-form-actions">
        <button className="sbm-button sbm-primary" disabled={saving}>{saving ? 'Saving…' : initial ? 'Update record' : 'Save record'}</button>
        <button className="sbm-button sbm-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function RecordsModule({ module, token }) {
  const config = MODULES[module]
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `Request failed (${response.status})`)
    }
    if (response.status === 204) return null
    return response.json()
  }, [token])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await request(config.endpoint)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || `Could not load ${config.title.toLowerCase()}.`)
    } finally {
      setLoading(false)
    }
  }, [config.endpoint, config.title, request])

  useEffect(() => { load() }, [load])

  async function save(payload) {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (editing?.id) {
        await request(`${config.endpoint}/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        setNotice(`${config.singular} updated.`)
      } else {
        await request(config.endpoint, { method: 'POST', body: JSON.stringify(payload) })
        setNotice(`${config.singular} saved.`)
      }
      setShowForm(false)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err.message || `Could not save ${config.singular}.`)
    } finally {
      setSaving(false)
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete this ${config.singular}? This cannot be undone.`)) return
    setError('')
    setNotice('')
    try {
      await request(`${config.endpoint}/${item.id}`, { method: 'DELETE' })
      setNotice(`${config.singular} deleted.`)
      await load()
    } catch (err) {
      setError(err.message || `Could not delete ${config.singular}.`)
    }
  }

  return (
    <section className="sbm-panel">
      <div className="sbm-panel-heading">
        <div><p className="sbm-eyebrow">SMARTBUILD WORKSPACE</p><h2>{config.title}</h2><p>{config.subtitle}</p></div>
        <button className="sbm-button sbm-primary" onClick={() => { setEditing(null); setShowForm(true); setError('') }}>＋ Add {config.singular}</button>
      </div>
      {error && <div className="sbm-alert sbm-error" role="alert">{error}</div>}
      {notice && <div className="sbm-alert sbm-success" role="status">{notice}</div>}
      {showForm && <div className="sbm-form-card"><h3>{editing ? `Edit ${config.singular}` : `New ${config.singular}`}</h3><ModuleForm config={config} initial={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} saving={saving} /></div>}
      <div className="sbm-table-wrap">
        {loading ? <p className="sbm-empty">Loading records…</p> : items.length === 0 ? <div className="sbm-empty"><strong>No records yet</strong><span>Add your first {config.singular} to get started.</span></div> : (
          <table className="sbm-table"><thead><tr>{config.columns.map((key) => <th key={key}>{pretty(key)}</th>)}<th>Actions</th></tr></thead>
            <tbody>{items.map((item) => <tr key={item.id}>{config.columns.map((key) => <td key={key}>{key.toLowerCase().includes('amount') || key === 'price' || key === 'totalBudget' ? money(item[key]) : item[key] ?? '—'}</td>)}<td><div className="sbm-row-actions"><button onClick={() => { setEditing(item); setShowForm(true); setError('') }}>Edit</button><button className="sbm-danger" onClick={() => remove(item)}>Delete</button></div></td></tr>)}</tbody>
          </table>
        )}
      </div>
      <p className="sbm-footnote">Records are saved to your SmartBuild AI database through the authenticated backend.</p>
    </section>
  )
}

function AssistantPanel() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const tips = [
    { match: /budget|cost|expense|money/i, title: 'Budget control', body: 'Create a budget for the house first, then record each payment as an expense. Review the budget analysis regularly and keep a contingency reserve for price changes.' },
    { match: /material|inventory|cement|steel|brick/i, title: 'Material planning', body: 'Track material name, category, quantity, unit and price. Compare delivered quantities with purchase records and update stock after each delivery or usage.' },
    { match: /contractor|labour|worker|labor/i, title: 'Contractor coordination', body: 'Record each contractor against the relevant project, document their specialty and agreed contract amount, and review progress before releasing milestone payments.' },
    { match: /schedule|task|delay|timeline|plan/i, title: 'Schedule management', body: 'Break the build into clear tasks, set start and due dates, assign priorities, and update status at each site review. Track dependencies before moving to the next stage.' },
    { match: /progress|stage|construction/i, title: 'Progress tracking', body: 'Create a progress record for each major stage, update its percentage and status consistently, and compare the reported progress with verified work on site.' },
  ]
  function ask(event) {
    event.preventDefault()
    const match = tips.find((tip) => tip.match.test(question))
    setAnswer(match ? `${match.title}: ${match.body}` : 'Start by selecting the area you want to plan: budget, materials, contractor coordination, schedule or construction progress. Ask a specific question and I can show the relevant planning checklist.')
  }
  return <section className="sbm-panel"><div className="sbm-panel-heading"><div><p className="sbm-eyebrow">PLANNING SUPPORT</p><h2>Construction Assistant</h2><p>Practical, built-in construction planning guidance.</p></div></div>
    <div className="sbm-assistant-note"><strong>About this assistant</strong><p>This version provides rule-based planning guidance inside the app. It is not connected to a live generative AI service.</p></div>
    <form className="sbm-ask-form" onSubmit={ask}><label htmlFor="sbm-question">What do you need help planning?</label><textarea id="sbm-question" rows="3" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. How can I control material costs?" required /><button className="sbm-button sbm-primary">Get guidance</button></form>
    {answer && <div className="sbm-answer"><span>PLANNING GUIDANCE</span><p>{answer}</p></div>}
    <div className="sbm-tip-grid">{tips.map((tip) => <article key={tip.title}><strong>{tip.title}</strong><p>{tip.body}</p></article>)}</div>
  </section>
}

function ReportsPanel({ token }) {
  const [data, setData] = useState({ budgets: [], expenses: [], progress: [], tasks: [], materials: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true); setError('')
      try {
        const endpoints = ['/api/budgets', '/api/expenses', '/api/construction-progress', '/api/tasks', '/api/materials']
        const results = await Promise.all(endpoints.map(async (url) => {
          const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
          if (!response.ok) throw new Error(`Could not load report data (${response.status})`)
          return response.json()
        }))
        if (active) setData({ budgets: results[0], expenses: results[1], progress: results[2], tasks: results[3], materials: results[4] })
      } catch (err) { if (active) setError(err.message) } finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [token])
  const totals = useMemo(() => ({
    budget: data.budgets.reduce((sum, row) => sum + Number(row.totalBudget || 0), 0),
    spent: data.expenses.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    progress: data.progress.length ? data.progress.reduce((sum, row) => sum + Number(row.progressPercentage || 0), 0) / data.progress.length : 0,
    completed: data.tasks.filter((row) => String(row.status).toLowerCase() === 'completed').length,
  }), [data])
  function exportCsv() {
    const rows = [['Report', 'Value'], ['Total budget (INR)', totals.budget], ['Recorded expenses (INR)', totals.spent], ['Remaining budget (INR)', totals.budget - totals.spent], ['Average stage progress (%)', totals.progress.toFixed(1)], ['Completed tasks', totals.completed], ['Total tasks', data.tasks.length]]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = 'smartbuild-summary-report.csv'; link.click(); URL.revokeObjectURL(url)
  }
  return <section className="sbm-panel"><div className="sbm-panel-heading"><div><p className="sbm-eyebrow">PROJECT INSIGHTS</p><h2>Dashboard & Reports</h2><p>Summary calculated from the records currently stored in your account.</p></div><button className="sbm-button sbm-primary" onClick={exportCsv} disabled={loading || !!error}>Export CSV</button></div>
    {error && <div className="sbm-alert sbm-error">{error}</div>}
    {loading ? <p className="sbm-empty">Preparing report…</p> : <><div className="sbm-report-grid">
      <article><span>Total budget</span><strong>{money(totals.budget)}</strong></article><article><span>Recorded expenses</span><strong>{money(totals.spent)}</strong></article><article><span>Remaining (simple total)</span><strong>{money(totals.budget - totals.spent)}</strong></article><article><span>Average stage progress</span><strong>{totals.progress.toFixed(1)}%</strong></article><article><span>Completed tasks</span><strong>{totals.completed} / {data.tasks.length}</strong></article><article><span>Inventory records</span><strong>{data.materials.length} items</strong></article>
    </div><p className="sbm-footnote">The report sums all records returned by the current APIs. It is a workspace-wide summary, not a house-specific accounting statement.</p></>}
  </section>
}

export default function ModulesPage({ module, token, onBack }) {
  if (module === 'assistant') return <main className="sbm-page"><button className="sbm-back" onClick={onBack}>← Back to dashboard</button><AssistantPanel /></main>
  if (module === 'reports') return <main className="sbm-page"><button className="sbm-back" onClick={onBack}>← Back to dashboard</button><ReportsPanel token={token} /></main>
  return <main className="sbm-page"><button className="sbm-back" onClick={onBack}>← Back to dashboard</button><RecordsModule module={module} token={token} /></main>
}
