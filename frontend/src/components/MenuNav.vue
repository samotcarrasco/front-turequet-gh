<script>
import { departamentosStore } from '@/stores/departamentos';
import { mapWritableState, mapState, mapActions } from 'pinia'

export default {
  computed: {
    ...mapState(departamentosStore, ['dptoActual']),
    ...mapState(departamentosStore, ['rolActual']),
    ...mapState(departamentosStore, ['departamentos']),
    ...mapState(departamentosStore, ['departamentosSiglas']),
    ...mapState(departamentosStore, ['dptoActualAPI'])

  },
  data() {
    return {
      roles: ['Unidad', 'Gestor']
    }
  },
  methods: {

    ...mapActions(departamentosStore, ['getDepartamentos']),
    ...mapActions(departamentosStore, ['getDeptoActualAPI']),


    cambiarDpto(event) {
      const storeDepto = departamentosStore();
      storeDepto.cambiarDpto(event.target.value)
    },

    cambiarRol(event) {
      const storeDepto = departamentosStore();
      storeDepto.cambiarRol(event.target.value)
      if (event.target.value === 'Gestor') {
       this.$router.push({ name: 'categorias' });
      } else this.$router.push({ name: 'materiales' });
    }
  },
  async created() {
    await this.getDepartamentos();
    //iniciamos la aplicación con rol gestor  
    
    
    await this.getDeptoActualAPI();
    console.log("DPTO ACTUAL API:" + this.dptoActualAPI)
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
          <!-- <li class="nav-item" v-if="rolActual != 'Gestor' && rolActual != null">
            <router-link class="nav-link" :to="{ name: 'materiales' }">Ver material</router-link>
          </li>
          <li class="nav-item" v-if="rolActual != 'Gestor' && rolActual != null">
            <router-link class="nav-link" :to="{ name: 'materiales' }">Aportar material</router-link>
          </li> -->
          <li class="nav-item" v-if="rolActual == 'Gestor'">
            <router-link class="nav-link" :to="{ name: 'categorias' }">Categorías</router-link>
          </li>
          <li class="nav-item" v-if="rolActual == 'Gestor'">
            <router-link class="nav-link" :to="{ name: 'categorias' }">Unidades</router-link>
          </li>
          <li class="nav-item" v-if="rolActual == 'Gestor'">
            <router-link class="nav-link" :to="{ name: 'estadisticas' }">Estadísticas</router-link>
          </li>
         </ul>
        <ul class="navbar-nav me-5">
           <li v-if="departamentosSiglas.length > 0
            && $route.name !== 'material'
            && rolActual != 'Gestor'">
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
</style>
