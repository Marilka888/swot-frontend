import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isPublic = to.meta.public || to.path === '/login'
  const token = localStorage.getItem('token')

  if (!isPublic && !token) {
    next('/login')
  } else {
    next()
  }
})

export default route(() => router)
