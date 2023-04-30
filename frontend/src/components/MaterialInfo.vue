<script>
// import participantesJson from '@/assets/participantes.json'
//import Participante from '../practica-componentes/Participante.vue'
import { mapActions, mapState } from 'pinia'
import { materialesStore } from '@/stores/materiales'
import { departamentosStore } from '@/stores/departamentos'
import jsPDF from 'jspdf';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Galleria from 'primevue/galleria';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider'

export default {
  data() {
    return {
      material: {},
      submitted: false,
      adquirirDialog: false,
      cabecera: ""
    }
  },
  props: {
    // tipoVista: {
    //   type: String,
    //   required: true
    // }
  },
  components: { Card, Button, Galleria, Dialog, Divider },
  //   emits: [ 'addGol', 'addTarjeta' ],
  computed: {
    ...mapState(materialesStore, ['materiales']),
    ...mapState(departamentosStore, ['dptoActual']),
    ...mapState(departamentosStore, ['dptoActualAPI']),

    material() {
      // return this.participantes.find(p => p.id == this.$route.params.id)
      return this.getMaterialPorId(this.$route.params.id)
    },
  },
  methods: {
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(materialesStore, ['getMaterialPorId']),
    ...mapActions(materialesStore, ['putMaterial']),
    ...mapState(departamentosStore, ['getDeptoActualAPI']),

    eliminarMaterial() {
      // Lógica para eliminar el material
    },

    materialAdquirido(material) {
      console.log("acutal", this.dptoActual)
      console.log("adquisicion", material.dptoAdquisicion)
      console.log("estado", material.estado)

      // console.log( material.dptoAdquisicion , this.dptoActual, material.dptoAdquisicion == this.dptoActual)
      return material.dptoAdquisicion == this.dptoActual && material.estado == "adquirido"
    },
    materialOfertado(material) {
      return material.dptoOferta == this.dptoActual && material.estado == "disponible"
    },
    materialDisponible(material) {
      return material.dptoOferta !== this.dptoActual && material.estado == "disponible"
    },
    generarPDF(material) {
      const doc = new jsPDF();

      const logo = new Image();
      const logoACING = new Image();
      logo.src = '/src/assets/img/logos/logo.png';
      logoACING.src = '/src/assets/img/logos/logoACING.png';
      const logoWidth = 12;
      const logoHeight = 12;
      const logoACINGWidth = 12;
      const logoACINGHeight = 18;


      doc.addImage(logo, 'PNG', 10, 6, logoWidth, logoHeight);
      doc.addImage(logoACING, 'PNG', 180, 4, logoACINGWidth, logoACINGHeight);
      doc.setFontSize(16);
      doc.text('SISTEMA TRUEQUET', doc.internal.pageSize.getWidth() / 2, 10, null, null, 'center');
      doc.setFontSize(14);
      doc.text('DOCUMENTO DE INTERCAMBIO DE MATERIAL', doc.internal.pageSize.getWidth() / 2, 20, null, null, 'center');
      doc.setFontSize(12);
         // línea horizontal
      doc.line(10, 30, doc.internal.pageSize.getWidth() - 10, 30);
      doc.text(`Material intercambiado: ${material.nombre}`, 10, 40);
      doc.text(`Descripción: ${material.descripcion}`, 10, 50);
      doc.text(`Crédito en μilis: ${material.milis}`, 10, 60);
      doc.text(`Unidad ofertante: ${material.dptoOferta}`, 10, 70);
      doc.text('Responsable:', 10, 80);
      doc.text('Teléfono:', 10, 90);
      doc.text(`Unidad que adquiere el material: ${material.dptoAdquisicion}`, 10, 100);
      doc.text('Responsable:', 10, 110);
      doc.text('Teléfono:', 10, 120);
      
      // línea horizontal
      doc.line(10, 130, doc.internal.pageSize.getWidth() - 10, 130);

      doc.text(`Fecha del sistema: ${new Date().toLocaleDateString('es-ES')}`, 10, 140);
      doc.text('Fecha en la que se produce el intercambio:____________________', 10, 150);

      doc.text('Fdo: Unidad que entrega el material         Fdo: Unidad que adquiere el material', 10, 200);
      doc.save(`intercambio-material${material.nombre}.pdf`);

    }

  },
  mounted() {
    // console.log("mountedddd ", this.$route.query.tipoVista);

    const modalAdquirirMaterial = () => {
      this.material = {};
      this.submitted = false;
      this.adquirirDialog = true;
      this.cabecera = "Confirmación de adquisición de material"
    };

    const hideDialog = () => {
      this.adquirirDialog = false;
      this.submitted = false;
    };

    const saveMaterial = () => {
      this.submitted = true;

      this.generarPDF(this.material);
      //actualizamos el material con la info correspondiente
      console.log("actualizando material: " + this.material.id + this.material.nombre)
      this.material.estado="adquirido";
      this.material.dptoAdquisicion = this.dptoActualAPI;
      this.material.fechaAdquisicion = new Date();
      this.putMaterial(this.material,this.material.id).then(() => { this.getMateriales() });
      
    }

    const adquirirMaterial = (material) => {
      this.material = { ...material };
      console.log(this.material);
      this.adquirirDialog = true;
      this.cabecera = "Adquirir material"
    };

    this.modalAdquirirMaterial = modalAdquirirMaterial;
    this.hideDialog = hideDialog;
    this.adquirirMaterial = adquirirMaterial;
    this.saveMaterial = saveMaterial;


  },

 
  async created() {
    
    console.log("LLAMANDO A DPTO ACTUAL API CON", this.dptoActual);
    await this.getDeptoActualAPI();
    console.log("DPTO ACTUAL API:" + this.dptoActualAPI)
    //iniciamos la aplicación con rol gestor  

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
          <Button v-if="materialDisponible(material)" label="Adquirir" icon="pi pi-shopping-cart" class="p-button-success"
            @click="adquirirMaterial(material)" />
          <Button v-if="materialOfertado(material)" label="Editar" icon="pi pi-pencil" class="p-button-secondary" />
          <Button v-if="materialOfertado(material)" label="Eliminar" icon="pi pi-trash" class="p-button-danger" />
          <!-- <Button v-if="tipoVista === 'ofertados'" label="Eliminar" icon="pi pi-trash" class="p-button-danger" /> -->
          <Button v-if="materialAdquirido(material)" label="Ver detalles de adquisición" class="p-button-info" />
        </div>
      </div>
    </template>
  </Card>


  <Dialog v-model:visible="adquirirDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true" class="p-fluid">
    Nombre del material: {{ this.material.nombre }}
    <Divider />
    Fecha de la operación: {{ new Date().toLocaleDateString('es-ES') }}
    <Divider />
    Milis {{ this.material.milis }}
    <Divider />
    Credito actual 200 milis
    <Divider />
    Unidad ofertante {{ this.material.dptoOferta }}
    <Divider />

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar (generar PDF)" icon="pi pi-check" class="p-button-text" @click="saveMaterial" />
    </template>
  </Dialog>
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