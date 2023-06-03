<script>
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Departamentos from './Departamentos.vue';
import Acuartelamientos from './Acuartelamientos.vue';


export default {
  components: { Panel, TabView, TabPanel, Departamentos, Acuartelamientos },
  
  data() {
    return {
      currentTab: 'departamentos'
    };
  },
 
  computed: {

  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab.header;
    }

  },
  mounted() {

  }
}
</script>

 <template>
  <TabView>
    <TabPanel header="DEPARTAMENTOS"> 
      <Departamentos/>
    </TabPanel>
    <TabPanel header="ACUARTELAMIENTOS">
      <Acuartelamientos/>
    </TabPanel>
  </TabView>
</template> 
