<script>
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Materiales from './Materiales.vue';
//import Carrusel from './Carrusel.vue';


export default {

  props: {
    tipoVista: {
      type: String,
      default: "undefined"
    }
  },
  data() {
    return {
      disponibles: 'disponibles',
      ofertados: 'ofertados',
      pendientes: 'pendientes',
      entregados: 'entregados',
      valorReactivo: 0
    }
  },
  // provide() {
  //   // use function syntax so that we can access `this`
  //   return {
  //    // message: this.message
  //   }
  // },
  components: { Panel, TabView, TabPanel, Materiales },
  computed: {

  },
  methods: {

  },
  mounted() {

  }
}
</script>

<template>
  <!-- <div class="tab-view-container"> -->
  <TabView>
    <TabPanel header="MATERIALES DISPONIBLES"> 
     <Materiales :tipoVista="disponibles" />
    </TabPanel>
    <TabPanel header="MIS MATERIALES OFERTADOS">
      <Materiales :tipoVista="ofertados" />
    </TabPanel>
    <TabPanel header="PENDIENTES DE ENTREGA">
      <Materiales :tipoVista="pendientes" />
    </TabPanel>
    <TabPanel header="ENGREGADOS/RECIBIDOS">
      <Materiales :tipoVista="entregados" />
    </TabPanel> 

  </TabView>
  <!-- </div> -->
</template>
