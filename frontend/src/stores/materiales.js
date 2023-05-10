import { defineStore } from 'pinia'
import { departamentosStore } from './departamentos.js'
import { mapState } from 'pinia'
import { getMateriales } from './api-service'
import { putMaterial } from './api-service'
import { getMaterialPorId } from './api-service'
//import { getCategoriaDe } from './api-service'


 
export const materialesStore = defineStore('materiales', {
  state: () => ({
    materiales: [],
    materialActual: undefined
    //materiales: fetchMateriales()
  }),
  getters: {
    ...mapState(departamentosStore, [ 'dptoActual' ]),
  },
  actions: {
    async getMateriales() {
      //la de dentro es la funcion importada
      await getMateriales().then(r => this.materiales = r.data._embedded.materiales)
    },
    // getMaterialPorId(id) {
    //   return this.materiales.find(m => m.id == id)
    // },
    
    async getMaterialPorId(id) {
      await getMaterialPorId(id).then(r => this.materialActual = r.data)
    },
    
    materialesDptoActual() {
    //  console.log('filtrando materiales por dpto:', this.dptoActual)
      return this.materiales.filter(material => material.dptoOfertante === this.dptoActual)
    },

    async putMaterial(material, id) {
      //la de dentro es la funcion importada
      await putMaterial(material, id);
    },

    async getCategoriaDeMaterial(id){
      await getCategoriaDeMaterial(id)
    }

  },
})