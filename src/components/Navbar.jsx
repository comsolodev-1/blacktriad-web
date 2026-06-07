import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { userRole } = useAuth()

  return (
    <nav style={{
      background: '#111',
      borderBottom: '1px solid #222',
      padding: '14px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ color: '#fff', fontWeight: '700', fontSize: '18px', letterSpacing: '2px' }}>
        BLACKTRIAD
      </span>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px' }}>Wardrobe</Link>
        <Link to="/outfits" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px' }}>Outfits</Link>
        <Link to="/wearlog" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px' }}>Wear Log</Link>
        <Link to="/lookbook" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px' }}>Lookbook</Link>
        <Link to="/bin" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px' }}>Bin</Link>
        <Link to="/account" style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px' }}>Account</Link>
        {(userRole === 'ADMIN' || userRole === 'MODERATOR') && (
          <Link to="/admin" style={{ color: '#d4c060', textDecoration: 'none', fontSize: '13px' }}>Admin</Link>
        )}
      </div>
    </nav>
  )
}