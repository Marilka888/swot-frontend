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
          <!-- ФАКТОРЫ -->
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

        <!-- КНОПКИ ЗАВЕРШЕНИЯ И ПЕРЕСЧЁТА -->
          <div class="q-mt-md row q-gutter-md">
          <q-btn label="РЕЗУЛЬТАТЫ" class="done-button" @click="finishSession" />
          <q-btn
            v-if="showSensitivityButton"
            label="АНАЛИЗ ЧУВСТВИТЕЛЬНОСТИ"
            class="done-button"
            color="warning"
            @click="openSensitivityDialog"
          />
          <q-btn v-if="Object.keys(revealMap).length > 0" label="ПЕРЕСЧЁТ D*" color="info" class="done-button info" @click="recalculateAlternatives" />
        </div>

        <!-- АЛЬТЕРНАТИВЫ -->
        <div class="alternatives q-mt-lg">
          <div class="text-h6">АЛЬТЕРНАТИВЫ</div>
          <div v-if="sortedAlternatives.length === 0">Альтернативы не найдены</div>

          <div
            class="alternative"
            v-for="(alt, index) in sortedAlternatives"
            :key="'alt-' + index"
            :class="{ 'old-alt': showAll && isOldAlternative(alt) }"
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
            <q-btn flat dense icon="edit" @click="openAltDialog(alt)" class="q-ml-sm" />
          </div>
        </div>

        <q-dialog v-model="showAltDialog">
          <q-card style="width: 400px; max-width: 90%">
            <q-card-section>
              <div class="text-h6">Настройка альтернативы</div>
              <div>{{ selectedAlt?.internalFactor }} и {{ selectedAlt?.externalFactor }}</div>
            </q-card-section>
            <q-card-section>
              <q-input v-model.number="selectedAltReveal.internal" type="number" label="% раскрытия внутреннего фактора" :rules="[val => val >= 0 && val <= 100 || 'Допустимо от 0 до 100']" />
              <q-input v-model.number="selectedAltReveal.external" type="number" label="% раскрытия внешнего фактора" :rules="[val => val >= 0 && val <= 100 || 'Допустимо от 0 до 100']" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Отмена" v-close-popup />
              <q-btn flat label="Сохранить" color="primary" @click="saveRevealPercentages" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showWarningDialog" persistent>
          <q-card style="width: 400px; max-width: 90%;">
            <q-card-section class="text-h6 text-negative">
              Внимание: Низкая разность между альтернативами
            </q-card-section>
            <q-card-section>
              Найдены альтернативы, у которых |d+ - d-| меньше {{ minDifferenceThreshold }}:
              <ul>
                <li v-for="(alt, i) in lowDifferenceAlternatives" :key="i">
                  A{{ i + 1 }} ({{ alt.internalFactor }} и {{ alt.externalFactor }}) —
                  Δ = {{ (Math.abs(alt.dplus - alt.dminus)).toFixed(3) }}
                </li>
              </ul>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="ОК" color="primary" v-close-popup />
                <q-btn flat label="Анализ чувствительности" color="orange" @click="openSensitivity" />
            </q-card-actions>
          </q-card>

        </q-dialog>

        <div class="q-mt-md row justify-end" v-if="!showAll">
          <q-btn label="ПОКАЗАТЬ ВСЕ" class="done-button" @click="handleDone" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const sessionName = ref('Название сессии')
    const tab = ref('alternatives')
    const router = useRouter()
    const role = localStorage.getItem('roles')

    const strongFactors = ref([])
    const weakFactors = ref([])
    const opportunityFactors = ref([])
    const threatFactors = ref([])
    const alternatives = ref([])
    const previousAlternatives = ref([])
    const showAll = ref(false)
    const showAltDialog = ref(false)
    const selectedAlt = ref(null)
    const selectedAltReveal = ref({ internal: 100, external: 100 })
    const revealMap = ref({})

    const alternativeDifference = ref(parseFloat(localStorage.getItem('alternativeDifference') || '0.15'))
    const minDifferenceThreshold = alternativeDifference
    const showWarningDialog = ref(false)
    const lowDifferenceAlternatives = ref([])
    const showSensitivityDialog = ref(false)
    const sensitivityResults = ref([])

    const openSensitivityDialog = () => {
      sensitivityResults.value = []
      for (let i = 0; i < sortedAlternatives.value.length; i++) {
        for (let j = i + 1; j < sortedAlternatives.value.length; j++) {
          const diff = Math.abs(sortedAlternatives.value[i].closeness - sortedAlternatives.value[j].closeness)
          if (diff < minDifferenceThreshold.value) {
            sensitivityResults.value.push({ index1: i, index2: j, diff })
          }
        }
      }
      showSensitivityDialog.value = true
    }


    const openSensitivity = () => {
      showSensitivityDialog.value = true
    }

    const fetchFactors = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId')
        const versionId = localStorage.getItem('versionId')
        const token = localStorage.getItem('token') // ← токен сохраняется после логина
        const response = await axios.get(`http://localhost:8080/api/v1/factors?sessionId=${sessionId}&versionId=${versionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const all = response.data
        strongFactors.value = all.filter(f => f.type === 'strong')
        weakFactors.value = all.filter(f => f.type === 'weak')
        opportunityFactors.value = all.filter(f => f.type === 'opportunity')
        threatFactors.value = all.filter(f => f.type === 'threat')
      } catch (err) {
        console.error('Ошибка загрузки факторов:', err)
      }
    }

    const fetchAlternatives = async () => {
      const selectedFromStorage = JSON.parse(localStorage.getItem('selectedFactors') || '[]')
      const token = localStorage.getItem('token') // ← токен сохраняется после логина
      const { data } = await axios.post('http://localhost:8080/v1/session/alternatives', selectedFromStorage, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      previousAlternatives.value = data
    }

    const handleDone = async () => {
      const token = localStorage.getItem('token') // ← токен сохраняется после логина
      const { data } = await axios.get('http://localhost:8080/v1/session/alternatives', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alternatives.value = data
      showAll.value = true

      // Сравнение d* между всеми парами альтернатив
      const pairs = []
      for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
          const d1 = data[i].closeness ?? 0
          const d2 = data[j].closeness ?? 0
          const diff = Math.abs(d1 - d2)
          if (diff < minDifferenceThreshold.value) {
            pairs.push([i, j])
          }
        }
      }

      lowDifferenceAlternatives.value = pairs

      if (pairs.length > 0) {
        showWarningDialog.value = true
      }
    }

    const finishSession = async () => {
      const token = localStorage.getItem('token')
      const sessionId = localStorage.getItem('sessionId')
      await axios.post(`http://localhost:8080/v1/session/complete/${sessionId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const versionId = localStorage.getItem('versionId')
      router.push(`/history/version/${versionId}`)
    }


    const openAltDialog = (alt) => {
      selectedAlt.value = alt
      const key = `${alt.internalFactor}|${alt.externalFactor}`
      const prev = revealMap.value[key] || { internal: 100, external: 100 }
      selectedAltReveal.value = { ...prev }
      showAltDialog.value = true
    }

    const saveRevealPercentages = () => {
      const alt = selectedAlt.value
      const key = `${alt.internalFactor}|${alt.externalFactor}`
      revealMap.value[key] = { ...selectedAltReveal.value }
      showAltDialog.value = false
    }

    const recalculateAlternatives = async () => {
      const sessionId = localStorage.getItem('sessionId')
      const versionId = localStorage.getItem('versionId')
      const token = localStorage.getItem('token')

      // Составляем массив раскрытий
      const revealArray = Object.entries(revealMap.value).map(([key, value]) => {
        const [internal, external] = key.split('|')
        return {
          internal,
          external,
          internalPercent: value.internal,
          externalPercent: value.external
        }
      })

      const payload = {
        sessionId,
        versionId,
        revealList: revealArray
      }

      try {
        const { data } = await axios.post(
          'http://localhost:8080/api/session/recalculate',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log('Ответ от бэкенда:', data)

        alternatives.value = data        // ⬅️ Обновляем реактивное состояние
        showAll.value = true             // ⬅️ Включаем отображение обновлённых альтернатив

      } catch (err) {
        console.error('Ошибка при пересчёте:', err)
      }
    }



    const isOldAlternative = (alt) => {
      return previousAlternatives.value.some(
        old => old.internalFactor === alt.internalFactor && old.externalFactor === alt.externalFactor
      )
    }

    const getFactorNumber = factor => factor.massCenter ? factor.massCenter.toFixed(2) : '-'

    const combinedAlternatives = computed(() => showAll.value ? alternatives.value : previousAlternatives.value)
    const sortedAlternatives = computed(() => [...combinedAlternatives.value].sort((a, b) => b.closeness - a.closeness))


    const showSensitivityButton = computed(() => lowDifferenceAlternatives.value.length > 0)

    const isSimilarAlternative = (alt) => {
      return lowDifferenceAlternatives.value.some(([i, j]) => {
        return [sortedAlternatives.value[i], sortedAlternatives.value[j]].some(a =>
          a.internalFactor === alt.internalFactor && a.externalFactor === alt.externalFactor
        )
      })
    }


    onMounted(async () => {
      await fetchFactors()
      await fetchAlternatives()
    })

    return {
      role,
      openSensitivity, sessionName,
      showSensitivityDialog,
      sensitivityResults,
      openSensitivityDialog,
      tab,
      strongFactors,
      weakFactors,
      opportunityFactors,
      threatFactors,
      getFactorNumber,
      alternatives,
      handleDone,
      showWarningDialog,
      lowDifferenceAlternatives,
      minDifferenceThreshold,
      showAll,
      previousAlternatives,
      isOldAlternative,
      combinedAlternatives,
      sortedAlternatives,
      finishSession,
      openAltDialog,
      saveRevealPercentages,
      showAltDialog,
      selectedAlt,
      selectedAltReveal,
      revealMap,
      recalculateAlternatives,
      showSensitivityButton,
      isSimilarAlternative,
      alternativeDifference
    }
  }
}
</script>

<style scoped>
.old-alt {
  background-color: #fff4c2 !important;
}
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
