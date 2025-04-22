<template>
  <q-page-container
    class="background-main"
    :class="$q.platform.is.desktop ? 'q-px-xl' : 'q-pb-xl'"
    :style="$q.platform.is.desktop ? 'padding-top: 50pt' : 'padding-top: 210pt'">
    <div
      class="row justify-center"
      :style="$q.platform.is.desktop ? 'font-size: 350%; color: #FFC888; font-family: \'Montserrat Alternates\', serif; font-style: normal; font-weight: 400;' : 'text-align: center; margin-bottom: 15pt; color: #FFC888; font-family: \'Montserrat Alternates\', serif; font-style: normal; font-weight: 400; font-size: 180%;'">
      Регистрация
    </div>
    <div :class="$q.platform.is.desktop ? 'q-mx-lg row justify-center items-center' : 'q-px-lg row justify-start'"
         style="color: #FFC888; font-family: 'Montserrat Alternates', serif; font-style: normal; font-weight: 400; font-size: 200%;">
      <div class="q-pa-md" style="max-width: 550px">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >

          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            v-model="profile.firstname"
            label="Имя"
            stack-label
            lazy-rules
          />

          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            v-model="profile.secondname"
            label="Фамилия"
            stack-label
            lazy-rules
          />

          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            v-model="profile.middlename"
            label="Отчество"
            stack-label
            lazy-rules
          />

          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            v-model="profile.phone"
            label="Телефон"
            stack-label
            lazy-rules
          />
          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            v-model="profile.email"
            label="Почта"
            stack-label
            lazy-rules
          />
          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            type="password"
            v-model="profile.password"
            label="Пароль"
            stack-label
            lazy-rules
          />

          <!--          <q-toggle v-model="accept" label="I accept the license and terms"/>-->

          <div>
            <q-btn class="q-my-lg q-mr-lg" color="secondary" text-color="black"
                   type="submit"
                   @click="register"
                   label="Зарегистрироваться"
            />
            <q-btn class="q-my-lg" text-color="secondary"
                   :to="`/login`"
                   label="Авторизоваться"
            />
          </div>
        </q-form>
        <div class="q-pb-md row justify-center items-center">
          <div class="q-pa-md q-gutter-y-md">
            <q-btn :to="`/`" text-color="white">
              На главную
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-page-container>
</template>

<script>
import {api} from "boot/axios";
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterPage',
  $router: useRouter(),
  data() {
    return {
      profile: {
        firstname: '',
        secondname: '',
        middlename: '',
        phone: '',
        email: '',
        password: '',
      }
    }
  },
  methods: {
    register() {
      let registerInfo = {
        'firstname': this.profile.firstname,
        'secondname': this.profile.secondname,
        'middlename': this.profile.middlename,
        'phone': this.profile.phone,
        'email': this.profile.email,
        'password': this.profile.password
      }

      api.post(`http://localhost:8089/api/auth/register`, registerInfo)
        .then(response => {
          api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('roles', response.data.roles)
          this.$router.push("/profile");
          // commit('register', {token: response.data.token, user: response.data.user})
        })
    }
  }
}
</script>
<style>
.background-main {
  background-color: #14141C;
}
</style>
