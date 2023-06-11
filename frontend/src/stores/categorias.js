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
      return this.categorias.filter(material => material.departamento === this.dptoActual)
    },

    async getGrupos() {
      await getGrupos().then(r => {
        this.grupos = r.data;
      });
    },

    async getCategoriasPrincipales() {
      await getCategoriasPrincipales().then(r => {
        this.catPrincipales = r.data._embedded.categorias;
      });
    },

    async getCategorias() {
      await getCategorias().then(r => this.categorias = r.data._embedded.categorias);
    },

    async postCategoria(categoria) {
      await postCategoria(categoria);
    },

    async putCategoria(categoria, id) {
      await putCategoria(categoria, id);
    },

    async deleteCategoria(categoria) {
      await deleteCategoria(categoria);
    },    
  },
})
