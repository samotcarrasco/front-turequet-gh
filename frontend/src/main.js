import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';

//componentes para rutas
import MaterialInfo from '@/components/ComponenteDummy.vue'
import MaterialesMain from '@/components/ComponenteDummy.vue'
import Categorias from '@/components/Categorias.vue'
import Estadisticas from '@/components/ComponenteDummy.vue'


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

//pinia
import { createPinia } from 'pinia'


//definimos objeto rutas
const routes = [
  {
    path: '/', component: MaterialesMain, name: 'home'
  },
  { path: '/materiales', component: MaterialesMain, name: 'materiales' },
  //{ path: '/material/:id/:tipoVista', component: MaterialInfo, name:'material' },
   {
     path: '/material/:id', component: MaterialInfo, name: 'material', props: true 
   },
   {
    path: '/material/:id',
    component: MaterialInfo,
    name: 'material',
   // props: route => ({ tipoVista: route.query.tipoVista })
  },
  { path: '/categorias', component: Categorias, name: 'categorias' },
  { path: '/estadisticas', component: Estadisticas, name: 'estadisticas' }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()


// library.add(faUser)
// library.add(faBoxesStacked)



const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(pinia)
app.use(ToastService);
//app.use(cors())

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')


