import { useCallback, useEffect, useState } from 'react'

export default function FloorManagement({ house, token }) {
  const [floors, setFloors] = useState([])
  const [floorName, setFloorName] = useState('Ground Floor')
  const [floorNumber, setFloorNumber] = useState('1')
  const [area, setArea] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }
  const loadFloors = useCallback(async () => {
    setLoading(true); setError('')
    try { const r = await fetch(`/api/floors/house/${house.id}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }); if (!r.ok) throw new Error(`Could not load floors (${r.status})`); setFloors(await r.json()) }
    catch (e) { setError(e.message || 'Could not load floors.') } finally { setLoading(false) }
  }, [house.id, token])
  useEffect(() => { loadFloors() }, [loadFloors])
  function reset(){setFloorName('');setFloorNumber(String(Math.max(0,...floors.map(f=>f.floorNumber))+1));setArea('');setEditingId(null)}
  async function submit(e){e.preventDefault();setError('');const n=Number(floorNumber);const a=area===''?null:Number(area);if(!floorName.trim()||!Number.isInteger(n)||n<1||(a!==null&&(!Number.isFinite(a)||a<0))){setError('Enter a floor name, positive floor number and valid optional area.');return}setSaving(true);try{const r=await fetch(editingId?`/api/floors/${editingId}`:'/api/floors',{method:editingId?'PUT':'POST',headers,body:JSON.stringify({floorName:floorName.trim(),floorNumber:n,area:a,houseId:house.id})});if(!r.ok){const t=await r.text();throw new Error(t||`Save failed (${r.status})`)}reset();await loadFloors()}catch(e){setError(e.message||'Could not save floor.')}finally{setSaving(false)}}
  async function remove(id){if(!window.confirm('Delete this floor?'))return;try{const r=await fetch(`/api/floors/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`Delete failed (${r.status})`);await loadFloors()}catch(e){setError(e.message)}}
  return <section style={{marginTop:24,padding:20,border:'1px solid #dbe3ed',borderRadius:14,background:'white'}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap'}}><div><h2 style={{margin:'0 0 6px'}}>Floor Management</h2><p style={{margin:0,color:'#64748b'}}>Manage floors for {house.houseName}. Floor records do not change the manually entered house floor count.</p></div><button type="button" onClick={loadFloors} disabled={loading}>↻ Refresh</button></div>{error&&<p role="alert" style={{color:'#b91c1c'}}>{error}</p>}<form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10,marginTop:16}}><label>Floor name<input required value={floorName} onChange={e=>setFloorName(e.target.value)} placeholder="Ground Floor" /></label><label>Floor number<input required type="number" min="1" step="1" value={floorNumber} onChange={e=>setFloorNumber(e.target.value)} /></label><label>Floor area (optional)<input type="number" min="0" step="0.01" value={area} onChange={e=>setArea(e.target.value)} placeholder="Area" /></label><div style={{display:'flex',gap:8,alignItems:'end'}}><button type="submit" disabled={saving}>{saving?'Saving...':editingId?'Update floor':'Add floor'}</button>{editingId&&<button type="button" onClick={reset}>Cancel</button>}</div></form>{loading?<p>Loading floors...</p>:floors.length===0?<p>No floors added yet.</p>:<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12,marginTop:16}}>{floors.map(f=><article key={f.id} style={{border:'1px solid #e2e8f0',borderRadius:10,padding:14}}><strong>{f.floorName}</strong><p>Floor #{f.floorNumber} · Area: {f.area??'Not specified'}</p><div style={{display:'flex',gap:8}}><button type="button" onClick={()=>{setEditingId(f.id);setFloorName(f.floorName);setFloorNumber(String(f.floorNumber));setArea(f.area??'')}}>Edit</button><button type="button" onClick={()=>remove(f.id)}>Delete</button></div></article>)}</div>}</section>
}
