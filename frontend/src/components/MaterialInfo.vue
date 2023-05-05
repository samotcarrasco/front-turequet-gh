<script>
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
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
      detallesAdqDialog: false,
      cabecera: ""
    }
  },
  props: {
    // tipoVista: {
    //   type: String,
    //   required: true
    // }
  },
  components: { Toast, Card, Button, Galleria, Dialog, Divider },

  computed: {
    ...mapState(materialesStore, ['materiales']),
    ...mapState(materialesStore, ['materialActual']),
    ...mapState(departamentosStore, ['dptoActual']),
    ...mapState(departamentosStore, ['dptoActualAPI']),

    // material() {
    //   // return this.participantes.find(p => p.id == this.$route.params.id)
    //   return this.getMaterialPorId(this.$route.params.id)
    // },
  },
  methods: {
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(materialesStore, ['getMaterialPorId']),
    ...mapActions(materialesStore, ['putMaterial']),
    ...mapActions(departamentosStore, ['putAumentarCretido']),

    eliminarMaterial() {
      // Lógica para eliminar el material
    },

    materialAdquirido(material) {
      // console.log("acutal", this.dptoActual)
      // console.log("adquisicion", this.dptoActualAPI);
      // console.log("DPTO ACTUAL API:" + this.dptoActualAPI._links.self.href);
      // console.log("ofertante", material.dptoOfertaN)
      // console.log("estado", material.estado)
      //console.log("material actual", JSON.stringify(this.materialActual))

      return material.dptoAdquisicionN == this.dptoActual && material.estado == "adquirido"
    },
    materialOfertado(material) {
      return material.dptoOfertaN == this.dptoActual && material.estado == "disponible"
    },
    materialDisponible(material) {
      return material.dptoOfertaN !== this.dptoActual && material.estado == "disponible"
    },

    obtenerCategoria(material) {
    },

    adquirirMaterial(material) {
      this.material = { ...material };
      console.log(this.material);
      this.adquirirDialog = true;
      this.cabecera = "Adquirir material";
    },

    mostrarDetallesAdq(material) {
      this.materal = { ...material };
      this.detallesAdqDialog = true;
      this.cabecera = "Detalles de la adquisición"
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

    },

    goBack() {
      console.log('Botón volver presionado');
      this.$router.push({ name: 'materiales' });
      window.location.reload();
      window.location.reload();
      window.location.reload();
      window.location.reload();
      
    }


  },
  mounted() {
    // console.log("mountedddd ", this.$route.query.tipoVista);

    const toast = useToast();

    const modalAdquirirMaterial = () => {
      this.material = {};
      this.submitted = false;
      this.adquirirDialog = true;
      this.cabecera = "Confirmación de adquisición de material"
    };

    const modalDetallesAdq = () => {
      this.material = {};
      this.submitted = false;
      this.detallesAdqDialog = true;
      this.cabecera = "Detalles de la adquisición de material"
    };

    const hideDialog = () => {
      this.adquirirDialog = false;
      this.submitted = false;
    };

    const hideDialogDet = () => {
      this.mostrarDetallesAdq = false;
      this.submitted = false;
    };


    const saveMaterial = () => {
      this.submitted = true;

      this.generarPDF(this.material);
      //console.log("actualizando material: " +  JSON.stringify(this.material))
      //actualizamos el material con la info correspondiente
      this.material.estado = "adquirido"
      //this.material.dptoAdquisicion = this.dptoActualAPI
      this.material.categoria = this.material._links.categoria.href;
      this.material.dptoAdquisicion = this.dptoActualAPI._links.self.href
      // console.log ("dpto adquisicion" + this.material.dptoAdquisicion)
      this.material.dptoOferta = this.material._links.dptoOferta.href;
      delete this.material._links;
      this.material.fechaAdquisicion = new Date()
      //console.log("actualizando material: " +  JSON.stringify(this.material))
      Promise.all([
        this.putMaterial(this.material, this.material.id),
        this.putAumentarCretido(this.material.dptoAdquisicion.split("/").pop(), -this.material.milis),
        this.putAumentarCretido(this.material.dptoOferta.split("/").pop(), this.material.milis)
      ]).then(() => {
        this.getMateriales();
        console.log("Actualizando credito de unidades implicadas");
        toast.add({ severity: 'success', summary: 'OK', detail: 'Adquisición de material finalizada', life: 3000 });
      }).catch((error) => {
        console.error('Error al actualizar material:', error);
      });
    }


    this.modalAdquirirMaterial = modalAdquirirMaterial;
    this.modalDetallesAdq = modalDetallesAdq;
    this.hideDialog = hideDialog;
    this.hideDialogDet = hideDialogDet;
    this.saveMaterial = saveMaterial;


  },


  async created() {

    //iniciamos la aplicación con rol gestor  

    console.log("OBTENIDODO MATERIAL POR ID: ", this.$route.params.id);
    await this.getMaterialPorId(this.$route.params.id);
    console.log("material string: ", JSON.stringify(this.materialActual))
    this.material = this.materialActual;

  }
}
</script>

