<template>
  <q-layout view="lHh Lpr lFf" style="font-family: 'Montserrat Alternates', serif; font-weight: 300; font-size: 20px">
    <q-header reveal elevated class="q-px-xl" style="background-color: #1f1fac">
      <div class="q-px-xl">
      <q-toolbar class="bg-8 text-white q-my-xs">
        <q-btn flat label="СЕССИИ"
               :to="`/`"
               style="font-family: 'Montserrat Alternates', serif; font-weight: 500; font-size: 20px"/>
        <q-btn flat label="СТЕЙКХОЛДЕРЫ"
               :to="`/users`"
               style="font-family: 'Montserrat Alternates', serif; font-weight: 500; font-size: 20px"/>
        <q-space/>
        <div class="q-mr-lg" style="font-weight: 500; font-size: 20px">Компания "Роги и ноги"</div>
        <q-avatar size="50pt" color="grey" text-color="white" icon="person"/>
      </q-toolbar>
      </div>
    </q-header>

    <router-view/>
  </q-layout>
</template>

<script>
import {ref} from 'vue'
import {api} from "boot/axios";

export default {
  name: 'MainLayout',
  setup() {
    return {
      tab: ref('mails'),
      profile: {
        photo: '../../src/assets/Войти.png',
      },
    }
  },
  async mounted() {
    await this.getProfile();
  },

}
</script>

<style>
.crop-avatar {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
