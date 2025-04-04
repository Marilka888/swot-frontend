<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container style="padding-top: 70pt">
      <q-page class="q-pa-md flex column items-center">
        <div class="text-h6 q-mb-md" style="text-transform:uppercase">{{ sessionName }}</div>

        <div class="q-tabs-container">
          <q-tabs v-model="tab" class="bg-grey-3 text-black non-selectable-tabs tab-text-size" dense>
            <q-tab name="factors" label="ФАКТОРЫ"/>
            <q-tab name="strength" label="СИЛА ФАКТОРОВ"/>
            <q-tab name="alternatives" label="АЛЬТЕРНАТИВЫ"/>
            <q-tab name="results" label="РЕЗУЛЬТАТЫ"/>
          </q-tabs>
        </div>

        <div class="grid-analysis q-mt-md" style="align-items: center; justify-content: center">
          <div class="cell strong bg-dark-blue" ref="strongCell">
            <div class="header">Сильные стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in strongFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn label="Изменить" class="swot-button" @click="openEditDialog('strong')"/>
            </div>
          </div>
          <div class="cell weak bg-light-grey" ref="weakCell">
            <div class="header">Слабые стороны</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in weakFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn label="Изменить" color="info" class="swot-button" @click="openEditDialog('weak')"/>
            </div>
          </div>
          <div class="cell opportunities bg-light-grey" ref="opportunityCell">
            <div class="header">Возможности</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in opportunityFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn label="Изменить" color="info" class="swot-button" @click="openEditDialog('opportunity')"/>
            </div>
          </div>
          <div class="cell threats bg-dark-red" ref="threatCell">
            <div class="header">Угрозы</div>
            <ul class="centered-list q-mt-xs">
              <li v-for="(factor, index) in threatFactors" :key="index" class="list-item-small">
                {{ factor }}
              </li>
            </ul>
            <div class="q-pt-md add-button-container">
              <q-btn label="Изменить" class="swot-button" @click="openEditDialog('threat')"/>
            </div>
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn label="ГОТОВО" :to="'/session/weights'" class="done-button"/>
        </div>

        <!-- Edit Factor Dialog -->
        <q-dialog v-model="editDialog">
          <q-card class="edit-dialog-card">
            <q-card-section class="text-center">
              <div class="text-h5">Изменение факторов</div>
              <div class="text-subtitle1" v-if="activeSection === 'strong'">Сильные стороны</div>
              <div class="text-subtitle1" v-else-if="activeSection === 'weak'">Слабые стороны</div>
              <div class="text-subtitle1" v-else-if="activeSection === 'opportunity'">Возможности</div>
              <div class="text-subtitle1" v-else-if="activeSection === 'threat'">Угрозы</div>
            </q-card-section>

            <q-card-section>
              <div v-for="(factor, index) in editableFactors" :key="index" class="q-mb-sm">
                <q-item bordered rounded class="factor-item">
                  <q-item-section style="width: 80%; overflow-wrap: anywhere;">
                    <q-input v-model="editableFactors[index]"
                             :rules="[ val => val !== null && val !== '' || 'Пожалуйста, введите значение' ]"
                             borderless dense/>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn icon="delete" color="red" flat rounded class="delete-button" @click="deleteFactor(index)">
                      <q-icon name="delete" color="white"></q-icon>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </div>
            </q-card-section>

            <q-card-actions align="around">  <!--  Изменено: align="around" -->
              <q-btn class="toast-button" label="Отмена" @click="editDialog = false"/>
              <q-btn class="toast-button" color="info" label="Изменить" @click="saveFactors"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import {ref} from 'vue';

export default {
  setup() {
    const strongFactors = ref([
      'Квалифицированная команда разработчиков',
      'Фактор, который написал пятый держатель котлеты',
      'Фактор, который написал первый держатель котлеты',
    ]);
    const weakFactors = ref([
      'Квалифицированная команда разработчиков',
      'Фактор, который написал пятый держатель котлеты',
      'Фактор, который написал первый держатель котлеты',
    ]);
    const opportunityFactors = ref([
      'Квалифицированная команда разработчиков',
      'Фактор, который написал пятый держатель котлеты',
      'Фактор, который написал первый держатель котлеты',
    ]);
    const threatFactors = ref([
      'Квалифицированная команда разработчиков',
      'Фактор, который написал пятый держатель котлеты',
      'Фактор, который написал первый держатель котлеты',
    ]);
    const editDialog = ref(false);
    const tab = ref('factors');
    const activeSection = ref('');
    const editableFactors = ref([]);
    const sessionName = ref('Название сессии');

    const openEditDialog = (section) => {
      activeSection.value = section;
      editDialog.value = true;
      editableFactors.value = section === 'strong' ? [...strongFactors.value] :
        section === 'weak' ? [...weakFactors.value] :
          section === 'opportunity' ? [...opportunityFactors.value] :
            [...threatFactors.value];
    };

    const saveFactors = () => {
      if (activeSection.value === 'strong') strongFactors.value = [...editableFactors.value];
      else if (activeSection.value === 'weak') weakFactors.value = [...editableFactors.value];
      else if (activeSection.value === 'opportunity') opportunityFactors.value = [...editableFactors.value];
      else threatFactors.value = [...editableFactors.value];
      editDialog.value = false;
    };

    const deleteFactor = (index) => {
      editableFactors.value.splice(index, 1);
    };

    return {
      tab,
      strongFactors,
      weakFactors,
      opportunityFactors,
      threatFactors,
      editDialog,
      activeSection,
      editableFactors,
      sessionName,
      openEditDialog,
      saveFactors,
      deleteFactor,
    };
  },
};
</script>

<style>
.edit-dialog-card {
  width: 600px;
  max-width: 90%;
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

.factor-item {
  background-color: #f0f0f0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.factor-item .q-item__section--side {
  display: flex;
  align-items: center;
}

.delete-button {
  color: white;
  background: #81151d;
  border-radius: 5px;
  padding: 5px 21px 5px 0px;
  text-transform: none;
  font-weight: 500;
  font-size: 0.9em;
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

.q-card-actions-custom {
  justify-content: center; /* Центрируем кнопки по горизонтали */
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

