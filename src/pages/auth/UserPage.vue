<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div class="row  justify-start">
          <q-card
            v-for="user in stakeholders"
            :key="user.id"
            :class="['user-card', user.active ? 'active' : 'no-active']"
            flat
            bordered
          >
            <q-card-section class="q-pa-sm q-gutter-xs flex flex-col items-center justify-center text-center"
                            style="height: 100%;">
              <q-avatar size="48px" color="white" class="q-mb-sm"/>
              <div class="text-subtitle2">{{ user.fullName }}</div>
              <q-btn size="sm" class="q-mt-sm" style="background-color: white" color="black" flat label="Редактировать"
                     @click="editUser(user)"/>
            </q-card-section>
          </q-card>
        </div>

        <div class="q-mt-xl text-right">
          <q-btn label="СОЗДАТЬ" color="info" @click="showCreate = true"/>
        </div>
      </q-page>
    </q-page-container>

    <!-- Диалог создания -->
    <q-dialog v-model="showCreate">
      <q-card class="q-pa-md bg-grey-3 q-pt-xl" style="width: 300px; border-radius: 20px">
        <q-card-section class="column items-center q-gutter-md">
          <q-avatar size="80px" color="white"/>
          <q-input v-model="newUser.name" label="ФИО" filled/>
          <q-input v-model="newUser.username" label="логин" filled/>
          <q-input v-model="newUser.role" label="роль" filled/>
          <q-btn label="СОЗДАТЬ" class="bg-white text-black q-mt-sm" @click="createUser"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Диалог редактирования -->
    <q-dialog v-model="showEdit">
      <q-card class="q-pa-md bg-grey-3 q-pt-xl" style="width: 300px; border-radius: 20px">
        <q-card-section class="column items-center q-gutter-md">
          <q-avatar size="80px" color="white"/>
          <div class="text-center text-subtitle1">{{ selectedUser.name }}</div>
          <div class="text-caption">Логин: {{ selectedUser.username }}</div>
           <q-input v-model="selectedUser.role" label="роль" filled/>
          <q-btn label="РЕДАКТИРОВАТЬ" class="bg-white text-black q-mt-sm" @click="updateUser"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import {computed, onMounted, ref, nextTick} from 'vue'
import axios from 'axios'

export default {
  setup() {

    const stakeholders = ref([]) // список пользователей
    const editDialog = ref(false)
    const showCreate = ref(false)
    const showEdit = ref(false)
    const newUser = ref({name: '', login: '', coefficient: '', role: ''})
    const selectedUser = ref({})

    function editUser(user) {
      selectedUser.value = {...user}
      showEdit.value = true
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        stakeholders.value = response.data || []
        console.log('Пользователи:', stakeholders.value)
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error)
      }
    }

    async function createUser() {
      try {
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:8080/api/admin', newUser.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        showCreate.value = false
        newUser.value = { name: '', login: '', coefficient: '', role: '' }
        await fetchUsers()
      } catch (error) {
        console.error('Ошибка при создании пользователя:', error)
      }
    }

    async function updateUser() {
      try {
        const token = localStorage.getItem('token')
        await axios.put(`http://localhost:8080/api/admin/${selectedUser.value.id}`, selectedUser.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        showEdit.value = false
        await fetchUsers()
      } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error)
      }
    }

    onMounted(() => {

      fetchUsers()
    })

    return {
      newUser,
      selectedUser,
      showCreate,
      updateUser,
      createUser,
      editDialog,
      editUser,
      stakeholders,
      showEdit
    }

  }
}
</script>

<style scoped>
.bg-grey-3 {
  background-color: #dddddd;
}

.rounded-borders {
  border-radius: 10px;
}

.user-card {
  width: 180px;
  margin: 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 200px;
}

.active {
  background: #a5e8aa;
}

.no-active {
  background: #cfcfcf;
}
</style>
