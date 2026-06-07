import { useState, useEffect } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

export default function Bin() {
  const [wardrobeItems, setWardrobeItems] = useState([])
  const [lookbookEntries, setLookbookEntries] = useState([])
  const [deletedOutfits, setDeletedOutfits] = useState([])
  const [deletedLogs, setDeletedLogs] = useState([])
  const [tab, setTab] = useState('wardrobe')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    const [w, l, o, wl] = await Promise.all([
      api.get('/wardrobe/bin'),
      api.get('/lookbook/bin'),
      api.get('/outfits/bin'),
      api.get('/wearlogs/bin')
    ])
    setWardrobeItems(w.data)
    setLookbookEntries(l.data)
    setDeletedOutfits(o.data)
    setDeletedLogs(wl.data)
  }

  useEffect(() => { load() }, [])

  const confirmAction = (message, action) => {
    setConfirm({ message, onConfirm: async () => { await action(); setConfirm(null); load() } })
  }

  const tabStyle = (t) => ({
    padding: '8px 20px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer',
    background: tab === t ? '#e0e0e0' : 'transparent',
    color: tab === t ? '#0a0a0a' : '#666',
    border: '1px solid #333'
  })

  const emptyMsg = (label) => (
    <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#444' }}>
      {label} bin is empty
    </div>
  )

  const count = (arr) => arr.length > 0 ? ` (${arr.length})` : ''

  return (
    <div className="page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h2 className="page-title">Bin</h2>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>
        Removed items. Restore or delete permanently.
      </p>

      <div className="row" style={{ marginBottom: '24px', gap: '8px', flexWrap: 'wrap' }}>
        <button style={tabStyle('wardrobe')} onClick={() => setTab('wardrobe')}>Wardrobe{count(wardrobeItems)}</button>
        <button style={tabStyle('outfits')} onClick={() => setTab('outfits')}>Outfits{count(deletedOutfits)}</button>
        <button style={tabStyle('wearlog')} onClick={() => setTab('wearlog')}>Wear Log{count(deletedLogs)}</button>
        <button style={tabStyle('lookbook')} onClick={() => setTab('lookbook')}>Lookbook{count(lookbookEntries)}</button>
      </div>

      {tab === 'wardrobe' && (
        wardrobeItems.length === 0 ? emptyMsg('Wardrobe') : (
          <div className="grid">
            {wardrobeItems.map(item => (
              <div key={item.id} className="card">
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="tag">{item.category}</span>
                </div>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</p>
                {item.brand && <p style={{ color: '#666', fontSize: '13px' }}>{item.brand}</p>}
                <div className="row" style={{ marginTop: '12px', gap: '8px' }}>
                  <button className="btn-ghost" style={{ fontSize: '12px', padding: '4px 12px' }}
                    onClick={() => confirmAction('Restore this item to your wardrobe?', () => api.patch(`/wardrobe/${item.id}/restore`))}>
                    Restore
                  </button>
                  <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 12px' }}
                    onClick={() => confirmAction('Permanently delete this item? Cannot be undone.', () => api.delete(`/wardrobe/${item.id}/permanent`))}>
                    Delete forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'outfits' && (
        deletedOutfits.length === 0 ? emptyMsg('Outfits') : (
          <div className="grid">
            {deletedOutfits.map(outfit => (
              <div key={outfit.id} className="card">
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>{outfit.name}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {outfit.items?.map((oi, i) => (
                    <span key={i} className="tag">{oi.wardrobeItem?.name}</span>
                  ))}
                </div>
                <div className="row" style={{ gap: '8px' }}>
                  <button className="btn-ghost" style={{ fontSize: '12px', padding: '4px 12px' }}
                    onClick={() => confirmAction('Restore this outfit combo?', () => api.patch(`/outfits/${outfit.id}/restore`))}>
                    Restore
                  </button>
                  <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 12px' }}
                    onClick={() => confirmAction('Permanently delete this outfit? Cannot be undone.', () => api.delete(`/outfits/${outfit.id}/permanent`))}>
                    Delete forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'wearlog' && (
        deletedLogs.length === 0 ? emptyMsg('Wear Log') : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deletedLogs.map(log => (
              <div key={log.id} className="card">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>{log.outfitName ?? 'Outfit'}</p>
                    <p style={{ color: '#555', fontSize: '13px' }}>{log.wornOn}</p>
                    {log.notes && <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>{log.notes}</p>}
                  </div>
                  <div className="row" style={{ gap: '8px' }}>
                    <button className="btn-ghost" style={{ fontSize: '12px', padding: '4px 10px' }}
                      onClick={() => confirmAction('Restore this wear log entry?', () => api.patch(`/wearlogs/${log.id}/restore`))}>
                      Restore
                    </button>
                    <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 10px' }}
                      onClick={() => confirmAction('Permanently delete this entry? Cannot be undone.', () => api.delete(`/wearlogs/${log.id}/permanent`))}>
                      Delete forever
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'lookbook' && (
        lookbookEntries.length === 0 ? emptyMsg('Lookbook') : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {lookbookEntries.map(entry => (
              <div key={entry.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {entry.photoPath ? (
                  <img src={`http://localhost:8080${entry.photoPath}`} alt="look"
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '180px', background: '#1a1a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#333', fontSize: '13px' }}>No photo</div>
                )}
                <div style={{ padding: '14px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{entry.outfitName}</p>
                  <p style={{ color: '#555', fontSize: '12px', marginBottom: '8px' }}>{entry.wornOn}</p>
                  {entry.notes && <p style={{ color: '#aaa', fontSize: '13px' }}>{entry.notes}</p>}
                  <div className="row" style={{ marginTop: '12px', gap: '8px' }}>
                    <button className="btn-ghost" style={{ fontSize: '12px', padding: '4px 12px' }}
                      onClick={() => confirmAction('Restore this lookbook entry?', () => api.patch(`/lookbook/${entry.id}/restore`))}>
                      Restore
                    </button>
                    <button className="btn-danger" style={{ fontSize: '12px', padding: '4px 12px' }}
                      onClick={() => confirmAction('Permanently delete this entry? Cannot be undone.', () => api.delete(`/lookbook/${entry.id}/permanent`))}>
                      Delete forever
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}