import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

const ROLES = ['USER', 'MODERATOR', 'ADMIN']

export default function Admin() {
  const { userRole, userEmail } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [confirm, setConfirm] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      navigate('/')
      return
    }
    load()
  }, [])

  const load = async () => {
    const res = await api.get('/users')
    setUsers(res.data)
  }

  const notify = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const changeRole = (userId, currentRole, userEmailTarget) => {
    if (userEmailTarget === userEmail) {
      setConfirm({
        message: 'You cannot change your own role.',
        onConfirm: () => setConfirm(null)
      })
      return
    }
    const next = ROLES[(ROLES.indexOf(currentRole) + 1) % ROLES.length]
    setConfirm({
      message: `Change this user's role to ${next}?`,
      onConfirm: async () => {
        await api.patch(`/users/${userId}/role`, { role: next })
        setConfirm(null)
        notify(`Role updated to ${next}`)
        load()
      }
    })
  }

  const toggleActive = (user) => {
    if (user.email === userEmail) {
      setMessage('')
      setConfirm({
        message: 'You cannot deactivate your own account.',
        onConfirm: () => setConfirm(null)
      })
      return
    }
    setConfirm({
      message: user.active
        ? `Deactivate ${user.email}?`
        : `Reactivate ${user.email}?`,
      onConfirm: async () => {
        if (user.active) {
          await api.delete(`/users/${user.id}`)
        } else {
          await api.patch(`/users/${user.id}/activate`)
        }
        setConfirm(null)
        load()
      }
    })
  }

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Admin Panel</h2>

      {message && (
        <div style={{
          background: '#0a1a0a', border: '1px solid #1a4a1a', borderRadius: '6px',
          padding: '10px 14px', marginBottom: '16px', color: '#70c070', fontSize: '13px'
        }}>
          {message}
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>Total accounts</p>
        <p style={{ fontSize: '28px', fontWeight: '700' }}>{users.length}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {users.map(user => (
          <div key={user.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{user.email}</p>
                <div className="row" style={{ gap: '8px' }}>
                  <span className="tag">{user.role}</span>
                  <span className="tag" style={{
                    color: user.active ? '#70c070' : '#e07070',
                    borderColor: user.active ? '#1a4a1a' : '#5a2020'
                  }}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="row" style={{ gap: '8px' }}>
                <button className="btn-ghost" style={{ fontSize: '12px', padding: '4px 12px' }}
                  onClick={() => changeRole(user.id, user.role, user.email)}>
                  Change role
                </button>
                <button
                  className={user.active ? 'btn-danger' : 'btn-ghost'}
                  style={{ fontSize: '12px', padding: '4px 12px' }}
                  onClick={() => toggleActive(user)}>
                  {user.active ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}