import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import api from '../api/axios'

const validateEmail = (email) => /^[^\s@]+@blacktriad\.com$/.test(email)
const validatePassword = (pw) =>
  pw.length >= 8 && pw.length <= 16 &&
  /[A-Z]/.test(pw) && /[a-z]/.test(pw) &&
  /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!validateEmail(email)) { setError('Invalid email or password'); return }
    if (!validatePassword(password)) { setError('Invalid email or password'); return }
    if (password !== confirm) { setError('Invalid email or password'); return }
    try {
      await api.post('/auth/register', { email, password })
      navigate('/login')
    } catch {
      setError('Invalid email or password')
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  const pwStrength = () => {
    if (!password) return null
    const checks = [
      password.length >= 8 && password.length <= 16,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ]
    const passed = checks.filter(Boolean).length
    if (passed <= 2) return { label: 'Weak', color: '#e07070' }
    if (passed <= 4) return { label: 'Medium', color: '#d4c060' }
    return { label: 'Strong', color: '#70c070' }
  }

  const strength = pwStrength()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', letterSpacing: '2px' }}>
          BLACKTRIAD
        </h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '28px' }}>Create your account</p>

        {error && (
          <div style={{ background: '#1a0a0a', border: '1px solid #5a2020', borderRadius: '6px',
            padding: '10px 14px', marginBottom: '16px', color: '#e07070', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey} placeholder="you@blacktriad.com" />
          <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
            Must be a @blacktriad.com address
          </p>
        </div>

        <div className="form-group">
          <label>Password</label>
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}/>
          {strength && (
            <p style={{ fontSize: '11px', color: strength.color, marginTop: '4px' }}>
              Strength: {strength.label} — 8–16 chars, upper, lower, number, special character
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Confirm password</label>
          <PasswordInput value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={handleKey}/>
        </div>

        {password && confirm && (
          <p style={{
            fontSize: '12px', marginBottom: '12px',
            color: password === confirm ? '#70c070' : '#e07070'
          }}>
            {password === confirm ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}

        <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleSubmit}>
          Create account
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#aaa', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}