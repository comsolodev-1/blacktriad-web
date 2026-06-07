import { useState, useEffect } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

export default function WearLog() {
  const [logs, setLogs] = useState([])
  const [outfits, setOutfits] = useState([])
  const [outfitId, setOutfitId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    const [l, o] = await Promise.all([api.get('/wearlogs'), api.get('/outfits')])
    setLogs(l.data)
    setOutfits(o.data)
    if (o.data.length > 0 && !outfitId) setOutfitId(String(o.data[0].id))
  }

  useEffect(() => { load() }, [])

  const log = async () => {
    if (!outfitId) return setError('Please select an outfit')
    if (!notes.trim()) return setError('Notes are required')
    try {
      await api.post('/wearlogs', { outfitId, notes })
      setNotes('')
      setError('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log outfit')
    }
  }

  const remove = (id) => {
    setConfirm({
      message: 'Remove this entry? You can restore it from the Bin.',
      onConfirm: async () => {
        await api.delete(`/wearlogs/${id}`)
        setConfirm(null)
        load()
      }
    })
  }

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Wear Log</h2>

      <div className="card" style={{ marginBottom: '28px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Log today's outfit</p>

        {error && (
          <div style={{
            background: '#1a0a0a', border: '1px solid #5a2020', borderRadius: '6px',
            padding: '10px 14px', marginBottom: '16px', color: '#e07070', fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Outfit</label>
            <select value={outfitId} onChange={e => setOutfitId(e.target.value)}>
              {outfits.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Notes <span style={{ color: '#e07070' }}>*</span></label>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Where did you wear this?" />
          </div>
        </div>
        <button className="btn-primary" onClick={log}>Log outfit</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {logs.map(log => (
          <div key={log.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{log.outfitName ?? 'Outfit'}</p>
                <p style={{ color: '#555', fontSize: '13px' }}>{log.wornOn}</p>
                {log.notes && <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>{log.notes}</p>}
              </div>
              <button className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => remove(log.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}