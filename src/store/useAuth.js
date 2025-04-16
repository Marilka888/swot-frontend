import axios from 'axios'

export function useAuth() {
  const login = async (username, password) => {
    const { data } = await axios.post('/api/auth/login', { username, password })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    // Можно декодировать token для ролей, например через jwt-decode
    const payload = JSON.parse(atob(data.token.split('.')[1]))
    localStorage.setItem('roles', JSON.stringify(payload.roles || []))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('roles')
    delete axios.defaults.headers.common['Authorization']
  }

  const restore = () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }

  return { login, logout, restore }
}
