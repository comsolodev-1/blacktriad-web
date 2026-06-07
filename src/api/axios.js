import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const res = await axios.post(
            'http://localhost:8080/api/v1/auth/refresh',
            { refreshToken }
          )
          const data = res.data
          localStorage.setItem('token', data.token)
          localStorage.setItem('refreshToken', data.refreshToken)
          localStorage.setItem('userId', String(data.userId))
          localStorage.setItem('userEmail', data.email)
          localStorage.setItem('userRole', data.role)
          original.headers.Authorization = `Bearer ${data.token}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api  