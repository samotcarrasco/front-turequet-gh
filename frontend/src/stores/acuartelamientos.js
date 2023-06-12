import { defineStore } from 'pinia'
import { getAcuartelamientos, getAcuartPorSiglas, getEmpleos } from './api-service'


export const acuartelamientosStore = defineStore('acuartelamientos', {
  state: () => ({
    acuartelamiento: undefined,
    acuartelamientos: [],
    acuartelamientosSiglas: [],
    empleos: []
    }),


  actions: {
    async getAcuartelamientos() {
      await getAcuartelamientos().then(r => {
        this.acuartelamientos = r.data._embedded.acuartelamientos;
        this.acuartelamientosSiglas = this.acuartelamientos.map(dpto => {
          return { id: dpto.id, siglas: dpto.abreviatura };
        });
      });
    },

    async getEmpleos() {
      await getEmpleos().then(r => {
        this.empleos = r.data;
      });
    },

    async getAcuartPorSiglas(siglas){
      await getAcuartPorSiglas(siglas).then(r => {
        this.acuartelamiento = r.data._links.self.href;
      });
    }
  }
})