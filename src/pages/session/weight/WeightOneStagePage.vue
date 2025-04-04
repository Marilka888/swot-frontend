<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div class="text-h6 q-mb-md" style="text-transform:uppercase">{{ sessionName }}</div>

        <div class="q-tabs-container">
          <q-tabs
            v-model="tab"
            class="bg-grey-3 text-black non-selectable-tabs tab-text-size"
            dense
          >
            <q-tab name="factors" label="ФАКТОРЫ" />
            <q-tab name="strength" label="СИЛА ФАКТОРОВ" />
            <q-tab name="alternatives" label="АЛЬТЕРНАТИВЫ" />
            <q-tab name="results" label="РЕЗУЛЬТАТЫ" />
          </q-tabs>
        </div>

        <div
          class="grid-analysis q-mt-md"
          style="align-items: center; justify-content: center"
        >
          <div class="cell strong bg-dark-blue" ref="strongCell">
            <div class="header">Сильные стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in strongFactors" :key="index" class="list-item-small">
                {{ factor.name }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Определить вес"
                class="swot-button"
                @click="openWeightDialog('strong')"
              />
            </div>
          </div>
          <div class="cell weak bg-light-grey" ref="weakCell">
            <div class="header">Слабые стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in weakFactors" :key="index" class="list-item-small">
                {{ factor.name }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Определить вес"
                class="swot-button"
                color="info"
                text-color="white"
                @click="openWeightDialog('weak')"
              />
            </div>
          </div>
          <div class="cell opportunities bg-light-grey" ref="opportunityCell">
            <div class="header">Возможности</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in opportunityFactors" :key="index" class="list-item-small">
                {{ factor.name }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Определить вес"
                class="swot-button"
                color="info"
                text-color="white"
                @click="openWeightDialog('opportunity')"
              />
            </div>
          </div>
          <div class="cell threats bg-dark-red" ref="threatCell">
            <div class="header">Угрозы</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in threatFactors" :key="index" class="list-item-small">
                {{ factor.name }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Определить вес"
                class="swot-button"
                @click="openWeightDialog('threat')"
              />
            </div>
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn label="ГОТОВО" :to="'/session/weights/all'" class="done-button"/>
        </div>

        <!-- Generic Weight Dialog -->
        <q-dialog v-model="showWeightDialog">
          <q-card class="add-dialog">
            <q-card-section>
              <div class="text-h6">Определение веса</div>
              <div class="text-subtitle1">{{ dialogTitle }}</div>
            </q-card-section>

            <q-card-section>
              <div v-if="currentFactors">
                <div v-for="(factor, index) in currentFactors" :key="index">
                  <div>{{ factor.name }}</div>
                  <div>крайние значения</div>
                  <q-range
                    v-model="factor.weights.extreme"
                    :min="1"
                    :max="10"
                    :step="1"
                    color="primary"
                    :left-label="factor.weights.extreme.min"
                    :right-label="factor.weights.extreme.max"
                    @update:model-value="(val) => { adjustRanges(factor); }"
                  />
                  <div>наиболее возможные значения</div>
                  <q-range
                    v-model="factor.weights.expected"
                    :min="1"
                    :max="10"
                    :step="1"
                    color="secondary"
                    :left-label="factor.weights.expected.min"
                    :right-label="factor.weights.expected.max"
                    @update:model-value="(val) => { adjustRanges(factor); }"
                  />
                  <br>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn class="swot-button" label="Отмена" color="primary" v-close-popup />
              <q-btn class="swot-button" label="Сохранить" color="primary" @click="saveWeights" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue'

export default defineComponent({
  components: {
  },
  setup() {
    const sessionName = ref('Название сессии');
    const tab = ref('strength');
    const gridWidth = ref(600);

    const strongCell = ref(null);
    const weakCell = ref(null);
    const opportunityCell = ref(null);
    const threatCell = ref(null);
    const strongFactors = ref([
      { name: 'Квалифицированная команда разработчиков', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
    ]);
    const weakFactors = ref([
      { name: 'Квалифицированная команда разработчиков', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
    ]);
    const opportunityFactors = ref([
      { name: 'Квалифицированная команда разработчиков', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
    ]);
    const threatFactors = ref([
      { name: 'Квалифицированная команда разработчиков', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
      { name: 'Фактор, который написал пятый держатель котлеты', weights: { extreme: { min: 1, max: 10 }, expected: { min: 1, max: 10 } } },
    ]);

    // Общий диалог для определения веса
    const showWeightDialog = ref(false);
    const dialogTitle = ref('');
    const currentFactorType = ref(null); // 'strong', 'weak', 'opportunity', 'threat'
    const currentFactors = ref([]);

    // Флаг, показывающий, были ли изменены веса
    const weightsChanged = ref(false);

    const openWeightDialog = (type) => {
      currentFactorType.value = type;
      switch (type) {
        case 'strong':
          currentFactors.value = strongFactors.value;
          dialogTitle.value = 'Сильные стороны';
          break;
        case 'weak':
          currentFactors.value = weakFactors.value;
          dialogTitle.value = 'Слабые стороны';
          break;
        case 'opportunity':
          currentFactors.value = opportunityFactors.value;
          dialogTitle.value = 'Возможности';
          break;
        case 'threat':
          currentFactors.value = threatFactors.value;
          dialogTitle.value = 'Угрозы';
          break;
      }
      showWeightDialog.value = true;
    };

    const updateExtreme = (factor, val) => {
      factor.weights.extreme.min = Math.min(val[0], val[1]);
      factor.weights.extreme.max = Math.max(val[0], val[1]);
      adjustRanges(factor);
    }

    const updateExpected = (factor, val) => {
      factor.weights.expected.min = Math.min(val[0], val[1]);
      factor.weights.expected.max = Math.max(val[0], val[1]);
      adjustRanges(factor);
    }

    const adjustRanges = (factor) => {
      let extremeMin = factor.weights.extreme.min;
      let extremeMax = factor.weights.extreme.max;
      let expectedMin = factor.weights.expected.min;
      let expectedMax = factor.weights.expected.max;

      // Ensure expected is within extreme
      if (expectedMin < extremeMin) {
        expectedMin = extremeMin;
      }
      if (expectedMax > extremeMax) {
        expectedMax = extremeMax;
      }

      // Ensure extreme contains expected
      if (extremeMin > expectedMin) {
        extremeMin = expectedMin;
      }
      if (extremeMax < expectedMax) {
        extremeMax = expectedMax;
      }

      factor.weights = {
        extreme: { min: extremeMin, max: extremeMax },
        expected: { min: expectedMin, max: expectedMax }
      };
    };

    const saveWeights = () => {
      showWeightDialog.value = false;
      currentFactorType.value = null;
      currentFactors.value = [];

      // Устанавливаем флаг weightsChanged в true
      weightsChanged.value = true;
    };

    const adjustCellHeights = () => {
      if (strongCell.value && weakCell.value && opportunityCell.value && threatCell.value) {
        const strongHeight = strongCell.value.offsetHeight;
        const weakHeight = weakCell.value.offsetHeight;
        const opportunityHeight = opportunityCell.value.offsetHeight;
        const threatHeight = threatCell.value.offsetHeight;

        const maxStrongWeakHeight = Math.max(strongHeight, weakHeight);
        const maxOpportunityThreatHeight = Math.max(opportunityHeight, threatHeight);
        strongCell.value.style.height = maxStrongWeakHeight + 'px';
        weakCell.value.style.height = maxStrongWeakHeight + 'px';
        opportunityCell.value.style.height = maxOpportunityThreatHeight + 'px';
        threatCell.value.style.height = maxOpportunityThreatHeight + 'px';
      }
    };

    onMounted(() => {
      adjustCellHeights();
      window.addEventListener('resize', adjustCellHeights);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', adjustCellHeights);
    });

    return {
      strongFactors,
      weakFactors,
      opportunityFactors,
      threatFactors,
      sessionName,
      tab,
      gridWidth,
      strongCell,
      weakCell,
      opportunityCell,
      threatCell,
      adjustCellHeights,

      showWeightDialog,
      dialogTitle,
      currentFactors,
      currentFactorType,
      openWeightDialog,
      saveWeights,
      adjustRanges,
      updateExtreme,
      updateExpected,

    }
  }
})
</script>

<style scoped>
/* You can add custom styles here */
ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

li {
  padding: 2px 0;
}

/* Match column widths (optional) */
.col-6 {
  width: 50%; /* Enforces equal column widths */
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
  width: auto;
  max-width: none;
  justify-content: center;
  transition: background-color 0.3s ease, opacity 0.3s ease; /* Add transition */
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
  overflow-y: auto; /* Включает вертикальную прокрутку */
  max-height: 200px; /* Задайте желаемую максимальную высоту */
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

.add-button-container {
  text-align: center;
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

/* Вернем отступ слева для списка */

.cell li {
  text-align: left;
  font-weight: 500;

/*  Делаем текс
т немного жирнее  */
  font-size: 0.8em;
  word-wrap: break-word;
  margin-bottom: 8px;
}

.list-item-small {
  word-wrap: break-word;
  margin-bottom: 8px;
  font-weight: 500;  /*  Делаем текст немного жирнее  */
}

/* Текст табов такого же размера, как и текст списка */
.tab-text-size .q-tab__label {
  font-size: 0.9em;
  font-weight: 500;
  text-transform: none;
}

/* Стиль для центрирования кнопки "Добавить" */
.add-button-container {
  text-align: center;
  margin-top: auto; /* добавлено */
  margin-bottom: 8px; /* добавлено */
}

/* Стиль для диалогового окна */
.add-dialog {
  width: 400px; /* Задайте желаемую ширину */
  max-width: 90%; /* чтобы не вылезать за пределы экрана на маленьких устройствах */
}

/* Добавляем отступы внутри диалогового окна */
.add-dialog .q-card-actions {
  justify-content: space-between; /* Кнопки по краям */
  padding: 16px;
}

/* Центрируем кнопки в диалоговом окне и задаем им стиль */
.add-dialog .q-card-actions {
  justify-content: center; /* Центрируем кнопки по горизонтали */
  padding: 16px;
}

.add-dialog .q-card-actions .q-btn {
  margin: 0 8px; /* добавляем отступ между кнопками */
}

.q-tabs-container {
  width: 810px; /*  Ширина квадрата + gap  */
  margin-bottom: 10px;  /* Отступ снизу */
}

/*стиль для кнопок*/
.swot-button {
  color: black;
  background: #dedede;
  border-radius: 20px;
  padding: 5px 15px;
  text-transform: none;
  font-weight: 500;
  font-size: 0.9em;
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

.toast-button {
  color: white;
  background: #81151d;
  border-radius: 5px;
  padding: 35px 45px;
  text-transform: none;
  font-weight: 1500;
  font-size: 1em;
  width: 150px;
}
</style>
