<script>
import { departamentosStore } from '@/stores/departamentos'
import { mapWritableState, mapState, mapActions } from 'pinia'
import ProgressSpinner from 'primevue/progressspinner'

export default {
 
  components: {
    ProgressSpinner
  },
  data() {
    return {
      roles: ['Departamento', 'Gestor'],
      loading: true 
    }
  },
  computed: {
    ...mapState(departamentosStore, ['dptoActual']),
    ...mapState(departamentosStore, ['rolActual']),
    ...mapState(departamentosStore, ['departamentos']),
    ...mapState(departamentosStore, ['departamentosSiglas']),
    ...mapState(departamentosStore, ['dptoActualAPI']),
//    ...mapState(departamentosStore, ['milisMenu']),
       //writable para que sea reactiva
    ...mapWritableState(departamentosStore, ['milisMenu']),

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),
    ...mapActions(departamentosStore, ['getBonificacion']),
    ...mapActions(departamentosStore, ['getDeptoActualAPI']),

    cambiarDpto(event) {
      const storeDepto = departamentosStore()
      storeDepto.cambiarDpto(event.target.value)
      console.log("milis", this.milisMenu)
      //this.getBonificacion(this.dptoActualAPI.id)
    },

    cambiarRol(event) {
      const storeDepto = departamentosStore()
      storeDepto.cambiarRol(event.target.value)
      if (event.target.value === 'Gestor') {
        this.$router.push({ name: 'categorias' })
      } else {
        this.$router.push({ name: 'materiales' })
        this.getDepartamentos()
        this.getDeptoActualAPI()
      }
    },

   
  },
  async created() {

    this.loading = true

    await this.getDepartamentos()
    //console.log("long dptos siglas:" + this.departamentosSiglas.length)
    //iniciamos la aplicación con rol gestor  

   // await this.getDeptoActualAPI()

    this.loading = false


    // console.log("DPTO ACTUAL API:" + this.dptoActualAPI)
    // console.log("DPTO ACTUAL API:" + this.dptoActualAPI._links.self.href)
    //iniciamos la aplicación con rol gestor  
  },
}
</script>

<template>
  <nav class="navbar navbar-expand-sm bg-dark fixed-top navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand">
        <router-link :to="{ name: 'home' }">
          <img class="logo" src="../assets/img/logos/logo.png" alt="Logo Truequet">
        </router-link>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-if="rolActual == 'Gestor'">
            <router-link class="nav-link" :to="{ name: 'categorias' }">Categorías</router-link>
          </li>
          <li class="nav-item" v-if="rolActual == 'Gestor'">
            <router-link class="nav-link" :to="{ name: 'unidades' }">Unidades</router-link>
          </li>
          <li class="nav-item" v-if="rolActual == 'Gestor'">
            <router-link class="nav-link" :to="{ name: 'estadisticas' }">Estadísticas</router-link>
          </li>
        </ul>
      </div>
      <div v-if="rolActual == 'Departamento' && milisMenu" class="milis-menu">
          {{ milisMenu }} μ
        </div>
      <div class="card flex justify-content-center" v-if="loading">
          <ProgressSpinner class="small-spinner"/>
        </div>
        <ul v-else class="navbar-nav me-5">
          <!-- <li class="milisMenu" v-if="getMilisUnidad > 0"> milis: {{ getMilisUnidad }} </li>  -->
          <li v-if="departamentosSiglas.length > 0
            && $route.name !== 'material'
            && rolActual == 'Departamento'">
            <!-- se puede quitar el evento @Change, porque el store es writable-->
            <select class="form-select mr-2" v-model="dptoActual" @change="cambiarDpto">
              <option v-for="dep in departamentosSiglas" :key="dep.id" :value="dep.siglas">{{ dep.siglas }}</option>
            </select>
          </li>
          <li>
            <select class="form-select mr-2" v-model="rolActual" @change="cambiarRol">
              <option v-for="(rol, index) in roles" :key="index" :value="rol">{{ rol }}</option>
            </select>
          </li>
        </ul>
    </div>
  </nav>
</template>

<style scoped>
/* .navbar-nav .nav-link {
  width: 100%;
} */
.fixed-top {
  position: relative
}
.textoDpto {
  color: white;
  align-self: center;
  margin-right: 2vw
}
.small-spinner {
  width: 45px; /* Ajusta el ancho del contenedor */
  height: 45px; /* Ajusta la altura del contenedor */
}

.milis-menu {
  background-color: #e6f1e8; /* Fondo verde militar claro */
  background-color: rgb(174, 190, 140);
  padding: 6px;
  border-radius: 8px;
  margin-right: 4px;
  border: 4px solid  #4b5320;
  font-weight: bold;
}
</style>