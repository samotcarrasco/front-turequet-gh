import { defineStore } from 'pinia'
import { getDepartamentos } from './api-service'


export const departamentosStore = defineStore('departamentos', {
  state: () => ({
    departamentos: [],
    departamentosSiglas: [],
    dptoActual: undefined,
    rolActual: undefined
  }),

  actions: {
    cambiarDpto(departamento) {
      this.dptoActual = departamento
      console.log("dpto actual:", departamento)
    },

    cambiarRol(rol) {
      this.rolActual = rol
      console.log("Cambiado rol", rol)
    },

    async getDepartamentos() {
      //la de dentro es la funcion importada
      await getDepartamentos().then(r => {
        this.departamentos = r.data._embedded.departamentos;
        this.departamentosSiglas = this.departamentos.map(dpto => {
          return { id: dpto.id, siglas: dpto.abreviatura };
        });
      });
    },

  }
})