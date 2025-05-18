<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div v-if="sessions.length === 0">
          Сессии не найдены
          <div class="q-mt-lg justify-center row">
            <q-btn label="СОЗДАТЬ" color="info" @click="showCreate = true"/>
          </div>
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
              <q-select
                filled
                v-model="admin"
                :options="userOptions"
                option-label="label"
                option-value="id"
                label="Администратор сессии"
                emit-value
                map-options
              />
              <q-select
                filled
                v-model="selectedUsers"
                :options="userOptions"
                option-label="label"
                option-value="id"
                label="Участники сессии"
                multiple
                emit-value
                map-options
              />
              <div v-for="userId in selectedUsers" :key="userId" class="row items-center q-gutter-sm">
                <div class="text-subtitle2">{{ getUserNameById(userId) }}</div>
                <q-select
                  v-model="userCoefficients[userId]"
                  :options="[1,2,3,4,5,6,7,8,9,10]"
                  label="Вес"
                  dense
                  emit-value
                  map-options
                  style="width: 100px"
                  :rules="[val => !!val || 'Обязательное поле']"
                />
              </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const showCreate = ref(false)
const sessionName = ref('')
const admin = ref('')
const notes = ref('')
const alternativeDifference = ref('')
const trapezoidDifference = ref('')
const sessions = ref([])
const userOptions = ref([])
const selectedUsers = ref([])
const userCoefficients = ref({})

function getUserNameById(id) {
  const user = userOptions.value.find(u => u.id === id)
  return user ? user.label : ''
}

async function fetchUsers() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8080/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    userOptions.value = response.data.map(u => ({
      id: u.id,
      label: u.fullName
    }))
  } catch (e) {
    console.error('Ошибка при загрузке пользователей', e)
  }
}

function goToSession(sessionId) {
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
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8080/v1/sessions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    sessions.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке сессий:', error)
  }
}

async function saveSession() {
  const ids = selectedUsers.value

  try {
    const payload = {
      name: sessionName.value,
      admin: admin.value,
      notes: notes.value,
      alternativeDifference: parseFloat(alternativeDifference.value),
      trapezoidDifference: parseFloat(trapezoidDifference.value),
      participants: ids.map(id => ({
        userId: id,
        coefficient: parseFloat(userCoefficients.value[id])
      }))
    }

    const token = localStorage.getItem('token')
    const response = await axios.post('http://localhost:8080/v1/sessions/create', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const createdSession = response.data
    localStorage.setItem('sessionId', createdSession.sessionId)
    localStorage.setItem('versionId', createdSession.versionId)
    localStorage.setItem("alternativeDifference", payload.alternativeDifference)

    showCreate.value = false
    await fetchSessions()
  } catch (error) {
    console.error('Ошибка при создании сессии:', error)
  }
}

onMounted(() => {
  fetchSessions()
  fetchUsers()
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
