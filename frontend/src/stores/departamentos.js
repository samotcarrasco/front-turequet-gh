import { defineStore } from 'pinia'
import { getDepartamentos, getDeptoPorSiglas, putAumentarCretido, 
         getEmpleos, getBases, getBonificacion, getMaterialPorId } from './api-service'


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
      await this.getDeptoActualAPI(departamento)
    },

    cambiarRol(rol) {
      this.rolActual = rol
    },

    async getDepartamentos() {
      await getDepartamentos().then(r => {
        this.departamentos = r.data._embedded.departamentos;
        this.departamentosSiglas = this.departamentos.map(dpto => {
          return { id: dpto.id, siglas: dpto.abreviatura };
        });
      });
    },

    async getDeptoActualAPI(departamento) {
      await getDeptoPorSiglas(departamento).then(r => {
        this.dptoActualAPI = r.data;
        this.milisMenu = r.data.credito;
      });

      await getBonificacion(this.dptoActualAPI.id).then(r => {
        this.bonificacion = r.data.bonificacion;
      });

    },

    async getMaterialPorId(id) {
      await getMaterialPorId(id);
    },

    async putAumentarCretido(departamento, creditos) {
      await putAumentarCretido(departamento, creditos)
    },

    async getEmpleos() {
      await getEmpleos().then(r => {
        this.empleos = r.data;
      });
    },

    async getBases() {
      await getBases().then(r => {
        this.bases = r.data;
      });
    },

    actualizarMilisMenu(bonificacion) {
      this.milisMenu += bonificacion
    }

  }
})