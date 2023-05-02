<script>
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Materiales from './Materiales.vue';

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
      adquiridos: 'adquiridos'    
    }
  },

  components: { Panel, TabView, TabPanel, Materiales },
  computed: {
  },
  methods: {
  },
  created() {
  }
}
</script>

<template>
  <div class="tab-view-container">
    <TabView>
      <TabPanel header="MATERIALES DISPONIBLES">
        <Materiales :tipoVista="disponibles" badge="8" />
      </TabPanel>
      <TabPanel header="MIS MATERIALES OFERTADOS">
        <Materiales :tipoVista="ofertados" /> 
      </TabPanel>
      <TabPanel header="MIS MATERIALES ADQUIRIDOS">
         <Materiales :tipoVista="adquiridos" /> 
      </TabPanel>
      <!-- <TabPanel header="CARRUSEL">
        <Carrusel :tipoVista="undefined" />
      </TabPanel> -->

    </TabView>
  </div>
</template>

<style lang="scss" scoped>
.tab-view-container {
  margin-top: 30px;
  /* Ajusta el valor del margen superior según sea necesario */
}
</style>