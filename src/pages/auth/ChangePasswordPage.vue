<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Смена пароля</div>
    <q-form @submit="submit">
      <q-input v-model="newPassword" label="Новый пароль" type="password" filled class="q-mb-md"/>
      <q-btn label="Сменить пароль" type="submit" color="primary"/>
    </q-form>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'

export default {
  data() {
    return {
      newPassword: ''
    }
  },
  methods: {
    submit() {
      api.post('http://localhost:8080/api/auth/change-password', { newPassword: this.newPassword })
        .then(() => {
          this.$router.push('/'); // правильный способ
        });
    }
  }
}
</script>
