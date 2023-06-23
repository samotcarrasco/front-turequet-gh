import { defineStore, mapState } from 'pinia'
import { departamentosStore } from './departamentos.js'
import { getMateriales, getMaterialPorId, putMaterial } from './api-service'

 
export const materialesStore = defineStore('materiales', {
  state: () => ({
    materiales: [],
    materialActual: undefined
  }),
  getters: {
    ...mapState(departamentosStore, [ 'dptoActual' ]),
  },
  actions: {
    async getMateriales() {
      await getMateriales().then(r => this.materiales = r.data._embedded.materiales)
    },  

    async getMaterialPorId(id) {
      await getMaterialPorId(id).then(r => this.materialActual = r.data)
    },
    
    materialesDptoActual() {
      return this.materiales.filter(material => material.dptoOfertante === this.dptoActual)
    },

    async getCategoriaDeMaterial(id){
      await getCategoriaDeMaterial(id)
    },
    async putMaterial(material, id) {
      await putMaterial(material, id);
    },

  },
})