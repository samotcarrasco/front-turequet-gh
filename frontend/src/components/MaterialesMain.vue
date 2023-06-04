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
  },
  computed: {

  },
  methods: {

  },
  mounted() {

  }
}
</script>

<template>
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
</template>
