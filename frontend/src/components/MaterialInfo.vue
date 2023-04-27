<script>
// import participantesJson from '@/assets/participantes.json'
//import Participante from '../practica-componentes/Participante.vue'
import { mapActions, mapState } from 'pinia'
import { materialesStore } from '@/stores/materiales'
import { storeDptoActual } from '@/stores/dptoActual'
import Card from 'primevue/card';
import Button from 'primevue/button';
import Galleria from 'primevue/galleria'

export default {
  data() {
    return {
    }
  },
  props: {
    // tipoVista: {
    //   type: String,
    //   required: true
    // }
  },
  components: { Card, Button, Galleria },
  //   emits: [ 'addGol', 'addTarjeta' ],
  computed: {
    ...mapState(materialesStore, ['materiales']),
    ...mapState(storeDptoActual, ['dptoActual']),

    material() {
      // return this.participantes.find(p => p.id == this.$route.params.id)
      return this.getMaterialPorId(this.$route.params.id)
    },
  },
  methods: {
    ...mapActions(materialesStore, ['getMaterialPorId']),

    adquirirMaterial() {
      // Lógica para adquirir el material
    },
    eliminarMaterial() {
      // Lógica para eliminar el material
    },
    materialAdquirido(material){
      console.log("acutal" , this.dptoActual)
      console.log("adquisicion" , material.dptoAdquisicion)
      console.log("estado" , material.estado)
      
     // console.log( material.dptoAdquisicion , this.dptoActual, material.dptoAdquisicion == this.dptoActual)
      return material.dptoAdquisicion == this.dptoActual && material.estado == "adquirido"
    },
    materialOfertado(material){
      return material.dptoOferta == this.dptoActual && material.estado == "disponible"
    },
    materialDisponible(material){
      return material.dptoOferta !== this.dptoActual && material.estado == "disponible"
    },
  },
  mounted() {
    // console.log("mountedddd ", this.$route.query.tipoVista);

  },
  created() {
    //console.log("TIPO VISTA DESDE MaterialInfo", this.tipoVista)
  }
}
</script>

<template>
  <Card :style="{ backgroundColor: '#dfe0d6' }" class="p-col-4">
    <template #title> {{ material.nombre }} </template>
    <template #subtitle> {{ material.credito }} μ </template>
    <template #content>
      <div class="row">
        <div class="col-sm-4">
          <div class="p-mb-2"><strong>Descripción:</strong> {{ material.descripcion }}</div>
          <div class="p-mb-2"><strong>Categoría:</strong> {{ material.categoria }}</div>
          <!-- <div class="p-mb-2"><strong>Grupo:</strong> {{ material.grupo }}</div> -->
          <div class="p-mb-2"><strong>Peso:</strong> {{ material.peso }} kg</div> 
          <div class="p-mb-2"><strong>Dimensiones:</strong> {{ material.dimensiones }}</div>
          <div class="p-mb-2"><strong>Estado:</strong> {{ material.estado }}</div>
          <div class="p-mb-2"><strong>Fecha de adquisición:</strong> {{ material.fechaAdquisicion }}</div>
          <!-- <div class="p-mb-2"><strong>Inventariable:</strong> {{ material.inventariable }}</div>
          <div class="p-mb-2"><strong>Número de orden de compra:</strong> {{ material.noc }}</div>
          <div class="p-mb-2"><strong>Número de serie:</strong> {{ material.numeroSerie }}</div>
          <div class="p-mb-2"><strong>Aplicación:</strong> {{ material.aplicacion }}</div>
          <div class="p-mb-2"><strong>Departamento:</strong> {{ material.departamento }}</div> -->

        </div>
        <div class="col-sm-4">
          <img :src="material.imagen" alt="Imagen del material" style="max-width: 30vw">
          <Galleria v-model:visible="displayBasic" :value="images" :responsiveOptions="responsiveOptions" :numVisible="9"
            containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true">
            <template #item="slotProps">
              <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
            </template>
          </Galleria>

          <Button label="Show" icon="pi pi-external-link" @click="displayBasic = true" />
        </div>
        <div class="p-mb-2">
          <Button v-if="materialDisponible(material)" label="Adquirir" icon="pi pi-shopping-cart"
            class="p-button-success" />
            <Button v-if="materialOfertado(material)" label="Editar" icon="pi pi-pencil" class="p-button-secondary" />
            <Button v-if="materialOfertado(material)" label="Eliminar" icon="pi pi-trash" class="p-button-danger" />
          <!-- <Button v-if="tipoVista === 'ofertados'" label="Eliminar" icon="pi pi-trash" class="p-button-danger" /> -->
          <Button v-if="materialAdquirido(material)" label="Ver detalles de adquisición" class="p-button-info" />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.p-button {
  margin: 1rem;
}

.p-card-content {
  margin: 0;
  padding: 0;
}
</style>