import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/PasswordInput'
import api from '../api/axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) { setError('Invalid email or password'); return }
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data)
      navigate('/')
    } catch {
      setError('Invalid email or password')
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', letterSpacing: '2px' }}>
          BLACKTRIAD
        </h1>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '28px' }}>Sign in to your wardrobe</p>

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
        </div>
        <div className="form-group">
          <label>Password</label>
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}/>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleSubmit}>
          Sign in
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#aaa', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}