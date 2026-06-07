import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'))
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'))

  const login = (data) => {
    const newToken = data.token || localStorage.getItem('token')
    const newRefresh = data.refreshToken || localStorage.getItem('refreshToken')
    const newUserId = String(data.userId || localStorage.getItem('userId'))
    const newEmail = data.email
    const newRole = data.role || localStorage.getItem('userRole')

    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', newRefresh)
    localStorage.setItem('userId', newUserId)
    localStorage.setItem('userEmail', newEmail)
    localStorage.setItem('userRole', newRole)

    setToken(newToken)
    setUserId(newUserId)
    setUserEmail(newEmail)
    setUserRole(newRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    setToken(null)
    setUserId(null)
    setUserEmail(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, userId, userEmail, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}