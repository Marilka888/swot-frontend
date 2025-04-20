<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div v-if="sessions.length === 0">
          <q-spinner color="primary" size="2em" />
          <div class="q-mt-sm">Загрузка сессий...</div>
        </div>
        <div v-else class="session-container column q-gutter-md">
          <q-card
            v-for="session in sessions"
            :key="session.id"
            class="bg-grey-3 cursor-pointer"
            flat
            bordered
            @click="goToSession(session.id)"
          >
            <q-card-section>
              <div class="text-subtitle1">{{ session.name }}</div>
              <div class="text-caption">Отредактировано {{ formatDate(session.lastModified) }}</div>
            </q-card-section>
          </q-card>

          <div class="q-mt-lg self-end">
            <q-btn label="СОЗДАТЬ" color="info" @click="showCreate = true"/>
          </div>
        </div>

        <q-dialog v-model="showCreate" persistent>
          <q-card class="add-dialog bg-grey-3">
            <q-card-section>
              <div class="text-h6 text-center">СОЗДАНИЕ НОВОЙ СЕССИИ</div>
            </q-card-section>
            <q-card-section class="q-gutter-md column">
              <q-input filled v-model="sessionName" label="название"/>
              <q-input filled v-model="admin" label="администратор"/>
              <q-input filled v-model="notes" label="заметки к сессии" type="textarea"/>
            </q-card-section>
            <q-card-actions align="center" class="q-px-md q-pb-md">
              <q-btn class="toast-button" flat label="ОТМЕНА" @click="showCreate = false"/>
              <q-btn class="toast-button" flat label="ГОТОВО" @click="saveSession"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const showCreate = ref(false)
const sessionName = ref('')
const admin = ref('')
const notes = ref('')
const sessions = ref([])

function goToSession(sessionId) {
  console.log("sessionId")
  console.log(sessionId)
  router.push(`/history/${sessionId}`)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

async function fetchSessions() {
  try {
    const response = await axios.get('http://localhost:8080/v1/sessions')
    sessions.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке сессий:', error)
  }
}

function saveSession() {
  showCreate.value = false
  // можно отправить POST-запрос на сохранение
  console.log('Создана сессия:', sessionName.value, admin.value, notes.value)
}

onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
.bg-grey-3 {
  background-color: #dddddd;
}
.rounded-borders {
  border-radius: 10px;
}
.text-center {
  text-align: center;
}
.add-dialog {
  width: 400px;
  max-width: 90%;
  border-radius: 15px;
}
.toast-button {
  color: white;
  background: #02486c;
  border-radius: 5px;
  padding: 12px 24px;
  text-transform: none;
  font-weight: 600;
  font-size: 1em;
  margin: 0 8px;
}
.session-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
