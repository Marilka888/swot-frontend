<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div class="text-h6 q-mb-md" style="text-transform:uppercase">{{ sessionName }}</div>

        <div class="q-tabs-container">
          <q-tabs v-model="tab"
                  class="bg-grey-3 text-black non-selectable-tabs tab-text-size"
                  dense>
            <q-tab name="factors" label="ФАКТОРЫ"/>
            <q-tab name="strength" label="ВЕСА ФАКТОРОВ"/>
            <q-tab name="alternatives" label="АЛЬТЕРНАТИВЫ"/>
            <q-tab name="results" label="РЕЗУЛЬТАТЫ"/>
          </q-tabs>
        </div>

        <div class="grid-analysis q-mt-md" style="align-items: center; justify-content: center">
          <div class="cell strong bg-dark-blue" ref="strongCell">
            <div class="header">Сильные стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in strongFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold;">{{ getFactorNumber(factor, 'strong', index) }}</span>
                  <span>{{ factor.massCenter.toFixed(3) }} {{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell weak bg-light-grey" ref="weakCell">
            <div class="header">Слабые стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in weakFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold;">{{ getFactorNumber(factor, 'weak', index) }}</span>
                  <span>{{ factor.massCenter.toFixed(3) }} {{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell opportunities bg-light-grey" ref="opportunityCell">
            <div class="header">Возможности</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in opportunityFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold;">{{ getFactorNumber(factor, 'opportunity', index) }}</span>
                  <span>{{ factor.massCenter.toFixed(3) }} {{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell threats bg-dark-red" ref="threatCell">
            <div class="header">Угрозы</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in threatFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold;">{{ getFactorNumber(factor, 'threat', index) }}</span>
                  <span>{{ factor.massCenter.toFixed(3) }} {{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn label="ГОТОВО" :to="'/session/alternatives'" class="done-button"/>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const sessionName = ref('Название сессии')
    const tab = ref('strength')

    const strongFactors = ref([])
    const weakFactors = ref([])
    const opportunityFactors = ref([])
    const threatFactors = ref([])

    const factorNumbers = ref({
      strong: [],
      weak: [],
      opportunity: [],
      threat: []
    })

    const fetchFactors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/factors')
        const all = response.data
        strongFactors.value = all.filter(f => f.type === 'strong')
        weakFactors.value = all.filter(f => f.type === 'weak')
        opportunityFactors.value = all.filter(f => f.type === 'opportunity')
        threatFactors.value = all.filter(f => f.type === 'threat')
      } catch (err) {
        console.error('Ошибка загрузки факторов:', err)
      }
    }

    const fetchFactorNumbers = async () => {
      try {
        const {data} = await axios.get('/api/factors/numbers')
        factorNumbers.value = data
      } catch (err) {
        console.error('Ошибка при загрузке номеров факторов:', err)
      }
    }

    const getFactorNumber = (factor, section, index) => {
      return factorNumbers.value[section]?.[index] || ''
    }

    onMounted(async () => {
      await Promise.all([fetchFactors(), fetchFactorNumbers()])
    })

    return {
      tab,
      sessionName,
      strongFactors,
      weakFactors,
      opportunityFactors,
      threatFactors,
      getFactorNumber
    }
  }
}
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
  font-weight: 1500;
  font-size: 0.9em;
}
</style>
