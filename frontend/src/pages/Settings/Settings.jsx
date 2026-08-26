import { useEffect, useState } from 'react'

import { buildApiUrl } from '../../services/api'

const initialForm = {
  fullName: '',
  email: '',
  notifications: true,
}

function Settings() {
  const [form, setForm] = useState(initialForm)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setError('You must be logged in to view settings.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(buildApiUrl('/auth/me'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to load profile')
        }

        setForm((current) => ({
          ...current,
          fullName: data.fullName ?? '',
          email: data.email ?? '',
        }))
      } catch (loadError) {
        setError(loadError.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSaved(false)
    setMessage('')
    setError('')
  }

  const handleToggleNotifications = () => {
    setForm((current) => ({ ...current, notifications: !current.notifications }))
    setSaved(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      setError('You must be logged in to update settings.')
      setMessage('')
      setSaved(false)
      return
    }

    try {
      const response = await fetch(buildApiUrl('/auth/me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update profile')
      }

      setForm((current) => ({
        ...current,
        fullName: data.fullName ?? current.fullName,
        email: data.email ?? current.email,
      }))
      setMessage(data.message || 'Changes saved')
      setError('')
      setSaved(true)
    } catch (saveError) {
      setError(saveError.message || 'Failed to update profile')
      setMessage('')
      setSaved(false)
    }
  }

  return (
    <div className="settings-page">
      <section className="settings-page__hero">
        <div>
          <p className="settings-page__eyebrow">Account Controls</p>
          <h1 className="settings-page__title">System Settings</h1>
          <p className="settings-page__subtitle">Manage your account preferences and configurations.</p>
        </div>
        {/* <div className="settings-page__hero-badge">Profile synchronized via auth token</div> */}
      </section>

      {error && <div className="settings-notice settings-notice--error">{error}</div>}
      {message && <div className="settings-notice settings-notice--success">{message}</div>}

      <div className="settings-panel">
        <section className="settings-section settings-section--first">
          <div className="settings-section__header">
            <h2>Profile Information</h2>
            <span className="status-badge status-badge--live">Live</span>
          </div>

          <div className="settings-fields">
            <label className="settings-field" htmlFor="fullName">
              <span>Full Name</span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleFieldChange}
                disabled={loading}
              />
            </label>

            <label className="settings-field" htmlFor="email">
              <span>Email Address</span>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                readOnly
              />
            </label>
          </div>

          <button
            type="button"
            className="settings-button settings-button--primary"
            onClick={handleSave}
            disabled={loading}
          >
            Update Profile
          </button>
        </section>

        <section className="settings-section">
          {/* <div className="settings-section__header">
            <h2>Preferences</h2>
          </div> */}

          <div className="settings-fields settings-fields--compact">
            <div className="settings-toggle-row">
              {/* <span>Notifications</span>
              <button
                type="button"
                className={`settings-toggle ${form.notifications ? 'settings-toggle--on' : ''}`}
                onClick={handleToggleNotifications}
                aria-label="Toggle notifications"
                aria-pressed={form.notifications}
              >
                <span className="settings-toggle__thumb" />
              </button> */}
            </div>
          </div>
        </section>

        {/* <section className="settings-section">
          <div className="settings-section__header">
            <h2>Security</h2>
            <span className="status-badge status-badge--connected">Connected</span>
          </div>

          <button type="button" className="settings-button settings-button--secondary">
            Change Password
          </button>
        </section> */}

        <div className="settings-footer">
          {/* <button
            type="button"
            className="settings-button settings-button--save"
            onClick={handleSave}
            disabled={loading}
          >
            Save Changes
          </button> */}
          {saved && !message && <span className="settings-notice settings-notice--success">Changes saved</span>}
        </div>
      </div>
    </div>
  )
}

export default Settings