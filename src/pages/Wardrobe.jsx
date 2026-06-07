import { useState, useEffect } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

const CATEGORIES = ['SHIRT','PANTS','SOCKS','BRIEFS','RING','BELT','PHONE_CASE','SHOES','OTHER']

export default function Wardrobe() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('SHIRT')
  const [brand, setBrand] = useState('')
  const [notes, setNotes] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    const res = await api.get('/wardrobe')
    setItems(res.data)
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name) return
    await api.post('/wardrobe', { name, category, brand, notes })
    setName(''); setBrand(''); setNotes('')
    load()
  }

  const remove = (id) => {
    setConfirm({
      message: 'Remove this item from your wardrobe? It will go to the bin.',
      onConfirm: async () => {
        await api.delete(`/wardrobe/${id}`)
        setConfirm(null)
        load()
      }
    })
  }

  const filtered = filter === 'ALL' ? items : items.filter(i => i.category === filter)

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Wardrobe</h2>

      <div className="card" style={{ marginBottom: '28px' }}>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Add new item</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Black slim tee" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Brand</label>
            <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Uniqlo" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <button className="btn-primary" onClick={add}>Add to wardrobe</button>
      </div>

      <div className="row" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
        {['ALL', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              padding: '6px 12px', fontSize: '12px', borderRadius: '4px',
              background: filter === c ? '#e0e0e0' : 'transparent',
              color: filter === c ? '#0a0a0a' : '#666',
              border: '1px solid #333'
            }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.map(item => (
          <div key={item.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="tag">{item.category}</span>
              <button className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => remove(item.id)}>Remove</button>
            </div>
            <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</p>
            {item.brand && <p style={{ color: '#666', fontSize: '13px' }}>{item.brand}</p>}
            {item.notes && <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>{item.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}