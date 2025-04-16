const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'admin', component: () => import('pages/auth/AdminPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
      {path: '', component: () => import('pages/session/factor/FactorOneStagePage.vue')},
      {path: 'alternative', component: () => import('pages/session/alternatives/AlternativePage.vue')},
    ]
  },
  {
    path: '/session/factors',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/session/factor/FactorOneStagePage.vue')},
      {path: 'correct', component: () => import('pages/session/factor/FactorAdminStagePage.vue')},
      {path: 'all', component: () => import('pages/session/factor/FactorTwoStagePage.vue')},
    ]
  },
  {
    path: '/session/weights',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/session/weight/WeightOneStagePage.vue')},
      {path: 'all', component: () => import('pages/session/weight/WeightTwoStagePage.vue')},
    ]
  },
  {
    path: '/session/alternatives',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/session/alternatives/AlternativePage.vue')},
      {path: 'all', component: () => import('pages/session/alternatives/ResultAlternativePage.vue')},
    ]
  },
  {
    path: '/history',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':sessionId', component: () => import('pages/history/SessionPage.vue'), meta: {requiresAuth: true}},
      {path: 'all', component: () => import('pages/history/AllSessionPage.vue'), meta: {requiresAuth: true}},

      {path: '', component: () => import('pages/session/alternatives/AlternativePage.vue')},
      {path: 'all', component: () => import('pages/session/alternatives/WeightTwoStagePage.vue')},
    ]
  },
  // {
  //   path: '/login',
  //   component: () => import('layouts/LoginLayout.vue'),
  //   children: [
  //     {path: '', component: () => import('pages/Login.vue')}
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
