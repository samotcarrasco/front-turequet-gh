import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';

const MaterialInfo = () => import('@/components/MaterialInfo.vue')
const MaterialesMain = () => import('@/components/MaterialesMain.vue')
const Categorias = () => import('@/components/Categorias.vue')
const Estadisticas = () => import('@/components/Estadisticas.vue')
const Unidades = () => import('@/components/UnidadesMain.vue')
const NotFound = () => import('@/components/NotFound.vue')
import Home from '@/components/ComponenteInicio.vue'

import * as bootstrap from 'bootstrap'
import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
//tema personalizado creado desde el editor de temas de primevue
import '@/scss/tema-verde-militar.css'
import '@/scss/custom-style.css'
import '@/scss/styles.scss'

import { createRouter, createWebHashHistory } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser ,faCoins, faEnvelope, faPhone, faAddressCard, faDolly} from '@fortawesome/free-solid-svg-icons'
import { createPinia } from 'pinia'

const routes = [
  {
    path: '/', component: Home, name: 'home'
  },
  { path: '/materiales', component: MaterialesMain, name: 'materiales' },
   {
     path: '/material/:id', component: MaterialInfo, name: 'material', props: true 
   },
  { path: '/categorias', component: Categorias, name: 'categorias' },
  { path: '/estadisticas', component: Estadisticas, name: 'estadisticas' },
  { path: '/unidades', component: Unidades, name: 'unidades' },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()

library.add(faUser)
library.add(faCoins)
library.add(faPhone)
library.add(faAddressCard)
library.add(faEnvelope)
library.add(faDolly)

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(pinia)
app.use(ToastService)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')


