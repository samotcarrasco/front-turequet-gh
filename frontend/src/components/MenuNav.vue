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
    ...mapWritableState(departamentosStore, ['dptoActual']),
    ...mapWritableState(departamentosStore, ['rolActual']),
    ...mapWritableState(departamentosStore, ['milisMenu']),
    ...mapState(departamentosStore, ['departamentos']),
    ...mapState(departamentosStore, ['departamentosSiglas']),
    ...mapState(departamentosStore, ['dptoActualAPI']),
    

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),
    ...mapActions(departamentosStore, ['getBonificacion']),
    
    cambiarDpto(event) {
      const storeDepto = departamentosStore()
      storeDepto.cambiarDpto(event.target.value)
   },

    cambiarRol(event) {
      const storeDepto = departamentosStore()
      storeDepto.cambiarRol(event.target.value)
      if (event.target.value === 'Gestor') {
        this.$router.push({ name: 'categorias' })
      } else {
        this.$router.push({ name: 'materiales' })
        this.getDepartamentos()
       }
    },
  },
  
  async created() {
    this.loading = true
    await this.getDepartamentos()
    this.loading = false
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
.fixed-top {
  position: relative
}
.textoDpto {
  color: white;
  align-self: center;
  margin-right: 2vw
}


.milis-menu {
  background-color: #e6f1e8; 
  background-color: rgb(174, 190, 140);
  padding: 6px;
  border-radius: 8px;
  margin-right: 4px;
  border: 4px solid  #4b5320;
  font-weight: bold;
}
</style>