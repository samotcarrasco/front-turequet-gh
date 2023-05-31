import { defineStore } from 'pinia'
import { getAcuartelamientos, putAcuartelamiento, deleteAcuartelamiento, postAcuartelamiento, 
  getAcuartPorSiglas, getEmpleos } from './api-service'


export const acuartelamientosStore = defineStore('acuartelamientos', {
  state: () => ({
    acuartelamiento: undefined,
    acuartelamientos: [],
    acuartelamientosSiglas: [],
     rolActual: undefined,
    empleos: [],
    bases: []
  }),


  actions: {
    async getAcuartelamientos() {
      //la de dentro es la funcion importada
      await getAcuartelamientos().then(r => {
        this.acuartelamientos = r.data._embedded.acuartelamientos;
        this.acuartelamientosSiglas = this.acuartelamientos.map(dpto => {
          return { id: dpto.id, siglas: dpto.abreviatura };
        });
      });
    },

    // async getDeptoActualAPI(acuartelamiento) {
    //   //console.log("DENTRODEL ASYNC getDeptoActualAPI"+ acuartelamiento)
    //   //la de dentro es la funcion importada
    //   await getDeptoPorSiglas(acuartelamiento).then(r => {
    //     //console.log("RESPUESTA DE LA API", r); // Imprime la respuesta completa de la API
    //     //this.dptoActualAPI = r.data._links.self.href;
    //     this.dptoActualAPI = r.data;
    //     this.milisMenu = r.data.credito;
    //     // console.log("DATOS EN BRUTO", r.data)
    //     // console.log("DATOS", r.data.credito)
    //    // console.log("DEPARTAMENTO ACTUAL RECUPERADO", r.data.credito);
    //   });

    //   await getBonificacion(this.dptoActualAPI.id).then(r => {
    //     console.log("leyendo bonificaicon: ", r.data.bonificacion)
    //     this.bonificacion = r.data.bonificacion;
    //     //aprovechamos para recuperar los milis que se muestran en el menu
    //   }); 
      
    // },

    async postAcuartelamiento(acuart) {
      //la de dentro es la funcion importada
      await postAcuartelamiento(acuart);
    },

    async putAcuartelamiento(acuart) {
      //la de dentro es la funcion importada
      await putAcuartelamiento(acuart);
    },

    async getEmpleos() {
      await getEmpleos().then(r => {
        console.log("eleyendo empleo", r)
        this.empleos = r.data;
      });
    },

    async deleteAcuartelamiento(acuart) {
      //la de dentro es la funcion importada
      await deleteAcuartelamiento(acuart)
    },

    async getAcuartPorSiglas(siglas){
      //la de dentro es la funcion importada
      await getAcuartPorSiglas(siglas).then(r => {
        console.log("leyendo acuartelamiento", r)
        this.acuartelamiento = r.data._links.self.href;
      });
    }
  }
})