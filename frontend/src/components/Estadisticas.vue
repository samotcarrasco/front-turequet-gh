
<script>
import Chart from 'primevue/chart'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { categoriasStore } from '@/stores/categorias'
import { materialesStore } from '@/stores/materiales'
import { mapState, mapActions } from 'pinia'


export default {
  name: 'App',
  components: {
    Chart, Accordion, AccordionTab
  },
  data() {
    return {
      categMateriales: [],
      maxMin: "",
      grafBarras: {
        labels: [],
        datasets: [
          {
            label: 'Número de materiales por categoría',
            backgroundColor: '#889e59',
            data: [],
          }
        ]
      },
      barOptions: {
        scales: {
          x: {
            ticks: {
              color: '#374015',
              font: {
                weight: 500
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: '#374015',
              stepSize: 1
            },
            grid: {
              color: '#374015',
              drawBorder: false
            }
          }
        }
      },
      grafQueso: {
        labels: [],
        datasets: [
          {
            label: 'Número de materiales por categoría',
            backgroundColor: [],
            data: [],
            //fontSize: 26 
          }
        ]
      },
    }
  },
  computed: {
    ...mapState(categoriasStore, ['categorias'])

  },
  methods: {
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(materialesStore, ['getMateriales']),


    getNumMaterialesPorCategoria() {
      const categMateriales = []

      for (let i = 0; i < this.categorias.length; i++) {
        const categoria = this.categorias[i].categoria
        const numMateriales = this.categorias[i].numMateriales

        // Crear un objeto de categoría y agregarlo al array
        const categObjeto = { categoria: categoria, numMateriales: numMateriales }
        categMateriales.push(categObjeto)
      }

      return categMateriales
    },


    actualizarGraficoBarras() {
      // this.asignarMaterialesACategorias()
      // console.log(this.categorias)

      let labels = []
      let data = []

      this.categMateriales.forEach(categoria => {
        labels.push(categoria.categoria)
        data.push(categoria.numMateriales)
        console.log("PUSH " + categoria.categoria, categoria.numMateriales)
      })

      this.grafBarras.labels = labels
      this.grafBarras.datasets[0].data = data
      this.grafQueso.labels = labels
      this.grafQueso.datasets[0].data = data

      let backgroundColor = this.generarColoresVerdeMilitar(this.categMateriales.length)
      this.grafQueso.datasets[0].backgroundColor = backgroundColor
    },

    generarColoresVerdeMilitar(numColores) {
      const colores = [
        "#556B2F",
        "#6B8E23",
        "#808000",
        "#BDB76B",
        "#8FBC8F",
        "#98FB98",
        "#9ACD32",
        "#7FFF00",
        "#7CFC00",
        "#ADFF2F"
      ]
       const coloresExtendidos = []

      for (let i = 0; i < numColores; i++) {
         const colorIndex = i % colores.length
         coloresExtendidos.push(colores[colorIndex])
      }

      return coloresExtendidos
    },



  },
  async created() {
    await this.getCategorias()
    this.categMateriales = this.getNumMaterialesPorCategoria()
    this.actualizarGraficoBarras()
    //   this.actualizarGraficoQueso()


  },

}
</script>

<template>
  <div>
    <h3>Gráfico de barras, por categorías</h3>
    <Chart type="bar" :data="grafBarras" :options="barOptions" />
    <br>
    <h3>Gráfico circular, por categorías</h3>
    <Chart type="pie" :data="grafQueso"  :style="{ width: '60vw'}" />

  </div>
</template>

  