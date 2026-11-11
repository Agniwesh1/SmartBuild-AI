import { useState } from 'react'
import { changeCredentials } from './api/authApi'

function AccountSettings({ token, username, onBack, onCredentialsChanged }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState(username || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword) {
      setError('Please enter your current password.')
      return
    }

    if (!newUsername.trim() && !newPassword) {
      setError('Enter a new username, a new password, or both.')
      return
    }

    if (newPassword && newPassword.length < 8) {
      setError('Your new password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('The new password and confirmation do not match.')
      return
    }

    setLoading(true)

    try {
      const message = await changeCredentials(
        token,
        currentPassword,
        newUsername.trim(),
        newPassword,
      )

      setSuccess(message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Credentials changed: return to login with the new credentials.
      window.setTimeout(() => {
        onCredentialsChanged()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Could not update your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="sb-settings-page">
      <section className="sb-settings-card">
        <button
          type="button"
          className="sb-settings-back"
          onClick={onBack}
          disabled={loading}
        >
          ← Back to dashboard
        </button>

        <span className="sb-settings-kicker">ACCOUNT SECURITY</span>

        <h1>Account Settings</h1>

        <p className="sb-settings-description">
          Update your username or password whenever you need to.
        </p>

        <form onSubmit={handleSubmit} className="sb-settings-form">
          <label>
            Current username

            <input
              type="text"
              value={username}
              readOnly
              aria-label="Current username"
            />
          </label>

          <label>
            Current password

            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter your current password"
              autoComplete="current-password"
              required
            />
          </label>

          <label>
            New username

            <input
              type="text"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
              placeholder="Enter your new username"
              autoComplete="username"
            />
          </label>

          <label>
            New password

            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
            />
          </label>

          <label>
            Confirm new password

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
            />
          </label>

          {error && (
            <p className="sb-settings-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="sb-settings-success" role="status">
              {success}
              {' '}Redirecting to login...
            </p>
          )}

          <button
            type="submit"
            className="sb-primary-button sb-settings-submit"
            disabled={loading}
          >
            {loading ? 'Updating credentials...' : 'Save changes'}
          </button>
        </form>

        <p className="sb-settings-note">
          Your current password is required to save changes. Leave the new
          password blank if you only want to change your username.
        </p>
      </section>
    </main>
  )
}

export default AccountSettings