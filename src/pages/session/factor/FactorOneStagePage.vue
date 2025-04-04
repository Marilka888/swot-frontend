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
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Добавить"
                class="swot-button"
                @click="openAddDialog('strong')"
              />
            </div>
            <q-dialog v-model="addDialog" persistent>
              <q-card class="add-dialog">
                <q-card-section>
                  <div class="text-h6">Создание фактора</div>
                </q-card-section>

                <q-card-section>
                  <q-input v-model="newFactorName" label="Название фактора" />
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn class="swot-button" label="Отмена" @click="addDialog = false"/>
                  <q-btn class="swot-button" label="Создать" @click="addFactor" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="cell weak bg-light-grey" ref="weakCell">
            <div class="header">Слабые стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in weakFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Добавить"
                class="swot-button"
                color="info"
                text-color="white"
                @click="openAddDialog('weak')"
              />
            </div>
            <q-dialog v-model="addDialog" persistent>
              <q-card class="add-dialog">
                <q-card-section>
                  <div class="text-h6">Создание фактора</div>
                </q-card-section>

                <q-card-section>
                  <q-input v-model="newFactorName" label="Название фактора" />
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn class="swot-button" label="Отмена" @click="addDialog = false"/>
                  <q-btn class="swot-button" label="Создать" @click="addFactor" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="cell opportunities bg-light-grey" ref="opportunityCell">
            <div class="header">Возможности</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in opportunityFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Добавить"
                class="swot-button"
                color="info"
                text-color="white"
                @click="openAddDialog('opportunity')"
              />
            </div>
            <q-dialog v-model="addDialog" persistent>
              <q-card class="add-dialog">
                <q-card-section>
                  <div class="text-h6">Создание фактора</div>
                </q-card-section>

                <q-card-section>
                  <q-input v-model="newFactorName" label="Название фактора" />
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn class="swot-button" label="Отмена" @click="addDialog = false"/>
                  <q-btn class="swot-button" label="Создать" @click="addFactor" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="cell threats bg-dark-red" ref="threatCell">
            <div class="header">Угрозы</div>
            <ul class="centered-list q-mt-xs">

              <li v-for="(factor, index) in threatFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn
                label="Добавить"
                class="swot-button"
                @click="openAddDialog('threat')"
              />
            </div>
            <q-dialog v-model="addDialog" persistent>
              <q-card class="add-dialog">
                <q-card-section>
                  <div class="text-h6">Создание фактора</div>
                </q-card-section>

                <q-card-section>
                  <q-input v-model="newFactorName"
                           :rules="[ val => val !== null && val !== '' || 'Пожалуйста, введите значение' ]"
                           label="Название фактора" />
                </q-card-section>

                <q-card-actions align="around">  <!--  Изменено: align="around" -->
                  <q-btn class="toast-button" label="Отмена" @click="addDialog = false"/>
                  <q-btn class="toast-button" color="info" label="Создать"  @click="addFactor" />
                </q-card-actions>
              </q-card>
            </q-dialog>

          </div>
        </div>

        <div class="q-mt-md"> <!-- Контейнер для кнопки "Готово" -->
          <q-btn label="ГОТОВО" :to="'/session/factors/correct'" class="done-button"/>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      addDialog: false,
      newFactorName: '',
      activeSection: '',
      tab: 'factors',
      sessionName: 'Название сессии',
      gridWidth: 600,
      strongFactors: [
        'Квалифицированная команда разработчиков',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты',
      ],
      weakFactors: [
        'Квалифицированная команда разработчиков',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты',
      ],
      opportunityFactors: [
        'Квалифицированная команда разработчиков',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты',
      ],
      threatFactors: [
        'Квалифицированная команда разработчиков',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты',
      ],
    };
  },
  mounted() {
    this.adjustCellHeights(); // Вызываем метод при монтировании компонента
    window.addEventListener('resize', this.adjustCellHeights); // Вызываем при изменении размера окна
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustCellHeights);
  },
  methods: {
    adjustCellHeights() {
      this.$nextTick(() => {  // Ensure the DOM is updated before calculating heights
        const strongHeight = this.$refs.strongCell.offsetHeight;
        const weakHeight = this.$refs.weakCell.offsetHeight;
        const opportunityHeight = this.$refs.opportunityCell.offsetHeight;
        const threatHeight = this.$refs.threatCell.offsetHeight;

        const maxStrongWeakHeight = Math.max(strongHeight, weakHeight);
        const maxOpportunityThreatHeight = Math.max(opportunityHeight, threatHeight);

        this.$refs.strongCell.style.height = maxStrongWeakHeight + 'px';
        this.$refs.weakCell.style.height = maxStrongWeakHeight + 'px';
        this.$refs.opportunityCell.style.height = maxOpportunityThreatHeight + 'px';
        this.$refs.threatCell.style.height = maxOpportunityThreatHeight + 'px';
      });
    },
    openAddDialog(section) {
      this.activeSection = section;
      this.addDialog = true;
      this.newFactorName = '';
    },
    addFactor() {
      switch (this.activeSection) {
        case 'strong':
          this.strongFactors.push(this.newFactorName);
          break;
        case 'weak':
          this.weakFactors.push(this.newFactorName);
          break;
        case 'opportunity':
          this.opportunityFactors.push(this.newFactorName);
          break;
        case 'threat':
          this.threatFactors.push(this.newFactorName);
          break;
      }
      this.addDialog = false;
      this.adjustCellHeights(); // Пересчитываем высоты после добавления фактора
    },
  },
};
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
  width: auto;
  max-width: none;
  justify-content: center;
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

.centered-list {
  list-style-position: outside;
  width: 100%;
  margin-bottom: 0;
  padding-left: 16px;
  flex-grow: 1;
  margin-top: 16px; /* Добавляем отступ сверху списка */
  overflow-y: auto;
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
  font-weight: 500;  /*  Делаем текст немного жирнее  */
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
