<script>
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Materiales from './Materiales.vue'

export default {
  components: { Panel, TabView, TabPanel, Materiales },
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
  }
}
</script>

<template>
  <div class="tabs">
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
      <TabPanel header="ENTREGADOS/RECIBIDOS">
        <Materiales :tipoVista="entregados" />
      </TabPanel> 
    </TabView>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .p-tabview .p-tabview-nav {
    flex-direction: column;
  }
  .p-tabview .p-tabview-nav .p-tabview-nav-item {
    width: 100%;
  }

  .tabs{
    margin-left: 200vw; 
  }
}
</style>
