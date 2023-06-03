import { defineStore } from 'pinia'
import { getCategorias, getCategoriasPrincipales, putCategoria, postCategoria, deleteCategoria, getGrupos } from './api-service'


export const categoriasStore = defineStore('categorias', {
  state: () => ({
    grupos: [],
    categorias: [],
  }),
  getters: {

  },
  actions: {
    categoriasDptoActual() {
      console.log('filtrando categorias por dpto:', this.dptoActual)
      return this.categorias.filter(material => material.departamento === this.dptoActual)
    },

    async getGrupos() {
      await getGrupos().then(r => {
        console.log("leyendo grupo", r)
        this.grupos = r.data;
      });
    },

    async getCategoriasPrincipales() {
      await getCategoriasPrincipales().then(r => {
        this.catPrincipales = r.data._embedded.categorias;
      });
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
