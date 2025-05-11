const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/history/HistoryPage.vue') },
      // { path: '', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'admin', component: () => import('pages/auth/AdminPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
      {path: '', component: () => import('pages/session/factor/FactorOneStagePage.vue')},
      {path: 'alternative', component: () => import('pages/session/alternatives/AlternativePage.vue')},
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/UserPage.vue') },
    ]
  },
  {
    path: '/history',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/history/HistoryPage.vue') },
      { path: ':sessionId', component: () => import('pages/history/SessionPage.vue') }
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
      {path: '', component: () => import('pages/session/alternatives/AlternativePage.vue')},
      {path: 'version/:versionId', component: () => import('pages/session/alternatives/ResultAlternativePage.vue')},
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/LoginPage.vue') }
    ],
    meta: { public: true }
  },
  {
    path: '/change-password',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/ChangePasswordPage.vue') }
    ],
    meta: { public: true }
  }


  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
