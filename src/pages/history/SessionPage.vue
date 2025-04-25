<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container style="padding-top: 90pt">
      <q-page class="q-pa-md flex column items-center">
        <div v-if="session" class="full-width" style="max-width: 800px">
          <div class="text-h6 text-center q-mb-md" style="text-transform: uppercase">
            {{ session.name }}
          </div>

          <div class="q-mb-sm h3">Заметки:</div>
          <div style="background-color: rgba(198,198,198,0.53)">
            {{ session.notes }}
          </div>

          <div class="q-mb-sm h3">
            Δ альтернатив: {{ session.alternativeDifference?.toFixed(3) ?? '—' }}<br>
            Δ трапеций: {{ session.trapezoidDifference?.toFixed(3) ?? '—' }}
          </div>
          <div class="column q-mt-sm q-gutter-md">
            <q-card
              v-for="version in versions"
              :key="version.id"
              class="bg-grey-3 q-pa-sm row items-center justify-between"
            >
              <div>Версия от {{ formatDateTime(version.createdAt) }}</div>
              <q-btn :to="`/history/version/${version.id}`" label="Результаты" flat />
            </q-card>
          </div>
          <div class="q-mt-lg self-end">
            <q-btn label="СОЗДАТЬ" color="info" @click="createVersionSession()"/>
          </div>
        </div>
        <div v-else class="q-pa-md">Загрузка...</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import {useRoute} from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const session = ref(null)
const sessionId = route.params.sessionId
const versions = ref(null)
const name = 'SessionPage'

function formatDateTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function createVersionSession() {
  try {
    const token = localStorage.getItem('token')
    const sessionId = route.params.sessionId
    localStorage.setItem('sessionId', sessionId)
    console.log(token)

    const response = await axios.post(
      `http://localhost:8080/v1/session/${sessionId}/versions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    localStorage.setItem('versionId', response.data.id)

    await fetchSession() // обновим список версий после создания
    router.push(`/session/factors`)
  } catch (e) {
    console.error('Ошибка при создании версии сессии:', e)
  }
}

async function fetchSession() {
  try {
    const {sessionId} = route.params
    const token = localStorage.getItem('token') // ← токен сохраняется после логина
    const response = await axios.get(`http://localhost:8080/v1/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    session.value = response.data

    localStorage.setItem('sessionName', response.data.name)

  } catch (e) {
    console.error('Ошибка при загрузке сессии:', e)
  }
}

async function fetchVersion() {
  try {
    const token = localStorage.getItem('token') // ← токен сохраняется после логина
    const {sessionId} = route.params
    const response = await axios.get(`http://localhost:8080/v1/session/${sessionId}/versions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    versions.value = response.data
  } catch (e) {
    console.error('Ошибка при загрузке сессии:', e)
  }
}

onMounted(fetchSession)
onMounted(fetchVersion)
</script>

<style scoped>
.bg-grey-3 {
  background-color: #dddddd;
}

.text-center {
  text-align: center;
}
</style>
