import { defineStore } from 'pinia'
import { getDepartamentos, getDeptoPorSiglas, putAumentarCretido, getEmpleos } from './api-service'


export const departamentosStore = defineStore('departamentos', {
  state: () => ({
    departamentos: [],
    departamentosSiglas: [],
    dptoActual: undefined,
    dptoActualAPI: undefined,
    rolActual: undefined,
    empleos: []
  }),

  actions: {
    cambiarDpto(departamento) {
      this.dptoActual = departamento
      console.log("dpto actual:", departamento)
      this.getDeptoActualAPI(departamento);
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
    
    async getDeptoActualAPI(departamento) {
      //console.log("DENTRODEL ASYNC getDeptoActualAPI"+ departamento)
      //la de dentro es la funcion importada
      await getDeptoPorSiglas(departamento).then(r => {
      //  console.log("RESPUESTA DE LA API", r); // Imprime la respuesta completa de la API
        //this.dptoActualAPI = r.data._links.self.href;
        this.dptoActualAPI = r.data;
      //  console.log("DEPARTAMENTO ACTUAL RECUPERADO", this.dptoActualAPI);
      });
      //return dptoActAPI
    },


    async putAumentarCretido(departamento,creditos) {
      console.log ("llamando a putaumentarcredito ", departamento, creditos)
      await putAumentarCretido(departamento,creditos)
    },

    async getEmpleos() {
      await getEmpleos().then (r => {
        console.log("eleyendo empleo", r)
        this.empleos =  r.data;
      });
    },  

   
  }
})