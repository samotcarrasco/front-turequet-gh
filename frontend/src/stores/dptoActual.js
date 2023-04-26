import { defineStore } from 'pinia'

export const storeDptoActual = defineStore('dptoActual', {
  state: () => ({
    dptoActual: '',
  }),
  actions :{
    cambiarDpto(departamento) {
     this.dptoActual = departamento
     },
  }
})