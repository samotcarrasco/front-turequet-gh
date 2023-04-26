import { defineStore } from 'pinia'
 //import { storeDptoActual } from './dptoActual'
// import { mapState } from 'pinia'
import { getCategorias } from './api-service'
 
export const categoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [],
  }),
  getters: {
   
  },
  actions: {
     categoriasDptoActual(){
       console.log('filtrando categorias por dpto:', this.dptoActual)
       return this.categorias.filter(material => material.departamento === this.dptoActual)
     },

    getGrupos() {
      const grupos = []
      const grupoSet = new Set()
      this.categorias.forEach(categoria => {
        if (!grupoSet.has(categoria.grupo)) {
          grupoSet.add(categoria.grupo)
          grupos.push({
            label: categoria.grupo,
            value: categoria.grupo
          })
        }
      })
      return grupos
    },
   
    async getCategorias() {
      //la de dentro es la funcion importada
      await getCategorias().then(r => this.categorias = r.data._embedded.categorias)
    },

    },
})
