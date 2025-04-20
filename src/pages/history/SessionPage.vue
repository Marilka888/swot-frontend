<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div v-if="session" class="full-width" style="max-width: 800px">
          <div class="text-h6 text-center q-mb-md" style="text-transform: uppercase">
            {{ session.name }}
          </div>

          <div class="q-mb-sm h3">Заметки:</div>
          {{ session.notes }}
          <div class="column q-mt-sm q-gutter-md">
            <q-card
              v-for="version in session.versions"
              :key="version.id"
              class="bg-grey-3 q-pa-sm row items-center justify-between"
            >
              <div>Версия от {{ formatDateTime(version.timestamp) }}</div>
              <q-btn :to="`/history/version/${version.id}`" label="Результаты" flat/>
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

function createVersionSession () {
  router.push(`/session/factors`)
}

async function fetchSession() {
  try {
    const {sessionId} = route.params
    const response = await axios.get(`http://localhost:8080/v1/sessions/${sessionId}`)
    session.value = response.data
  } catch (e) {
    console.error('Ошибка при загрузке сессии:', e)
  }
}

onMounted(fetchSession)
</script>

<style scoped>
.bg-grey-3 {
  background-color: #dddddd;
}

.text-center {
  text-align: center;
}
</style>
