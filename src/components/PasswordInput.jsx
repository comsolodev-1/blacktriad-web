import { useState } from 'react'

export default function PasswordInput({ value, onChange, placeholder = '••••••••', onKeyDown }) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ paddingRight: '48px' }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute', right: '1px', top: '1px',
          bottom: '1px', width: '42px',
          background: '#1a1a1a', border: 'none',
          borderLeft: '1px solid #333',
          borderRadius: '0 5px 5px 0',
          color: show ? '#e0e0e0' : '#555',
          cursor: 'pointer', fontSize: '11px',
          letterSpacing: '0.5px', fontWeight: '500',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {show ? 'HIDE' : 'SHOW'}
      </button>
    </div>
  )
}