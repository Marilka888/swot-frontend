<template>
  <q-page class="q-pa-md">
    <q-header elevated class="bg-grey-2">
      <q-toolbar>
        <q-toolbar-title>
          {{ analysisTitle }}
        </q-toolbar-title>
      </q-toolbar>
      <div class="q-pa-sm row justify-between items-center">
        <q-btn flat label="Сессии" />
        <q-btn flat label="Стейкхолдеры" />
        <div>Компания "Роги и ноги"</div>
      </div>
    </q-header>

    <div class="row q-col-gutter-md">
      <div class="col-md-6 col-sm-12">
        <q-card class="bg-brown-7 text-white">
          <q-card-section>
            <div class="text-h6 text-center">Сильные стороны</div>
            <q-list separator>
              <q-item v-for="(factor, index) in strengths" :key="index" >
                <q-item-section>
                  {{ factor }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Добавить" color="white" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-md-6 col-sm-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Слабые стороны</div>
            <q-list separator>
              <q-item v-for="(factor, index) in weaknesses" :key="index">
                <q-item-section>
                  {{ factor }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Добавить" color="primary" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-md-6 col-sm-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Возможности</div>
            <q-list separator>
              <q-item v-for="(factor, index) in opportunities" :key="index">
                <q-item-section>
                  {{ factor }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Добавить" color="primary" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-md-6 col-sm-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-center">Угрозы</div>
            <q-list separator>
              <q-item v-for="(factor, index) in threats" :key="index">
                <q-item-section>
                  {{ factor }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Добавить" color="primary" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-mt-md">
      <q-btn unelevated label="Готово" color="grey" />
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MySwotAnalysis',
  data() {
    return {
      analysisTitle: 'Название Анализа',
      strengths: [
        'Фактор, который написал первый держатель котлеты',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты'
      ],
      weaknesses: [
        'Фактор, который написал первый держатель котлеты',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты'
      ],
      opportunities: [
        'Фактор, который написал первый держатель котлеты',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты'
      ],
      threats: [
        'Фактор, который написал первый держатель котлеты',
        'Фактор, который написал пятый держатель котлеты',
        'Фактор, который написал первый держатель котлеты'
      ]
    }
  }
});
</script>
