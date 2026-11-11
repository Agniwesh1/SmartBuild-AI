import { useCallback, useEffect, useState } from 'react'

function RoomManagement({ house, token, onRoomsSaved }) {
  const [rooms, setRooms] = useState([])
  const [pendingRooms, setPendingRooms] = useState([])
  const [deletedRoomIds, setDeletedRoomIds] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editingDraftKey, setEditingDraftKey] = useState(null)
  const [roomName, setRoomName] = useState('')
  const [roomType, setRoomType] = useState('Bedroom')
  const [area, setArea] = useState('')

  const loadRooms = useCallback(async () => {
    if (!token || token === 'undefined') {
      setError('Login session nahi mila. Dobara login karein.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rooms', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Rooms load nahi hue (${response.status}).`)
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Server se unexpected room data mila.')
      }

      const houseRooms = data.filter(
        (room) => String(room.houseId) === String(house.id),
      )

      setRooms(houseRooms)
    } catch (err) {
      setError(err.message || 'Rooms load nahi ho sake.')
    } finally {
      setLoading(false)
    }
  }, [house.id, token])

  useEffect(() => {
    setPendingRooms([])
    setDeletedRoomIds([])
    setEditingDraftKey(null)
    loadRooms()
  }, [loadRooms])

  function resetForm() {
    setRoomName('')
    setRoomType('Bedroom')
    setArea('')
    setEditingDraftKey(null)
  }

  function handleEdit(room) {
    if (deletedRoomIds.includes(room.id)) {
      return
    }

    const existingDraft = pendingRooms.find(
      (draft) => draft.id === room.id,
    )

    const draft = existingDraft || {
      draftKey: `room-${room.id}`,
      id: room.id,
      roomName: room.roomName || '',
      roomType: room.roomType || 'Other',
      area: room.area,
      isNew: false,
    }

    setEditingDraftKey(draft.draftKey)
    setRoomName(draft.roomName)
    setRoomType(draft.roomType)
    setArea(draft.area == null ? '' : String(draft.area))
    setError('')
    setSuccess('')
  }

  function handleEditPending(draft) {
    setEditingDraftKey(draft.draftKey)
    setRoomName(draft.roomName)
    setRoomType(draft.roomType)
    setArea(String(draft.area))
    setError('')
    setSuccess('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const cleanName = roomName.trim()
    const numericArea = Number(area)

    if (!cleanName) {
      setError('Room name enter karein.')
      return
    }

    if (!Number.isFinite(numericArea) || numericArea <= 0) {
      setError('Room area zero se zyada hona chahiye.')
      return
    }

    const existingDraft = pendingRooms.find(
      (draft) => draft.draftKey === editingDraftKey,
    )

    const newDraft = {
      draftKey: editingDraftKey || `new-${Date.now()}`,
      id: existingDraft?.id ?? null,
      roomName: cleanName,
      roomType,
      area: numericArea,
      isNew: existingDraft ? existingDraft.isNew : true,
    }

    if (editingDraftKey) {
      setPendingRooms((current) =>
        current.some((draft) => draft.draftKey === editingDraftKey)
          ? current.map((draft) =>
              draft.draftKey === editingDraftKey ? newDraft : draft,
            )
          : [...current, newDraft],
      )
    } else {
      setPendingRooms((current) => [...current, newDraft])
    }

    resetForm()
    setSuccess(
      'Room change Pending Changes mein add ho gaya. House mein abhi save nahi hua.',
    )
  }

  function handleDeleteSavedRoom(room) {
    if (deletedRoomIds.includes(room.id)) {
      setDeletedRoomIds((current) =>
        current.filter((id) => id !== room.id),
      )

      setSuccess(`"${room.roomName}" deletion cancel kar diya gaya.`)
      return
    }

    setPendingRooms((current) =>
      current.filter((draft) => draft.id !== room.id),
    )

    setDeletedRoomIds((current) => [...current, room.id])

    if (editingDraftKey === `room-${room.id}`) {
      resetForm()
    }

    setSuccess(`"${room.roomName}" deletion Pending Changes mein add ho gaya.`)
  }

  function handleRemovePending(draft) {
    setPendingRooms((current) =>
      current.filter((item) => item.draftKey !== draft.draftKey),
    )

    if (editingDraftKey === draft.draftKey) {
      resetForm()
    }

    setSuccess('Pending room change remove kar diya gaya.')
  }

  async function handleConfirmChanges() {
    if (pendingRooms.length === 0 && deletedRoomIds.length === 0) {
      return
    }

    if (!token || token === 'undefined') {
      setError('Login session nahi mila. Dobara login karein.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      houseId: house.id,
      rooms: pendingRooms.map((room) => ({
        id: room.id,
        roomName: room.roomName,
        roomType: room.roomType,
        area: room.area,
      })),
      deletedRoomIds,
    }

    try {
      const response = await fetch('/api/rooms/confirm', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let message = ''

        try {
          const body = await response.json()
          message = body.message || body.error || ''
        } catch {
          // Error response JSON format mein nahi tha.
        }

        throw new Error(
          message || `Room changes confirm nahi hue (${response.status}).`,
        )
      }

      setPendingRooms([])
      setDeletedRoomIds([])
      resetForm()

      await loadRooms()

      try {
        if (onRoomsSaved) {
          await onRoomsSaved()
        }

        setSuccess('Room changes successfully house mein save ho gaye.')
      } catch {
        setSuccess(
          'Rooms save ho gaye, lekin House Details refresh nahi ho paya. Refresh karke dobara check karein.',
        )
      }
    } catch (err) {
      setError(err.message || 'Room changes save nahi ho sake.')
    } finally {
      setSaving(false)
    }
  }

  function discardPendingChanges() {
    setPendingRooms([])
    setDeletedRoomIds([])
    resetForm()
    setError('')
    setSuccess('Pending changes discard kar diye gaye.')
  }

  const formatDate = (date) => {
    if (!date) return '—'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '—'

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const hasPendingChanges =
    pendingRooms.length > 0 || deletedRoomIds.length > 0

  return (
    <section className="sp-room-section">
      <div className="sp-section-heading">
        <div>
          <span className="sp-section-kicker">ROOM MANAGEMENT</span>
          <h2>Rooms in {house.houseName || 'this house'}</h2>
          <p>Add, review and manage individual rooms.</p>
        </div>

        <div className="sp-form-number">03</div>
      </div>

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

      <form className="sp-create-form sp-room-form" onSubmit={handleSubmit}>
        <label className="sp-field">
          <span>Room name</span>
          <input
            type="text"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="e.g. Master Bedroom"
            maxLength={100}
            required
          />
          <small>Enter a name for this room.</small>
        </label>

        <label className="sp-field">
          <span>Room type</span>
          <select
            value={roomType}
            onChange={(event) => setRoomType(event.target.value)}
            required
          >
            <option value="Bedroom">Bedroom</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Living Room">Living Room</option>
            <option value="Dining Room">Dining Room</option>
            <option value="Study Room">Study Room</option>
            <option value="Balcony">Balcony</option>
            <option value="Storage Room">Storage Room</option>
            <option value="Other">Other</option>
          </select>
          <small>Select the room's intended use.</small>
        </label>

        <label className="sp-field">
          <span>Area</span>
          <input
            type="number"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            placeholder="e.g. 150"
            min="0.01"
            step="0.01"
            required
          />
          <small>Enter the area in your chosen unit.</small>
        </label>

        <div className="sp-form-footer">
          <p>
            <span>✓</span>
            This room will be linked to house #{house.id}.
          </p>

          <div className="sp-room-form-actions">
            {editingDraftKey !== null && (
              <button
                type="button"
                className="sb-refresh-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="sb-primary-button sp-submit-button"
              disabled={saving}
            >
              {editingDraftKey !== null
                ? 'Add changes to pending'
                : '+ Add room'}
            </button>
          </div>
        </div>
      </form>

      <div className="sp-room-list-heading">
        <div>
          <h3>Saved Room List</h3>
          <p className="sb-muted">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} currently saved
          </p>
        </div>

        <button
          type="button"
          className="sb-refresh-button"
          onClick={loadRooms}
          disabled={loading || saving}
        >
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </div>

      {loading && (
        <div className="sp-state-card sp-room-state">
          <div className="sp-spinner" />
          <h3>Loading rooms</h3>
          <p>Retrieving rooms for this house...</p>
        </div>
      )}

      {!loading && rooms.length === 0 && !error && (
        <div className="sp-state-card sp-room-state">
          <div className="sp-empty-icon">▦</div>
          <h3>No rooms added yet</h3>
          <p>Add the first room using the form above.</p>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div className="sp-room-grid">
          {rooms.map((room) => {
            const markedForDeletion = deletedRoomIds.includes(room.id)
            const hasPendingEdit = pendingRooms.some(
              (draft) => draft.id === room.id,
            )

            return (
              <article className="sp-room-card" key={room.id}>
                <div className="sp-room-card-top">
                  <div className="sp-project-icon">▦</div>
                  <span className="sp-project-id">ROOM #{room.id}</span>
                </div>

                <h3>{room.roomName}</h3>

                <span className="sp-room-type">
                  {room.roomType || 'Other'}
                </span>

                <div className="sp-room-area">
                  <span>AREA</span>
                  <strong>{room.area ?? '—'}</strong>
                </div>

                <div className="sp-project-meta">
                  <span>Created on</span>
                  <strong>{formatDate(room.createdAt)}</strong>
                </div>

                {markedForDeletion && (
                  <p className="sb-muted">
                    Marked for deletion — not yet removed
                  </p>
                )}

                {hasPendingEdit && (
                  <p className="sb-muted">
                    An edit is waiting for confirmation
                  </p>
                )}

                <div className="sp-room-actions">
                  <button
                    type="button"
                    className="sp-room-edit-button"
                    onClick={() => handleEdit(room)}
                    disabled={saving || markedForDeletion}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="sp-room-delete-button"
                    onClick={() => handleDeleteSavedRoom(room)}
                    disabled={saving}
                  >
                    {markedForDeletion ? 'Undo delete' : 'Delete'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="sp-room-list-heading">
        <div>
          <h3>Pending Changes</h3>
          <p className="sb-muted">
            {pendingRooms.length + deletedRoomIds.length} change(s) waiting
            for confirmation
          </p>
        </div>
      </div>

      {!hasPendingChanges ? (
        <div className="sp-state-card sp-room-state">
          <h3>No pending changes</h3>
          <p>Your saved rooms will remain unchanged until you make a change.</p>
        </div>
      ) : (
        <>
          {pendingRooms.length > 0 && (
            <div className="sp-room-grid">
              {pendingRooms.map((draft) => (
                <article className="sp-room-card" key={draft.draftKey}>
                  <div className="sp-room-card-top">
                    <div className="sp-project-icon">▦</div>
                    <span className="sp-project-id">
                      {draft.isNew ? 'NEW ROOM' : `ROOM #${draft.id} · EDIT`}
                    </span>
                  </div>

                  <h3>{draft.roomName}</h3>

                  <span className="sp-room-type">{draft.roomType}</span>

                  <div className="sp-room-area">
                    <span>AREA</span>
                    <strong>{draft.area}</strong>
                  </div>

                  <p className="sb-muted">
                    {draft.isNew
                      ? 'New room — waiting to be added'
                      : 'Edited room — waiting to be updated'}
                  </p>

                  <div className="sp-room-actions">
                    <button
                      type="button"
                      className="sp-room-edit-button"
                      onClick={() => handleEditPending(draft)}
                      disabled={saving}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="sp-room-delete-button"
                      onClick={() => handleRemovePending(draft)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {deletedRoomIds.length > 0 && (
            <div className="sp-state-card sp-room-state">
              <h3>Rooms marked for deletion</h3>
              {deletedRoomIds.map((id) => {
                const room = rooms.find((item) => item.id === id)

                return (
                  <p key={id}>
                    {room?.roomName || `Room #${id}`} — waiting for confirmation
                  </p>
                )
              })}
            </div>
          )}

          <div className="sp-form-footer">
            <p>
              Review your pending changes before adding them to the house.
            </p>

            <div className="sp-room-form-actions">
              <button
                type="button"
                className="sb-refresh-button"
                onClick={discardPendingChanges}
                disabled={saving}
              >
                Discard changes
              </button>

              <button
                type="button"
                className="sb-primary-button sp-submit-button"
                onClick={handleConfirmChanges}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Add to House'}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default RoomManagement