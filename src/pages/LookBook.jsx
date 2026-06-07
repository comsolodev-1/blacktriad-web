import { useState, useEffect } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

export default function Lookbook() {
  const [entries, setEntries] = useState([])
  const [outfits, setOutfits] = useState([])
  const [outfitId, setOutfitId] = useState('')
  const [notes, setNotes] = useState('')
  const [details, setDetails] = useState('')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [error, setError] = useState("")

  const load = async () => {
    const [e, o] = await Promise.all([api.get('/lookbook'), api.get('/outfits')])
    setEntries(e.data)
    setOutfits(o.data)
    if (o.data.length > 0 && !outfitId) setOutfitId(String(o.data[0].id))
  }

  useEffect(() => { load() }, [])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    if (!outfitId) return

    try {
      const form = new FormData()
      form.append('outfitId', outfitId)
      if (notes) form.append('notes', notes)
      if (details) form.append('details', details)
      if (photo) form.append('photo', photo)

      await api.post('/lookbook', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setNotes('')
      setDetails('')
      setPhoto(null)
      setPreview(null)
      setError("") 

      load()
    } catch (err) {
      if (err.response?.status !== 400) {
        console.error(err)
      }

      setError(err.response?.data?.message)
    }
  }

  const remove = (id) => {
    setConfirm({
      message: 'Move this entry to the Lookbook bin?',
      onConfirm: async () => {
        await api.delete(`/lookbook/${id}`)
        setConfirm(null)
        load()
      }
    })
  }

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Lookbook</h2>

      <div className="card" style={{ marginBottom: '28px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Log a look</p>
        {error && (
          <div style={{
            background: "#3a1f1f",
            color: "#ff6b6b",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "12px",
            fontSize: "13px"
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
            <label>Short note</label>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Wore this to school" />
          </div>
        </div>
        <div className="form-group">
          <label>Details</label>
          <textarea value={details} onChange={e => setDetails(e.target.value)}
            placeholder="Add more details about this look, where you went, how it felt..."
            style={{
              background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0',
              padding: '10px 14px', borderRadius: '6px', width: '100%',
              fontSize: '14px', resize: 'vertical', minHeight: '80px'
            }} />
        </div>
        <div className="form-group">
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </div>
        {preview && (
          <img src={preview} alt="preview"
            style={{
              width: '100%', maxHeight: '300px', objectFit: 'cover',
              borderRadius: '8px', marginBottom: '16px'
            }} />
        )}
        <button className="btn-primary" onClick={save}>Save look</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {entries.map(entry => (
          <div key={entry.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {entry.photoPath ? (
              <img src={`http://localhost:8080${entry.photoPath}`} alt="look"
                style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            ) : (
              <div style={{
                height: '220px', background: '#1a1a1a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#333', fontSize: '13px'
              }}>No photo</div>
            )}
            <div style={{ padding: '14px' }}>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>{entry.outfitName}</p>
              <p style={{ color: '#555', fontSize: '12px', marginBottom: '8px' }}>{entry.wornOn}</p>
              {entry.notes && <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>{entry.notes}</p>}
              {entry.details && (
                <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.6', marginBottom: '8px' }}>
                  {entry.details}
                </p>
              )}
              <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 10px', marginTop: '4px' }}
                onClick={() => remove(entry.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}