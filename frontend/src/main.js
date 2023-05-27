import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';

//componentes para rutas
import MaterialInfo from '@/components/MaterialInfo.vue'
import MaterialesMain from '@/components/MaterialesMain.vue'
import Categorias from '@/components/Categorias.vue'
import Estadisticas from '@/components/Estadisticas.vue'
import ComponenteDummy from '@/components/ComponenteDummy.vue'
import ComponenteInicio from '@/components/ComponenteInicio.vue'
import Unidades from '@/components/UnidadesMain.vue'

import Acuartelamientos2 from '@/components/Acuartelamientos2.vue'
import Departamentos2 from '@/components/Departamentos2.vue'


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
import { faUser ,faCoins} from '@fortawesome/free-solid-svg-icons'

//pinia
import { createPinia } from 'pinia'


//definimos objeto rutas
const routes = [
  {
    path: '/', component: ComponenteInicio, name: 'home'
  },
  { path: '/materiales', component: MaterialesMain, name: 'materiales' },
   {
     path: '/material/:id', component: MaterialInfo, name: 'material', props: true 
   },
  { path: '/categorias', component: Categorias, name: 'categorias' },
  { path: '/estadisticas', component: Estadisticas, name: 'estadisticas' },
  { path: '/dummy', component: ComponenteDummy, name: 'asdf' },
  { path: '/unidades', component: Unidades, name: 'unidades' },
  { path: '/dep2', component: Departamentos2, name: 'dep2' },
  { path: '/acu2', component: Acuartelamientos2, name: 'acu2' }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()


library.add(faUser)
library.add(faCoins)

// library.add(faBoxesStacked)

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(pinia)
app.use(ToastService)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')


