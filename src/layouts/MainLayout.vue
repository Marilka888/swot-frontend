<template>
  <q-layout view="lHh Lpr lFf" style="font-family: 'Montserrat Alternates', serif; font-weight: 300; font-size: 20px">
    <q-header reveal elevated class="q-px-xl" style="background-color: #1f1fac">
      <div class="q-px-xl">
        <q-toolbar class="bg-8 text-white q-my-xs">
          <q-btn flat label="СЕССИИ" :to="`/`" style="font-family: 'Montserrat Alternates', serif; font-weight: 500; font-size: 20px"/>
          <q-btn flat label="СТЕЙКХОЛДЕРЫ" :to="`/users`" style="font-family: 'Montserrat Alternates', serif; font-weight: 500; font-size: 20px"/>
          <q-space/>
          <div class="q-mr-lg" style="font-weight: 500; font-size: 20px">Компания "{{ user?.company || '...' }}"</div>

          <!-- Кнопка с аватаром и выпадающим меню -->
          <q-btn round flat size="lg">
            <q-avatar size="50pt" color="grey" text-color="white" icon="person"/>
            <q-menu>
              <q-list style="min-width: 120px">
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Выйти</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </div>
    </q-header>

    <router-view/>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)

const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('http://localhost:8080/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    user.value = data
    localStorage.setItem('userId', data.id)
  } catch (e) {
    console.error('Ошибка при получении профиля:', e)
    // например, редирект на логин при 401
    if (e.response?.status === 401) {
      router.push('/login')
    }
  }
}

const logout = () => {
  localStorage.removeItem('token') // если хранишь JWT
  router.push('/login')
}

onMounted(getProfile)
</script>

<style>
.crop-avatar {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
