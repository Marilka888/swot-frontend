import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'

export default function authGuard(to, from, next) {
  const token = LocalStorage.getItem('token')

  if (to.meta.public) {
    return next()
  }

  // if (!token) {
  //   return next({ path: '/login' })
  // }

  next()
}