<template>
  <Toast />
   dddd
  <p @click="goBack">asasdf</p>
  <Card :style="{ backgroundColor: '#dfe0d6' }" class="p-col-4">
    <template #title> {{ material.nombre }} </template>
    <template #subtitle> {{ material.milis }} μ </template>
    <template #content>
      <div class="row">
        <div class="col-sm-4">
          <div class="p-mb-2"><strong>Descripción:</strong> {{ material.descripcion }}</div>
          <div class="p-mb-2"><strong>Categoría:</strong> {{ material.categoriaN }}</div>
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
          <!-- <img :src="material.imagen" alt="Imagen del material" style="max-width: 30vw"> -->
          <img :src="'data:image/png;base64,' + material.data.imagen" :alt="material.data.imagen"
            class="w-6rem shadow-2 border-round img-small" />
          <Galleria v-model:visible="displayBasic" :value="images" :responsiveOptions="responsiveOptions" :numVisible="9"
            containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true">
            <template #item="slotProps">
              <!-- <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" /> -->
              <!-- <img :src="'data:image/png;base64,' + material.data.imagen" :alt="material.data.imagen" -->
            <!-- class="w-6rem shadow-2 border-round img-small" /> -->
            </template>
            <template #thumbnail="slotProps">
              <!-- <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" /> -->
            </template>
          </Galleria>

          <Button label="Show" icon="pi pi-external-link" @click="displayBasic = true" />
        </div>
        <div class="p-mb-2">
          <Button v-if="materialDisponible(this.materialActual)" label="Adquirir" icon="pi pi-shopping-cart"
            class="p-button-success" @click="adquirirMaterial(material)" />
          <Button v-if="materialOfertado(material)" label="Editar" icon="pi pi-pencil" class="p-button-secondary" />
          <Button v-if="materialOfertado(material)" label="Eliminar" icon="pi pi-trash" class="p-button-danger" />
          <!-- <Button v-if="tipoVista === 'ofertados'" label="Eliminar" icon="pi pi-trash" class="p-button-danger" /> -->
          <Button v-if="materialAdquirido(material)" label="Ver detalles de adquisición" class="p-button-info"
            @click="mostrarDetallesAdq(material)" />
          <!-- <router-link :to="{ name: 'materiales' }  />"> -->
          <!-- <Button label="Volver" icon="pi pi-arrow-left" class="p-button-secondary" @click="goBack" /> -->
          <!-- </router-link> -->
          <!-- <router-link class="nav-link" :to="{ name: 'materiales' } @click="goBack" />">volver</router-link> -->

        </div>
      </div>
    </template>
  </Card>
  dddd
  <p @click="goBack">asasdf</p>
  <Button label="Volver" icon="pi pi-arrow-left" class="p-button-secondary" @click="goBack" />


  <Dialog v-model:visible="adquirirDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true" class="p-fluid">
    Nombre del material: {{ this.material.nombre }}
    <Divider />
    Fecha de la operación: {{ new Date().toLocaleDateString('es-ES') }}
    <Divider />
    Milis {{ this.material.milis }}
    <Divider />
    Credito actual 200 milis
    <Divider />
    Unidad ofertante {{ this.material.dptoOfertaN }}
    <Divider />

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Confirmar (generar PDF)" icon="pi pi-check" class="p-button-text"
        @click="saveMaterial(); hideDialog()" />
    </template>
  </Dialog>

  <Dialog v-model:visible=" detallesAdqDialog " :style=" { width: '50vw' } " :header=" cabecera " :modal=" true "
    class="p-fluid">
    Nombre del material: {{ this.material.nombre }}
    <Divider />
    Fecha de la operación:{{ this.material.fechaAdquisicion }}
    <Divider />
    Milis: {{ this.material.milis }}
    <Divider />
    Unidad ofertante {{ this.material.dptoOfertaN }}
    <Divider />
    <template #footer>
      <Button label="OK" icon="pi pi-times" class="p-button-text" @click=" hideDialogDet " />
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