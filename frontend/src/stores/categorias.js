import { defineStore } from 'pinia'
//import { storeDptoActual } from './dptoActual'
// import { mapState } from 'pinia'
import { getCategorias, putCategoria, postCategoria, deleteCategoria } from './api-service'


export const categoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [],
  }),
  getters: {

  },
  actions: {
    categoriasDptoActual() {
      console.log('filtrando categorias por dpto:', this.dptoActual)
      return this.categorias.filter(material => material.departamento === this.dptoActual)
    },

    getGrupos() {
       //const grupos = ["Informática", "Comunicaciones", "Mobiliario", "Material de oficina"]
       const grupos = ["Informatica"," Comunicaciones", "Mobiliario_Oficina", "Material_Oficina", "Otros"]
      return grupos;
      // const grupoSet = new Set()
      // this.categorias.forEach(categoria => {
      //   if (!grupoSet.has(categoria.grupo)) {
      //     grupoSet.add(categoria.grupo)
      //     grupos.push(categoria.grupo)
      //   }
      // })
      // return grupos
    },

    async getCategorias() {
      //la de dentro es la funcion importada
      await getCategorias().then(r => this.categorias = r.data._embedded.categorias);
     //await getCategorias().then(r => this.categorias = Object.values(r.data));
    },

    async postCategoria(categoria) {
      //la de dentro es la funcion importada
      await postCategoria(categoria);
    },

    async putCategoria(categoria, id) {
      //la de dentro es la funcion importada
      await putCategoria(categoria, id);
    },

    async deleteCategoria(categoria) {
      //la de dentro es la funcion importada
      await deleteCategoria(categoria);
    },


  },
})
