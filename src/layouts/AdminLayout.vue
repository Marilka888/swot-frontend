<template>
  <q-layout view="lHh Lpr lFf" style="font-family: 'Montserrat Alternates', serif; font-weight: 300">
    <q-header reveal elevated>
      <div class="q-pb-md row justify-center items-end">
        <div class="q-pa-md q-gutter-y-md">
          <q-btn :to="`/admin`" round color="white">
            <q-avatar size="45pt" font-size="52px" color="teal" text-color="white">
              <img class="crop-avatar" :src="profile.photo">
            </q-avatar>
          </q-btn>
        </div>

        <div class="q-pa-md">
          <div class="q-gutter-y-md" style="width: 100%; background-color: aliceblue">
            <q-input filled v-model="text" label-color="black" label="Поиск по сайту">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>

        <div class="q-pa-md justify-center">
          <q-list>
            <q-item>
              <q-item-section avatar style="min-width: 15px">
                <q-icon color="white" name="place"/>
              </q-item-section>
              <q-item-section>
                <a href="https://yandex.ru/maps/-/CDFLJKNR" style="color: white; text-decoration: none;">
                  г. Кинешма, Площадь Революции, д. 8, 2 этаж
                </a>
              </q-item-section>
            </q-item>

            <q-item style="padding-bottom: 0">
              <q-item-section avatar style="min-width: 15px">
                <q-icon color="white" name="schedule"/>
              </q-item-section>
              <q-item-section style="flex: 25%">10:00-20:00</q-item-section>

              <q-item-section avatar style="min-width: 15px">
                <q-icon color="white" name="phone"/>
              </q-item-section>
              <q-item-section style="padding-left: 6%">
                <a href="tel:+7(999)999-99-99" style="color: white; text-decoration: none;">
                  + 7 (999) 999-99-99
                </a>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="q-pa-xs" style="background-color: #2A2B3A">
        <div class="q-gutter-y-md content-center">
          <q-tabs
            v-model="tab"
            no-caps
            class="text-white"
            narrow-indicator
          >
            <q-route-tab :to="`/admin/orders`" active-class="q-item-no-link-highlighting" name="orders" label="Заказы"/>
            <q-route-tab :to="`/admin/users`" active-class="q-item-no-link-highlighting" name="users"
                         label="Пользователи"/>
            <q-route-tab :to="'/admin/services'" active-class="q-item-no-link-highlighting" name="services"
                         label="Услуги"/>
            <q-route-tab :to="`/admin/meet`" active-class="q-item-no-link-highlighting" name="meet" label="Встречи"/>
          </q-tabs>
        </div>
      </div>
    </q-header>

    <router-view/>
    <div style="background-color: #14141C;">
      <div class="q-mx-xl">
        <div class="q-pt-md q-mb-md"
             :class="$q.platform.is.desktop ? 'row justify-between items-start' : 'justify-center'"
             :style="$q.platform.is.desktop ? 'border-bottom: 1px solid grey;' : ''">
          <div :class="$q.platform.is.desktop ? 'row justify-between' : 'justify-center q-pb-lg'">
            <div :class="$q.platform.is.desktop ? 'q-mx-xl' : ''">
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon color="white" name="place"/>
                  </q-item-section>
                  <q-item-section>
                    <a href="https://yandex.ru/maps/-/CDFLJKNR" style="color: white; text-decoration: none;">
                      г. Кинешма, Площадь Революции, д. 8, 2 этаж
                    </a>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="white" name="schedule"/>
                  </q-item-section>
                  <q-item-section style="color: white; text-decoration: none;">10:00-20:00</q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="white" name="phone"/>
                  </q-item-section>
                  <q-item-section>
                    <a href="tel:+7(999)999-99-99" style="color: white; text-decoration: none;">
                      + 7 (999) 999-99-99
                    </a>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <q-list :class="$q.platform.is.desktop ? 'row justify-end items-center' : 'row justify-center items-center'">
            <q-item to="`/admin/orders`">
              <q-item-section style="color: white; text-decoration: none;">Заказы</q-item-section>
            </q-item>
            <q-item to="`/admin/users`">
              <q-item-section style="color: white; text-decoration: none;">Пользователи</q-item-section>
            </q-item>
            <q-item to="`/admin/services`">
              <q-item-section style="color: white; text-decoration: none;">Услуги</q-item-section>
            </q-item>
            <q-item to="`/admin/meet`">
              <q-item-section style="color: white; text-decoration: none;">Встречи</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div :class="$q.platform.is.desktop ? 'q-pt-md row justify-start q-mx-xl' : 'row justify-center q-mt-md'"
             :style="$q.platform.is.desktop ? '' : 'color: #9F9494'">
          <q-list>
            <q-item style="min-height: 0">
              <q-item-section style="color: white; text-decoration: none;">
                Публичная оферта
              </q-item-section>
            </q-item>
            <q-item style="min-height: 0">
              <q-item-section style="color: white; text-decoration: none;">
                Политика конфиденциальности
              </q-item-section>
            </q-item>
            <q-item style="min-height: 0">
              <q-item-section style="color: white; text-decoration: none;">
                ИП Благовещенский Эдуард Александрович
              </q-item-section>
            </q-item>
            <q-item style="min-height: 0">
              <q-item-section style="color: white; text-decoration: none;">
                ИНН 372401303979
              </q-item-section>
            </q-item>
            <q-item style="min-height: 0">
              <q-item-section style="color: white; text-decoration: none;">
                ОГРН 321370200033394
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div class="q-py-md row justify-center"
           :style="$q.platform.is.desktop ? 'color: #EAE7E7;' : 'color: #9F9494'">
        develop by marilka
      </div>
    </div>
  </q-layout>
</template>

<script>
import {ref} from 'vue'
import {api} from "boot/axios";

export default {
  name: 'AdminLayout',
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
  methods: {
    async getProfile() {

      api.get(`http://localhost:8089/api/users/profile`, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((response) => {
        this.profile.photo = response.data.photo;
      }).catch(() => {
        this.$router.push("/login");
      });
    },
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
