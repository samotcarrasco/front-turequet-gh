import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';

//componentes lazy para rutas
const MaterialInfo = () => import('@/components/MaterialInfo.vue')
const MaterialesMain = () => import('@/components/MaterialesMain.vue')
const Categorias = () => import('@/components/Categorias.vue')
const Estadisticas = () => import('@/components/Estadisticas.vue')
const Unidades = () => import('@/components/UnidadesMain.vue')

//Home lo cargamos siempre
import Home from '@/components/ComponenteInicio.vue'

//Bootstrap
 import 'bootstrap/dist/css/bootstrap.css'
 

//Primevue
//import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'

//tema personalizado creado desde el editor de temas de primevue
import '@/scss/tema-verde-militar.css'

//Vue-router
import { createRouter, createWebHashHistory } from 'vue-router'
//Iconos fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//import { faFutbolBall, faMobile, faSquareFull, faUser, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import { faUser ,faCoins, faEnvelope, faPhone, faAddressCard, faDolly} from '@fortawesome/free-solid-svg-icons'

//pinia
import { createPinia } from 'pinia'


//definimos objeto rutas
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
  { path: '/unidades', component: Unidades, name: 'unidades' }
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

// library.add(faBoxesStacked)

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(pinia)
app.use(ToastService)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')


