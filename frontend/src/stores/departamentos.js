import { defineStore } from 'pinia'
import { getDepartamentos, putDepartamento, deleteDepartamento, postDepartamento, getDeptoPorSiglas, 
  putAumentarCretido, getEmpleos, getBases, getBonificacion, getMaterialPorId } from './api-service'


export const departamentosStore = defineStore('departamentos', {
  state: () => ({
    departamentos: [],
    departamentosSiglas: [],
    dptoActual: undefined,
    dptoActualAPI: undefined,
    rolActual: undefined,
    empleos: [],
    bases: [],
    bonificacion: 0,
    milisMenu: undefined,
  }),

  writable: ['milisMenu'],

  actions: {
    async cambiarDpto(departamento) {
      this.dptoActual = departamento
      console.log("dpto actual:", departamento)
      await this.getDeptoActualAPI(departamento)
      console.log("dpto API:", this.dptoActualAPI)
      console.log("milis menu " , this.milisMenu)
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
          return { id: dpto.id, siglas: dpto.abreviatura};
        });
      });
    },

    async getDeptoActualAPI(departamento) {
      //console.log("DENTRODEL ASYNC getDeptoActualAPI"+ departamento)
      //la de dentro es la funcion importada
      await getDeptoPorSiglas(departamento).then(r => {
        //console.log("RESPUESTA DE LA API", r); // Imprime la respuesta completa de la API
        //this.dptoActualAPI = r.data._links.self.href;
        this.dptoActualAPI = r.data;
        this.milisMenu = r.data.credito;
        // console.log("DATOS EN BRUTO", r.data)
        // console.log("DATOS", r.data.credito)
       // console.log("DEPARTAMENTO ACTUAL RECUPERADO", r.data.credito);
      });

      await getBonificacion(this.dptoActualAPI.id).then(r => {
        console.log("leyendo bonificaicon: ", r.data.bonificacion)
        this.bonificacion = r.data.bonificacion;
        //aprovechamos para recuperar los milis que se muestran en el menu
      }); 
      
    },

    async postDepartamento(dpto) {
      //la de dentro es la funcion importada
      await postDepartamento(dpto);
    },

    async getMaterialPorId(id) {
      //la de dentro es la funcion importada
      await getMaterialPorId(id);
    },


    async putDepartamento(dpto) {
      //la de dentro es la funcion importada
      await putDepartamento(dpto);
    },

    async putAumentarCretido(departamento, creditos) {
      console.log("llamando a putaumentarcredito ", departamento, creditos)
      await putAumentarCretido(departamento, creditos)
    },

    async getEmpleos() {
      await getEmpleos().then(r => {
        console.log("eleyendo empleo", r)
        this.empleos = r.data;
      });
    },
   
    async getBases() {
      await getBases().then(r => {
        console.log("eleyendo base", r)
        this.bases = r.data;
      });
    },

    async deleteDpto(dpto) {
      //la de dentro es la funcion importada
      await deleteDepartamento(dpto)
    },

    actualizarMilisMenu(bonificacion){
      this.milisMenu += bonificacion
      console.log ("store milisMenu actualizadop", this.milisMenu);
    }

  }
})