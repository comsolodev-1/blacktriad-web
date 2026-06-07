import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ConfirmModal'
import PasswordInput from '../components/PasswordInput'
import api from '../api/axios'

export default function Account() {
  const { userId, userEmail, userRole, logout, login, token } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(null)

  const notify = (msg, isError = false) => {
    if (isError) { setError(msg); setMessage('') }
    else { setMessage(msg); setError('') }
    setTimeout(() => { setMessage(''); setError('') }, 3000)
  }

  const updateEmail = () => {
    if (!email) return notify('Email cannot be empty', true)
    if (!email.includes('@')) return notify('Enter a valid email', true)
    setConfirm({
      message: `Update your email to "${email}"?`,
      onConfirm: async () => {
        try {
          await api.patch(`/users/${userId}/email`, { email })
          login({
            email,
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId'),
            role: localStorage.getItem('userRole')
          })
          notify('Email updated successfully')
          setEmail('')
        } catch { notify('Failed to update email', true) }
        setConfirm(null)
      }
    })
  }

  const validatePassword = (pw) =>
    pw.length >= 8 && pw.length <= 16 &&
    /[A-Z]/.test(pw) && /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)

  const updatePassword = () => {
    if (!password) return notify('Password cannot be empty', true)
    if (!validatePassword(password)) return notify(
      'Password must be 8–16 chars with uppercase, lowercase, number and special character', true
    )
    if (password !== confirmPassword) return notify('Passwords do not match', true)
    setConfirm({
      message: 'Update your password?',
      onConfirm: async () => {
        try {
          await api.patch(`/users/${userId}/password`, { password })
          notify('Password updated successfully')
          setPassword(''); setConfirmPassword('')
        } catch { notify('Failed to update password', true) }
        setConfirm(null)
      }
    })
  }

  const handleLogout = () => {
    setConfirm({
      message: 'Are you sure you want to logout?',
      onConfirm: () => { logout(); navigate('/login') }
    })
  }

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Account</h2>

      {message && (
        <div style={{
          background: '#0a1a0a', border: '1px solid #1a4a1a', borderRadius: '6px',
          padding: '10px 14px', marginBottom: '16px', color: '#70c070', fontSize: '13px'
        }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{
          background: '#1a0a0a', border: '1px solid #5a2020', borderRadius: '6px',
          padding: '10px 14px', marginBottom: '16px', color: '#e07070', fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: '16px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>Logged in as</p>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>{userEmail}</p>
        <span className="tag">{userRole}</span>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Change email</p>
        <div className="form-group">
          <label>New email</label>
          <input type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && updateEmail()}
            placeholder="new@email.com" />
        </div>
        <button className="btn-primary" onClick={updateEmail}>Update email</button>
      </div>

      <div className="card">
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Change password</p>
        <div className="form-group">
          <label>New password</label>
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirm new password</label>
          <PasswordInput value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        {password && confirmPassword && (
          <p style={{
            fontSize: '12px', marginBottom: '12px',
            color: password === confirmPassword ? '#70c070' : '#e07070'
          }}>
            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}
        <button className="btn-primary" onClick={updatePassword}>Update password</button>
      </div>
      <div className="card" style={{ marginTop: '16px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Session</p>
        <button className="btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </div >
  )
}
