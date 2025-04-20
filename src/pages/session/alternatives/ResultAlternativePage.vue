<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div class="flex items-center q-mb-md" style="width: 100%; max-width: 800px; justify-content: space-between;">
          <div class="text-h6" style="text-transform: uppercase; text-align: center; flex-grow: 1;">
            <q-btn icon="arrow_back" class="justify-start row" flat @click="$router.go(-1)"/>
            {{ sessionName }}
          </div>
        </div>

        <div class="text-subtitle2 q-mb-md">Версия от 10.02.2025 13:30</div>

        <div
          class="grid-analysis q-mt-md"
          style="align-items: center; justify-content: center"
        >
          <div class="cell strong bg-dark-blue" ref="strongCell">
            <div class="header">Сильные стороны</div>
            <ul class="centered-list q-mt-xs">
              <li
                v-for="(factor, index) in strongFactors"
                :key="index"
                class="list-item-small"
              >
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{
                      getFactorNumber(factor, 'strong', index)
                    }}</span>
                  <span>{{ factor }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell weak bg-light-grey" ref="weakCell">
            <div class="header">Слабые стороны</div>
            <ul class="centered-list q-mt-xs">
              <li
                v-for="(factor, index) in weakFactors"
                :key="index"
                class="list-item-small"
              >
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{
                      getFactorNumber(factor, 'weak', index)
                    }}</span>
                  <span>{{ factor }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell opportunities bg-light-grey" ref="opportunityCell">
            <div class="header">Возможности</div>
            <ul class="centered-list q-mt-xs">
              <li
                v-for="(factor, index) in opportunityFactors"
                :key="index"
                class="list-item-small"
              >
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{
                      getFactorNumber(factor, 'opportunity', index)
                    }}</span>
                  <span>{{ factor }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell threats bg-dark-red" ref="threatCell">
            <div class="header">Угрозы</div>
            <ul class="centered-list q-mt-xs">
              <li
                v-for="(factor, index) in threatFactors"
                :key="index"
                class="list-item-small"
              >
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{
                      getFactorNumber(factor, 'threat', index)
                    }}</span>
                  <span>{{ factor }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="q-mt-md justify-end row ">
          <q-btn label="Изменить факторы" class="q-mt-md done-button" flat/>
        </div>

        <div class="alternatives q-mt-lg justify-center row">
          <div class="text-h6">АЛЬТЕРНАТИВЫ</div>
          <div v-for="(alt, index) in alternatives" :key="index"
               :class="{'alternative-block': index < 3, 'alternative-text': index >= 3}">
              <div class="alt-metrics" v-if="index < 3">
                <span><strong>d- = {{ alt.d_minus }}</strong></span>
                <span><strong>d+ = {{ alt.d_plus }}</strong></span>
                <span><strong>d* = {{ alt.d_star }}</strong></span>
              </div>
              <div class="alt-text" v-if="index < 3">
                {{ alt.factor1 }} и {{ alt.factor2 }}
              </div>
            <div v-if="index > 2" class="q-px-lg">
              <span style="font-weight: bold; font-size: 0.8em">
                ( d- = {{ alt.d_minus }}; d+ = {{ alt.d_plus }}; d* = {{ alt.d_star }} )
              </span>

              {{ alt.factor1 }} и {{ alt.factor2 }}
            </div>

          </div>
        </div>

        <div class="q-mt-md justify-end row">
          <q-btn label="Изменить альтернативы" class="q-mt-md done-button" flat/>
        </div>

        <q-btn
          label="Сохранить изменения"
          icon="save"
          color="primary"
          class="q-mt-md"
          @click="saveSummary"
        />

        <q-dialog v-model="editAltDialog">
          <q-card style="min-width: 500px">
            <q-card-section>
              <div class="text-h6">Редактировать альтернативу</div>
              <div>{{ selectedAlternative?.factor1 }} и {{ selectedAlternative?.factor2 }}</div>
            </q-card-section>
            <q-card-section>
              <q-input v-model.number="selectedAlternative.d_minus" label="d-" type="number" />
              <q-input v-model.number="selectedAlternative.d_plus" label="d+" type="number" class="q-mt-sm" />
              <q-input v-model.number="selectedAlternative.d_star" label="d*" type="number" class="q-mt-sm" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Отмена" v-close-popup />
              <q-btn flat label="Сохранить" color="primary" @click="saveAltEdit" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-btn
          icon="edit"
          flat
          round
          color="primary"
          @click="openAltEditDialog(alt)"
        />

      </q-page>
    </q-page-container>
  </q-layout>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { debounce } from 'quasar'

const debouncedSave = debounce(() => saveSummary(), 500)

const sessionId = route.params.sessionId || 1

const editAltDialog = ref(false)
const selectedAlternative = ref(null)

const openAltEditDialog = (alt) => {
  selectedAlternative.value = JSON.parse(JSON.stringify(alt)) // клон
  editAltDialog.value = true
}

const saveAltEdit = () => {
  const index = alternatives.value.findIndex(a =>
    a.factor1 === selectedAlternative.value.factor1 &&
    a.factor2 === selectedAlternative.value.factor2
  )
  if (index !== -1) {
    alternatives.value[index] = { ...selectedAlternative.value }
    saveSummary() // автообновление
  }
  editAltDialog.value = false
}


const sessionName = ref('')
const strongFactors = ref([])
const weakFactors = ref([])
const opportunityFactors = ref([])
const threatFactors = ref([])
const alternatives = ref([])
const factorNumbers = ref({
  strong: [],
  weak: [],
  opportunity: [],
  threat: []
})

const getFactorNumber = (factor, section, index) => {
  return factorNumbers.value[section]?.[index] ?? '-'
}

const loadSummary = async () => {
  try {
    const token = localStorage.getItem('token') // ← токен сохраняется после логина
    const { data } = await axios.get('http://localhost:8080/api/session/${sessionId}/summary', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    sessionName.value = data.sessionName
    strongFactors.value = data.factors.strong
    weakFactors.value = data.factors.weak
    opportunityFactors.value = data.factors.opportunity
    threatFactors.value = data.factors.threat
    factorNumbers.value = data.factorNumbers
    alternatives.value = data.alternatives
  } catch (err) {
    console.error('Ошибка при загрузке summary:', err)
  }
}

const loading = ref(true)

const saveSummary = async () => {
  const payload = {
    sessionName: sessionName.value,
    factors: {
      strong: strongFactors.value,
      weak: weakFactors.value,
      opportunity: opportunityFactors.value,
      threat: threatFactors.value
    },
    factorNumbers: factorNumbers.value,
    alternatives: alternatives.value
  }

  try {
    const token = localStorage.getItem('token') // ← токен сохраняется после логина
    await axios.post(`http://localhost:8080/api/session/${sessionId}/summary`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    $q.notify({ type: 'positive', message: 'Изменения сохранены' })
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Ошибка при сохранении' })
  }
}



onMounted(async () => {
  loading.value = true
  await loadSummary()
  loading.value = false
})


</script>


<style>
.q-toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.grid-analysis {
  display: grid;
  grid-template-columns: repeat(2, 400px);
  grid-template-rows: auto; /* Автоматическая высота строк */
  gap: 10px;
  width: 100%;
  max-width: none;
  justify-content: center;
}

.factor-item .q-item__section--side {
  display: flex;
  align-items: center;
}

.cell {
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  min-height: 350px;
  /* min-height: 300px; */ /* Убираем или комментируем min-height */
}

.centered-list { /* или .cell ul */
  list-style-position: outside;
  width: 100%;
  margin-bottom: 0;
  padding-left: 16px;
  flex-grow: 1;
  margin-top: 16px;
  list-style-type: none;
}

.cell ul {
  padding-left: 16px;
  list-style-position: outside;
  width: 100%;
  margin-bottom: 0;
  flex-grow: 1;
  margin-top: 16px; /* Добавляем отступ сверху списка */
  overflow-y: auto;
}

.bg-dark-blue {
  background: #02486c;
  color: white;
}

.bg-dark-red {
  background: #02486c;
  color: white;
}

.bg-light-grey {
  background: #E0E0E0;
}

.header {
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  width: 100%;
  font-size: 1em;
}

/*стиль чтобы отключить кликабельность*/
.non-selectable-tabs .q-tab {
  pointer-events: none;
  cursor: default;
}

.alternatives {
  width: 100%;
  max-width: 800px;
  min-width: 800px;
}

.alternative {
  display: flex;
  justify-content: space-between;
  background: #ECECEC;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.alt-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 35px;
  margin-left: 25px;
  font-weight: bold;
}

.alt-text {
  overflow-y: auto;
  max-width: 600px;
}

.cell li {
  text-align: left;
  font-weight: 500; /*  Делаем текст немного жирнее  */
  font-size: 0.8em;
  word-wrap: break-word;
  margin-bottom: 8px;
}

.list-item-small {
  word-wrap: break-word;
  margin-bottom: 8px;
  font-weight: 500; /*  Делаем текст немного жирнее  */
}

/* Текст табов такого же размера, как и текст списка */
.tab-text-size .q-tab__label {
  font-size: 0.9em;
  font-weight: 500;
  text-transform: none;
}

.bg-dark-blue {
  background: #02486c;
  color: white;
}

.q-card-actions-custom .q-btn {
  margin: 0 16px; /* добавляем отступ между кнопками */
}

.add-dialog .q-card-actions .q-btn {
  margin: 0 8px; /* добавляем отступ между кнопками */
}

.q-tabs-container {
  width: 810px; /*  Ширина квадрата + gap  */
  margin-bottom: 10px; /* Отступ снизу */
}

.numbered-factor .number {
  width: 6em; /* Задайте фиксированную ширину, чтобы вместить самое длинное число */
  text-align: left; /* Выравниваем текст по правому краю */
  margin-right: 0.7em; /* Небольшой отступ, если нужно */
}

.done-button {
  color: white;
  background: #1f1fac;
  border-radius: 20px;
  padding: 15px 35px;
  text-transform: none;
  font-weight: bold;
  font-size: 0.9em;
}

.alternative-block {
  display: flex;
  background: #ECECEC;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  min-width: 800px;
  font-weight: bolder;
  font-size: 0.8em;
}

.alternative-text {
  font-size: 0.8em;
  margin-top: 10px;
  justify-content: space-between;
  word-wrap: break-word;
  margin-bottom: 8px;
}

.done-button {
  color: white;
  background: #1f1fac;
  border-radius: 20px;
  padding: 15px 35px;
  text-transform: none;
  font-weight: 1500;
  font-size: 0.9em;
}
</style>
