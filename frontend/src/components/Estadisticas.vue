
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
      categMateriales: [],
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


    getNumMaterialesPorCategoria() {
      const categMateriales = [];

      for (let i = 0; i < this.categorias.length; i++) {
        const categoria = this.categorias[i].categoria;
        const numMateriales = this.categorias[i].numMateriales;

        // Crear un objeto de categoría y agregarlo al array
        const categObjeto = { categoria: categoria, numMateriales: numMateriales };
        categMateriales.push(categObjeto);
      }

      return categMateriales;
    },

    // asignarMaterialesACategorias() {
    //   this.categorias.forEach(categoria => {
    //     categoria.cantidadMateriales = this.getNumMaterialesPorCategoria()[categoria.categoria] || 0
    //     //console.log ("categoria: ", categoria.categoria , " materiales: ", this.getNumMaterialesPorCategoria()[categoria.categoria] )
    //   })
    // },

    actualizarDatosGrafico() {
      // this.asignarMaterialesACategorias()
      // console.log(this.categorias)

      let labels = []
      let data = []

      this.categMateriales.forEach(categoria => {
        labels.push(categoria.categoria)
        data.push(categoria.numMateriales)
        console.log("PUSHH" + categoria.categoria, categoria.numMateriales)
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
    //await this.getMateriales()
      
    this.categMateriales = this.getNumMaterialesPorCategoria();
    this.actualizarDatosGrafico()
    this.maxMin = this.obtenerMaxMin()
    console.log(this.maxMin)

  },

}
</script>

<template>
  
  <div>
    <Chart type="bar" :data="barData" :options="barOptions" />
    <div class="grid p-fluid">
      <div class="col-12 xl:col-6">
        <div class="card flex flex-column align-items-center">
          <h5 class="text-left w-full">Número de materiales por categoría</h5>
          <Accordion>
            <AccordionTab :header="`${maxMin}`">
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


  </div>
</template>

  