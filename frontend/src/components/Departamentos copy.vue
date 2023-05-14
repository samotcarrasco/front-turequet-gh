
<script>

import { departamentosStore } from '@/stores/departamentos';
import { mapState, mapActions } from 'pinia'
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Panel from 'primevue/panel';


export default {
  components: {
    Accordion, AccordionTab, Panel

  },

  data() {

    return {
      modalEditCreate: null,
    };
  },
  mounted() {

  },
  computed: {
    ...mapState(departamentosStore, ['departamentos']),
  },

  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),

  },
  async created() {
    await this.getDepartamentos() 
  },
}
</script>

<template>
  <div class="card">
    <Accordion :multiple="true" :activeIndex="[0]">
      <AccordionTab v-for="departamento in departamentos" :header="departamento.abreviatura" :key="departamento.id">
        <p>
          Email: {{ departamento.email }}<br>
          Crédito: {{ departamento.credito }}
        </p>
      </AccordionTab>
    </Accordion>

  </div>
</template>

<style lang="scss" scoped>

</style>