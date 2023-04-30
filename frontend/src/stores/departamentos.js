import { defineStore } from 'pinia'
import { getDepartamentos, getDeptoPorSiglas } from './api-service'


export const departamentosStore = defineStore('departamentos', {
  state: () => ({
    // departamentos: [],
    departamentosSiglas: [],
    dptoActual: undefined,
    dptoActualAPI: undefined,
    rolActual: undefined
  }),

  actions: {
    cambiarDpto(departamento) {
      this.dptoActual = departamento
      console.log("dpto actual:", departamento)
      console.log("dpto API:", this.dptoActualAPI)
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
    
    async getDeptoActualAPI() {
      console.log("DENTRODEL ASYNC getDeptoActualAPI"+ this.dptoActual)
      //la de dentro es la funcion importada
      await getDeptoPorSiglas(this.dptoActual).then(r => {
        console.log("RESPUESTA DE LA API", r); // Imprime la respuesta completa de la API
        this.dptoActualAPI = r.data._links.self.href;
        console.log("DEPARTAMENTO ACTUAL RECUPERADO", this.dptoActualAPI);
      });
    },
  }
})