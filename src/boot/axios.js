import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

let isRefreshing = false
let subscribers = []

const onRefreshed = (newToken) => {
  subscribers.forEach(callback => callback(newToken))
  subscribers = []
}

const subscribeTokenRefresh = (callback) => {
  subscribers.push(callback)
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken })

          const newToken = response.data.token
          localStorage.setItem('token', newToken)

          onRefreshed(newToken)
        } catch (refreshError) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return new Promise(resolve => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
