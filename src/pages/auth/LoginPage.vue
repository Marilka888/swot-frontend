<template>
  <q-page class="flex flex-center">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6 text-center">Вход</div>
        <q-input v-model="username" label="Логин" filled />
        <q-input v-model="password" label="Пароль" type="password" filled class="q-mt-sm" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn label="Войти" color="primary" @click="login" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const username = ref('')
const password = ref('')

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push('/')
  }
})

const login = async () => {
  try {
    const response = await api.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    console.log(response.data.token)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('roles', response.data.roles)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    console.log(response.data.firstLogin)
    if (response.data.firstLogin) {
      router.push('/change-password');
      return;
    }
    router.push('/')
  } catch (err) {
    console.error('Ошибка входа:', err)
  }
}
</script>
