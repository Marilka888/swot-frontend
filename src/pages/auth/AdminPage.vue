<template>
  <q-page class="q-pa-md">
    <div class="text-h5">Админская панель: Пользователи</div>

    <q-input
      filled
      v-model="search"
      label="Поиск по логину"
      class="q-mt-md"
      debounce="300"
      clearable
      @clear="search = ''"
    />

    <q-select
      filled
      v-model="sortField"
      label="Сортировать по"
      :options="[
    { label: 'Логину (A-Z)', value: 'username_asc' },
    { label: 'Логину (Z-A)', value: 'username_desc' },
    { label: 'Кол-ву ролей (меньше → больше)', value: 'roles_asc' },
    { label: 'Кол-ву ролей (больше → меньше)', value: 'roles_desc' }
  ]"
      class="q-mt-md"
    />

    <q-list bordered class="q-mt-md">
      <q-item v-for="u in filteredUsers" :key="u.id">
        <q-item-section>
          <q-item-label>{{ u.username }}</q-item-label>
          <q-item-label caption>Роли: {{ u.roles.join(', ') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>


    <q-form @submit="createUser" class="q-mt-md">
      <q-input v-model="newUser.username" label="Логин" filled />
      <q-input v-model="newUser.password" label="Пароль" type="password" filled class="q-mt-sm" />
      <q-option-group
        v-model="newUser.roles"
        :options="roleOptions"
        type="checkbox"
        label="Роли"
        class="q-mt-sm"
      />
      <q-btn label="Создать" type="submit" color="primary" class="q-mt-md" />
    </q-form>

    <q-separator class="q-my-md" />
    <div class="text-subtitle2">Существующие пользователи:</div>
    <q-list bordered class="q-mt-sm">
      <q-item v-for="u in users" :key="u.id">
        <q-item-section>
          <q-item-label>{{ u.username }}</q-item-label>
          <q-item-label caption>Роли: {{ u.roles.join(', ') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-item v-for="u in pagedUsers" :key="u.id">
      <q-item-section>
        <q-item-label>{{ u.username }}</q-item-label>
        <q-item-label caption>Роли: {{ u.roles.join(', ') }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn flat icon="delete" color="red" @click="confirmDelete(u)" />
      </q-item-section>
    </q-item>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Удалить пользователя?</div>
          <div>Вы уверены, что хотите удалить <strong>{{ userToDelete?.username }}</strong>?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Удалить" color="red" @click="deleteUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-pagination
      v-model="currentPage"
      :max="pageCount"
      :max-pages="5"
      boundary-numbers
      class="q-mt-md"
    />

    <q-btn label="Экспорт в CSV" icon="download" class="q-mt-md" @click="exportCSV" />
    <div class="q-mt-md row q-gutter-sm">
      <q-btn
        label="Экспортировать выбранных"
        icon="download"
        color="primary"
        @click="exportSelected"
        :disable="!selectedUsers.length && !users.length"
      />
      <q-btn
        label="Сбросить выбор"
        flat
        @click="selectedUsers = []"
        v-if="selectedUsers.length"
      />
    </div>

    <q-item v-for="u in pagedUsers" :key="u.id" clickable>
      <q-item-section avatar>
        <q-checkbox v-model="selectedUsers" :val="u" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ u.username }}</q-item-label>
        <q-item-label caption>Роли: {{ u.roles.join(', ') }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn flat icon="delete" color="red" @click.stop="confirmDelete(u)" />
      </q-item-section>
    </q-item>


  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const users = ref([])
const newUser = ref({ username: '', password: '', roles: ['USER'] })
const search = ref('')
const sortField = ref('username_asc')
const deleteDialog = ref(false)
const userToDelete = ref(null)
const selectedUsers = ref([])

const exportSelected = () => {
  const toExport = selectedUsers.value.length ? selectedUsers.value : users.value

  const headers = ['username', 'roles']
  const rows = toExport.map(u => [u.username, u.roles.join('|')])

  const content = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([content], { type: 'text/csv' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = selectedUsers.value.length ? 'selected-users.csv' : 'all-users.csv'
  link.click()
}

const confirmDelete = (user) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  try {
    await axios.delete(`/api/admin/users/${userToDelete.value.id}`)
    $q.notify({ type: 'positive', message: 'Пользователь удалён' })
    deleteDialog.value = false
    await loadUsers()
  } catch {
    $q.notify({ type: 'negative', message: 'Ошибка удаления' })
  }
}

const exportCSV = () => {
  const headers = ['username', 'roles']
  const rows = users.value.map(u => [u.username, u.roles.join('|')])

  const content = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([content], { type: 'text/csv' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'users.csv'
  link.click()
}

const filteredUsers = computed(() => {
  let list = [...users.value]

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(u => u.username.toLowerCase().includes(q))
  }

  switch (sortField.value) {
    case 'username_asc':
      list.sort((a, b) => a.username.localeCompare(b.username))
      break
    case 'username_desc':
      list.sort((a, b) => b.username.localeCompare(a.username))
      break
    case 'roles_asc':
      list.sort((a, b) => a.roles.length - b.roles.length)
      break
    case 'roles_desc':
      list.sort((a, b) => b.roles.length - a.roles.length)
      break
  }

  return list
})

const currentPage = ref(1)
const rowsPerPage = 5

const pageCount = computed(() => Math.ceil(filteredUsers.value.length / rowsPerPage));

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return filteredUsers.value.slice(start, start + rowsPerPage)
})


const roleOptions = [
  { label: 'USER', value: 'USER' },
  { label: 'ADMIN', value: 'ADMIN' }
]

const loadUsers = async () => {
  const { data } = await axios.get('/api/admin/users')
  users.value = data
}

const createUser = async () => {
  try {
    await axios.post('/api/admin/users', newUser.value)
    $q.notify({ type: 'positive', message: 'Пользователь создан' })
    await loadUsers()
    newUser.value = { username: '', password: '', roles: ['USER'] }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Ошибка создания' })
  }
}

onMounted(() => {
  loadUsers()
})
</script>
