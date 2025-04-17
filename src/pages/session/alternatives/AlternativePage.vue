<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div class="text-h6 q-mb-md" style="text-transform:uppercase">
          {{ sessionName }}
        </div>

        <div class="q-tabs-container">
          <q-tabs
            v-model="tab"
            class="bg-grey-3 text-black non-selectable-tabs tab-text-size"
            dense
          >
            <q-tab name="factors" label="ФАКТОРЫ" />
            <q-tab name="strength" label="ВЕСА ФАКТОРОВ" />
            <q-tab name="alternatives" label="АЛЬТЕРНАТИВЫ" />
            <q-tab name="results" label="РЕЗУЛЬТАТЫ" />
          </q-tabs>
        </div>

        <div class="grid-analysis q-mt-md" style="align-items: center; justify-content: center">
          <div class="cell strong bg-light-red" ref="strongCell">
            <div class="header with-circle text-green">Сильные стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in strongFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{ getFactorNumber(factor) }}</span>
                  <span>{{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell weak bg-light-grey" ref="weakCell">
            <div class="header with-circle text-pink">Слабые стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in weakFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{ getFactorNumber(factor) }}</span>
                  <span>{{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell opportunities bg-light-grey" ref="opportunityCell">
            <div class="header with-circle text-green">Возможности</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in opportunityFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{ getFactorNumber(factor) }}</span>
                  <span>{{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div class="cell threats bg-dark-red" ref="threatCell">
            <div class="header with-circle text-pink">Угрозы</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in threatFactors" :key="index" class="list-item-small">
                <span class="numbered-factor">
                  <span class="number" style="font-weight: bold">{{ getFactorNumber(factor) }}</span>
                  <span>{{ factor.name }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="alternatives q-mt-lg">
          <div class="text-h6">АЛЬТЕРНАТИВЫ</div>
          <div v-if="alternatives.length === 0">Альтернативы не найдены</div>
          <div
            class="alternative"
            v-for="(alt, index) in alternatives"
            :key="index"
          >
            <div class="alt-id">A{{ index + 1 }}</div>
            <div class="alt-data">
              <div class="alt-numbers">
                <div>d+ = {{ alt.dplus?.toFixed(3) }}</div>
                <div>d- = {{ alt.dminus?.toFixed(3) }}</div>
                <div>d* = {{ alt.closeness?.toFixed(3) }}</div>
              </div>
              <div class="alt-description">
                {{ alt.internalFactor }} и {{ alt.externalFactor }}
              </div>
            </div>
          </div>
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
    const tab = ref('alternatives')

    const strongFactors = ref([])
    const weakFactors = ref([])
    const opportunityFactors = ref([])
    const threatFactors = ref([])
    const alternatives = ref([])

    const fetchFactors = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/v1/factors')
        strongFactors.value = data.filter(f => f.type === 'strong')
        weakFactors.value = data.filter(f => f.type === 'weak')
        opportunityFactors.value = data.filter(f => f.type === 'opportunity')
        threatFactors.value = data.filter(f => f.type === 'threat')
      } catch (err) {
        console.error('Ошибка загрузки факторов:', err)
      }
    }

    const fetchAlternatives = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/session/alternatives')
        alternatives.value = data
        console.info('Альтернативы:', data)
      } catch (err) {
        console.error('Ошибка загрузки альтернатив:', err)
      }
    }

    const getFactorNumber = (factor) => {
      return factor.massCenter ? factor.massCenter.toFixed(2) : '-'
    }

    onMounted(async () => {
      await fetchFactors()
      await fetchAlternatives()
    })

    return {
      sessionName,
      tab,
      strongFactors,
      weakFactors,
      opportunityFactors,
      threatFactors,
      getFactorNumber,
      alternatives
    }
  }
}
</script>

<style scoped>

.alt-id {
  width: 40px;
  font-weight: bold;
  text-align: left;
  margin-right: 10px;
  color: #025780;
}

.alt-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.alt-numbers {
  display: flex;
  gap: 20px;
  font-size: 1em;
  font-weight: 600;
}

.alt-description {
  margin-top: 6px;
  font-size: 1em;
  font-weight: 400;
}

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

.bg-light-red {
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
}

.alternative {
  display: flex;
  justify-content: space-between;
  background: #ECECEC;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.alt-metricss {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 15px;
  font-weight: bold;
}

.alt-textt {
  overflow-y: auto;
  max-width: 500px;
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

.bg-light-red {
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
</style>
