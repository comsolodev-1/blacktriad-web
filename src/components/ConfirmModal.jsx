export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '380px', padding: '24px' }}>
        <p style={{ marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>{message}</p>
        <div className="row" style={{ justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}