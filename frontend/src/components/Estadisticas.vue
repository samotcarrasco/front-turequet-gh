
<script>
import Chart from 'primevue/chart';
import Accordion from 'primevue/accordion';
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
      maxMin: "",
      barData: {
        labels: [],
        datasets: [
          {
            label: 'Número de materiales por categoría',
            backgroundColor: '#889e59',
            data: [],
            //fontSize: 26 
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
      }
    };
  },
  computed: {
    ...mapState(categoriasStore, ['categorias'])

  },
  methods: {
    ...mapActions(materialesStore, ['getNumeroMaterialesPorCategoria']),
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(materialesStore, ['getNumeroMaterialesPorCategoria']),


    getNumMaterialesPorCategoria() {
      return this.getNumeroMaterialesPorCategoria()
    },

    asignarMaterialesACategorias() {
      this.categorias.forEach(categoria => {
        categoria.cantidadMateriales = this.getNumMaterialesPorCategoria()[categoria.categoria] || 0
        //console.log ("categoria: ", categoria.categoria , " materiales: ", this.getNumMaterialesPorCategoria()[categoria.categoria] )
      })
    },

    actualizarDatosGrafico() {
      this.asignarMaterialesACategorias()
      // console.log(this.categorias)

      let labels = []
      let data = []

      this.categorias.forEach(categoria => {
        labels.push(categoria.categoria)
        data.push(categoria.cantidadMateriales)
      })

      this.barData.labels = labels;
      this.barData.datasets[0].data = data;

    },

    obtenerMaxMin() {
      const maxCantidad = Math.max(...this.barData.datasets[0].data);
      const maxCategoriaIndex = this.barData.datasets[0].data.indexOf(maxCantidad);
      const maxCategoria = this.barData.labels[maxCategoriaIndex];
      console.log("MAX", maxCategoria, maxCantidad)

      const minCantidad = Math.min(...this.barData.datasets[0].data);
      const minCategoriaIndex = this.barData.datasets[0].data.indexOf(minCantidad);
      const minCategoria = this.barData.labels[minCategoriaIndex];
      console.log("MIN", minCategoria, minCantidad)

      const MAX_MIN = "MAX: " + maxCategoria + "(" + maxCantidad + ")" + " MIN: " + minCategoria + "(" + minCantidad + ")";
      //console.log(MAX_MIN)
      return MAX_MIN;

    }


  },
  async created() {
    await this.getCategorias()
    await this.getMateriales()
    this.actualizarDatosGrafico()
    this.maxMin = this.obtenerMaxMin()
    console.log(this.maxMin)
  },

}
</script>

<template>
  <div>
    <div class="grid p-fluid">
      
      <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
          <h5 class="text-left w-full">Pie Chart</h5>
          <Accordion>
            <AccordionTab :header="`Matariales por categoría: ${maxMin}`">
              <Chart type="bar" :data="barData" :options="barOptions" />
            </AccordionTab>
          </Accordion>
        </div>
      </div>
      <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
          <h5 class="text-left w-full">Doughnut Chart</h5>
          <Accordion>
            <AccordionTab :header="`Matariales por categoría: ${maxMin}`">
              <Chart type="bar" :data="barData" :options="barOptions" />
            </AccordionTab>
          </Accordion>
        </div>
      </div>
      <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
          <h5 class="text-left w-full">Polar Area Chart</h5>
          <Accordion>
            <AccordionTab :header="`Matariales por categoría: ${maxMin}`">
              <Chart type="bar" :data="barData" :options="barOptions" />
            </AccordionTab>
          </Accordion>
        </div>
      </div>
      <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
          <h5 class="text-left w-full">Radar Chart</h5>
          <Accordion>
            <AccordionTab :header="`Matariales por categoría: ${maxMin}`">
              <Chart type="bar" :data="barData" :options="barOptions" />
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>


</div></template>

  