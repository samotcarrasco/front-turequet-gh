<script>
import Panel from 'primevue/panel'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Departamentos from './Departamentos.vue';
import Acuartelamientos from './Acuartelamientos.vue';


export default {

  props: {
  },
  data() {
    return {
      currentTab: 'departamentos'
    };
  },
 
  components: { Panel, TabView, TabPanel, Departamentos, Acuartelamientos },
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
