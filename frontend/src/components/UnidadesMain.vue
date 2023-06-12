<script>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Departamentos from './Departamentos.vue'
import Acuartelamientos from './Acuartelamientos.vue'


export default {
  components: { TabView, TabPanel, Departamentos, Acuartelamientos },
  
  data() {
    return {
      currentTab: undefined
    }
  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab.header
    }
 },
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

<style>
.tabview-panels {
  width: max-content;
}
</style>