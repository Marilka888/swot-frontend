<template>
  <q-page-container
    class="background-main"
    :class="$q.platform.is.desktop ? 'q-px-xl' : 'q-pb-xl'"
    :style="$q.platform.is.desktop ? 'padding-top: 50pt' : 'padding-top: 210pt'">
    <div
      class="row justify-center"
      :style="$q.platform.is.desktop ? 'font-size: 350%; color: #FFC888; font-family: \'Montserrat Alternates\', serif; font-style: normal; font-weight: 400;' : 'text-align: center; margin-bottom: 15pt; color: #FFC888; font-family: \'Montserrat Alternates\', serif; font-style: normal; font-weight: 400; font-size: 180%;'">
      Авторизация
    </div>
    <div :class="$q.platform.is.desktop ? 'q-mx-lg row justify-center items-center' : 'q-px-lg row justify-start'"
         style="color: #FFC888; font-family: 'Montserrat Alternates', serif; font-style: normal; font-weight: 400; font-size: 200%;">
      <div class="q-pa-md" style="max-width: 550px">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >

          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            v-model="form.phone"
            label="Телефон"
            stack-label
            lazy-rules
          />
          <q-input
            style="background-color: aliceblue; font-size: 100%; color: #b7b7b7"
            filled
            type="password"
            v-model="form.password"
            label="Пароль"
            stack-label
            lazy-rules
          />

          <!--          <q-toggle v-model="accept" label="I accept the license and terms"/>-->

          <div>
            <q-btn class="q-my-lg q-mr-lg" color="secondary" text-color="black"
                   type="submit"
                   @click="authenticate"
                   label="Авторизоваться"
            />
            <q-btn class="q-my-lg" text-color="secondary"
                   :to="`/register`"
                   label="Зарегистрироваться"
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

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        phone: '',
        password: '',
      }
    }
  },
  methods: {
    authenticate() {
      const loginInfo = {
        password: this.form.password,
        phone: this.form.phone,
      }

      api.post(`http://localhost:8089/api/auth/authenticate`, loginInfo)
        .then(response => {
          localStorage.setItem('token', response.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

          // Перенаправление на смену пароля при первом входе
          if (response.data.isReg) {
            this.$router.push('/change-password');
            return;
          }
          if (response.data.role === "ADMIN") {
            this.$router.push("/admin");
          }
          if (response.data.role === "EMPLOYEE") {
            this.$router.push("/employee");
          }
        })
        .catch(err => {
          console.error(err);
          this.$q.notify({ type: 'negative', message: 'Ошибка авторизации' });
        });
    }

  },
  watch: {
    $route() {
      this.getProfile();
    },
  },
}
</script>

<style>
.background-main {
  background-color: #14141C;
}
</style>
