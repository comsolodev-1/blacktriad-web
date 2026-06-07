import { useState, useEffect } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

export default function Outfits() {
  const [outfits, setOutfits] = useState([])
  const [wardrobe, setWardrobe] = useState([])
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([])
  const [suggested, setSuggested] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    const [o, w] = await Promise.all([api.get('/outfits'), api.get('/wardrobe')])
    setOutfits(o.data)
    setWardrobe(w.data)
  }

  useEffect(() => { load() }, [])

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const create = async () => {
    if (!name.trim()) return setError('Combo name cannot be empty')
    if (selected.length === 0) return setError('Select at least one item')
    try {
      await api.post('/outfits', { name, wardrobeItemIds: selected })
      setName(''); setSelected([]); setError('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create combo')
    }
  }

  const toggleFav = async (id) => {
    await api.patch(`/outfits/${id}/favorite`)
    load()
  }

  const remove = (id) => {
    setConfirm({
      message: 'Delete this outfit combo? You can restore it from the Bin.',
      onConfirm: async () => {
        await api.delete(`/outfits/${id}`)
        setConfirm(null)
        load()
      }
    })
  }

  const suggest = async () => {
    const res = await api.get('/outfits/suggest')
    setSuggested(res.data)
  }

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Outfits</h2>

      <div className="card" style={{ marginBottom: '28px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Create combo</p>

        {error && (
          <div style={{
            background: '#1a0a0a', border: '1px solid #5a2020', borderRadius: '6px',
            padding: '10px 14px', marginBottom: '16px', color: '#e07070', fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Combo name</label>
          <input value={name} onChange={e => { setName(e.target.value); setError('') }}
            placeholder="Daily minimal" />
        </div>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>
          Select items <span style={{ color: '#555', fontSize: '11px' }}>(one per category)</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {wardrobe.map(item => (
            <button key={item.id} onClick={() => { toggleSelect(item.id); setError('') }}
              style={{
                padding: '6px 12px', fontSize: '12px', borderRadius: '4px',
                background: selected.includes(item.id) ? '#e0e0e0' : 'transparent',
                color: selected.includes(item.id) ? '#0a0a0a' : '#666',
                border: '1px solid #333'
              }}>
              {item.name} <span style={{ fontSize: '10px', opacity: 0.6 }}>({item.category})</span>
            </button>
          ))}
        </div>
        <div className="row">
          <button className="btn-primary" onClick={create}>Save combo</button>
          <button className="btn-ghost" onClick={suggest}>Suggest combo</button>
        </div>
      </div>

      {suggested && (
        <div className="card" style={{ marginBottom: '28px', borderColor: '#333' }}>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Suggested combo</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggested.items.map((oi, i) => (
              <span key={i} className="tag">{oi.wardrobeItem?.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid">
        {outfits.map(outfit => (
          <div key={outfit.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontWeight: '600' }}>{outfit.name}</p>
              <div className="row" style={{ gap: '6px' }}>
                <button onClick={() => toggleFav(outfit.id)}
                  style={{
                    padding: '4px 10px', fontSize: '12px', borderRadius: '4px',
                    background: outfit.favorite ? '#1a1a0a' : 'transparent',
                    color: outfit.favorite ? '#d4c060' : '#555',
                    border: '1px solid #333'
                  }}>
                  {outfit.favorite ? '★ Fav' : '☆'}
                </button>
                <button className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => remove(outfit.id)}>Del</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {outfit.items.map((oi, i) => (
                <span key={i} className="tag">{oi.wardrobeItem?.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}