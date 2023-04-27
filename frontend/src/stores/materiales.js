import { defineStore } from 'pinia'
import { storeDptoActual } from './dptoActual'
import { mapState } from 'pinia'
import { getMateriales } from './api-service'
import { getMaterialPorIdS } from './api-service'
import axios from "axios"


 
export const materialesStore = defineStore('materiales', {
  state: () => ({
    materiales: [],
    materialActual: undefined
    //materiales: fetchMateriales()
  }),
  getters: {
    ...mapState(storeDptoActual, [ 'dptoActual' ]),
    
    // getMateriales(state){
    //   return state.materiales
    // }
  },
  actions: {
    async getMateriales() {
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

    getNumeroMaterialesPorCategoria() {
      //console.log("accediendo a getNumeroMaterialesPorCategoria")
      const categorias = {}
      this.materiales.forEach(material => {
        if (!categorias[material.categoria]) {
         // console.log(material.categoria)
          categorias[material.categoria] = 0
        }
        categorias[material.categoria]++
      })
      //console.log(categorias["Silla"])
      return categorias
    }
  },
})