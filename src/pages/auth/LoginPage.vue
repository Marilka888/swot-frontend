<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 350px">
      <q-card-section>
        <div class="text-h6">Вход</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Логин" filled />
        <q-input v-model="password" label="Пароль" filled type="password" class="q-mt-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Войти" color="primary" @click="login" />
      </q-card-actions>
    </q-card>

    <q-toast />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const { data } = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    router.push('/session')
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Неверный логин или пароль' })
  }
}
</script>
