<script>
import Chart from 'primevue/chart'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { categoriasStore } from '@/stores/categorias'
import { materialesStore } from '@/stores/materiales'
import { acuartelamientosStore } from '@/stores/acuartelamientos'
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
      graficoBarrasCategorias: {
        labels: [],
        datasets: [
          {
            label: 'Número de materiales por categoría',
            backgroundColor: '#889e59',
            data: [],
          }
        ]
      },
      graficoQueso: {
        labels: [],
        datasets: [
          {
            label: 'Número de materiales por categoría',
            backgroundColor: [],
            data: [],
          }
        ]
      },
      graficoBarrasUnidades: {
        labels: [],
        datasets: [
          {
            label: 'Número de departamentos',
            backgroundColor: '#556B2F',
            data: [],
          },
          {
            label: 'Número de materiales',
            backgroundColor: '#6B8E23',
            data: [],
          }
        ]
      },
      barOptions: {
        scales: {
          x: { ticks: { color: '#374015' },
               grid:  { display: false,
                        drawBorder: false } },
          y: { ticks: { color: '#374015',
                        stepSize: 1 },
               grid:  { color: '#374015',
                        drawBorder: false } }
        }
      },
    }
  },
  computed: {
    ...mapState(categoriasStore, ['categorias']),
    ...mapState(acuartelamientosStore, ['acuartelamientos'])

  },
  methods: {
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(acuartelamientosStore, ['getAcuartelamientos']),


    getNumMaterialesPorCategoria() {
      const categMateriales = []

      for (let i = 0; i < this.categorias.length; i++) {
        const categoria = this.categorias[i].categoria
        const numMateriales = this.categorias[i].numMateriales
        const categObjeto = { categoria: categoria, numMateriales: numMateriales }
        categMateriales.push(categObjeto)
      }

      return categMateriales
    },

    actualizarGraficos() {

      let labelsMateriales = []
      let labelsAcuartelamientos = []
      let data = []
      let numDepartamentos = []
      let numMateriales = []

      this.categMateriales.forEach(categoria => {
        labelsMateriales.push(categoria.categoria)
        data.push(categoria.numMateriales)
        console.log("PUSH " + categoria.categoria, categoria.numMateriales)
      })

      this.acuartelamientos.forEach(acuartelamiento => {
        labelsAcuartelamientos.push(acuartelamiento.abreviatura)
        numDepartamentos.push(acuartelamiento.numDepartamentos)
        numMateriales.push(acuartelamiento.numMateriales)
      })  

      this.graficoBarrasCategorias.labels = labelsMateriales
      this.graficoBarrasCategorias.datasets[0].data = data
      this.graficoQueso.labels = labelsMateriales
      this.graficoQueso.datasets[0].data = data
      let backgroundColor = this.generarColoresVerdeMilitar(this.categMateriales.length)
      this.graficoQueso.datasets[0].backgroundColor = backgroundColor

      this.graficoBarrasUnidades.labels = labelsAcuartelamientos
      this.graficoBarrasUnidades.datasets[0].data = numDepartamentos
      this.graficoBarrasUnidades.datasets[1].data = numMateriales

    },

    generarColoresVerdeMilitar(numColores) {
      const colores = [
        "#556B2F",
        "#6B8E23",
        "#808000",
        "#BDB76B",
        "#9ACD32",
        "#4c9141",
        "#556B2F",
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
    await this.getAcuartelamientos()
    this.categMateriales = this.getNumMaterialesPorCategoria()
    this.actualizarGraficos()
    await this.getAcuartelamientos()

  },

}
</script>
<template>
  <div>
    <h3>Gráfico de barras, por categorías</h3>
    <div class="chart-barras">
      <Chart type="bar" :data="graficoBarrasCategorias" :options="barOptions" />
    </div>
    <br>
    <h3>Gráfico circular, por categorías</h3>
    <div class="chart-queso">
      <Chart type="pie" :data="graficoQueso" />
    </div>
    <br/>
    <h3>Gráfico de barras, por acuartelamientos</h3>
    <div>
      <div class="chart-barras"></div>
      <Chart type="bar" :data="graficoBarrasUnidades" :options="barOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-queso {
  width: 30vw;
  height: 30vw;
}

.chart-barras {
  width: 60vw
}
</style>