import { defineStore, mapState } from 'pinia'
import { departamentosStore } from './departamentos.js'
import { getMateriales, getMaterialPorId, putMaterial } from './api-service'


export const materialesStore = defineStore('materiales', {
  state: () => ({
    materiales: [],
    materialActual: undefined
  }),
  getters: {
    ...mapState(departamentosStore, ['dptoActual']),
  },
  actions: {
    async getMateriales() {
      await getMateriales().then(r => this.materiales = r.data._embedded.materiales)
    },

    async getMaterialPorId(id) {
      await getMaterialPorId(id).then(r => this.materialActual = r.data)
    },

    getMaterialesOfertados() {
      return this.materiales.filter((material) => material.estado === "disponible" && material.dptoOfertaN == this.dptoActual)
    },

    getMaterialesDisponibles() {
      return this.materiales.filter((material) => material.estado === "disponible" && material.dptoOfertaN !== this.dptoActual && this.dptoActual)
    },

    getMaterialesPendientes() {
      return this.materiales.filter((material) => (material.estado === "pendiente entrega" || material.estado === "pendiente recepcion") &&
        (material.dptoAdquisicionN == this.dptoActual || material.dptoOfertaN == this.dptoActual))
    },

    getMaterialesEntregados(){
      return this.materiales.filter((material) => (material.estado === "recepcionado" || material.estado === "entregado") &&
      (material.dptoAdquisicionN == this.dptoActual || material.dptoOfertaN == this.dptoActual))
    },

    async getCategoriaDeMaterial(id) {
      await getCategoriaDeMaterial(id)
    },
    async putMaterial(material, id) {
      await putMaterial(material, id);
    },

  },
})