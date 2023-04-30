import { defineStore } from 'pinia'
import { departamentosStore } from './departamentos.js'
import { mapState } from 'pinia'
import { getMateriales } from './api-service'
import { putMaterial } from './api-service'
import { getMaterialPorIdS } from './api-service'


 
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
    getMaterialPorId(id) {
      return this.materiales.find(m => m.id == id)
    },
    
    async getMaterialPorIdS(id) {
      await getMaterialPorIdS(id).then(r => this.amterialActual = r.data._data)
    },
    
    materialesDptoActual() {
    //  console.log('filtrando materiales por dpto:', this.dptoActual)
      return this.materiales.filter(material => material.dptoOfertante === this.dptoActual)
    },

    async putMaterial(material, id) {
      //la de dentro es la funcion importada
      await putMaterial(material, id);
    },
    // getNumeroMaterialesPorCategoria() {
    //   //console.log("accediendo a getNumeroMaterialesPorCategoria")
    //   const categorias = {}
    //   this.materiales.forEach(material => {
    //     if (!categorias[material.categoria]) {
    //      // console.log(material.categoria)
    //       categorias[material.categoria] = 0
    //     }
    //     categorias[material.categoria]++
    //   })
    //   //console.log(categorias["Silla"])
    //   return categorias
    // }
  },
})