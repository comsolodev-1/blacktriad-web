import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Wardrobe from './pages/Wardrobe'
import Outfits from './pages/Outfits'
import WearLog from './pages/Wearlog'
import Bin from './pages/Bin'
import Account from './pages/Accounts'
import Lookbook from './pages/LookBook'
import Navbar from './components/Navbar'
import Admin from './pages/Admin'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function Layout({ children }) {
  return <><Navbar />{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout><Wardrobe /></Layout></PrivateRoute>} />
      <Route path="/outfits" element={<PrivateRoute><Layout><Outfits /></Layout></PrivateRoute>} />
      <Route path="/wearlog" element={<PrivateRoute><Layout><WearLog /></Layout></PrivateRoute>} />
      <Route path="/lookbook" element={<PrivateRoute><Layout><Lookbook /></Layout></PrivateRoute>} />
      <Route path="/bin" element={<PrivateRoute><Layout><Bin /></Layout></PrivateRoute>} />
      <Route path="/account" element={<PrivateRoute><Layout><Account /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Layout><Admin /></Layout></PrivateRoute>} />
    </Routes>
  )
}