<template>
  <q-layout view="lHh Lpr lFf" style="font-family: 'Montserrat Alternates', serif; font-weight: 300">
    <router-view/>
    <div style="background-color: #14141C;">
      <div class="q-mx-xl">
        <div :class="$q.platform.is.desktop ? 'row justify-between' : 'justify-center'"
             :style="$q.platform.is.desktop ? 'border-bottom: 1px solid grey;' : ''">
          <div :class="$q.platform.is.desktop ? 'row justify-between' : 'justify-center'">
            <div class="q-pt-md q-mb-md"
                 :class="$q.platform.is.desktop ? 'q-mx-xl' : ''">
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
          <div class="q-ma-lg-xl rounded-borders"
               :class="$q.platform.is.desktop ? 'justify-end' : 'justify-center'"
               :style="$q.platform.is.desktop ? '' : 'border: 1px solid grey;'">

            <div class="row justify-around">
              <div class="q-pt-md q-mb-md"
                   :class="$q.platform.is.desktop ? 'q-mx-xl' : ''">
                <q-list>
                  <q-item to="`/`">
                    <q-item-section style="color: white; text-decoration: none;">О мастерской</q-item-section>
                  </q-item>
                  <q-item to="`/catalog`">
                    <q-item-section style="color: white; text-decoration: none;">Каталог</q-item-section>
                  </q-item>
                  <q-item to="`/catalog`">
                    <q-item-section style="color: white; text-decoration: none;">Гарантии</q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="q-pt-md"
                   :class="$q.platform.is.desktop ? 'q-mx-xl' : ''">
                <q-list>
                  <q-item to="`/faq`">
                    <q-item-section style="color: white; text-decoration: none;">FAQ</q-item-section>
                  </q-item>
                  <q-item :to="`/contact`">
                    <q-item-section style="color: white; text-decoration: none;">Контакты</q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
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

export default {
  name: 'MainLayout',
  setup() {
    return {
      tab: ref('mails'),
      profile: {
        photo: '',
      },
    }
  },
  methods: {
    getProfile() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/users/profile`;
      vm.$store.dispatch('updateLoading', true);
      vm.$http.get(url, {
        headers: {
          authorization: `Bearer ${localStorage.user}`,
        },
      })
        .then((response) => {
          // eslint-disable-next-line no-param-reassign
          vm.profile.photo = response.data.photo;
        });
    },
  },
  watch: {
    $route() {
      this.getProfile();
    },
  }
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
