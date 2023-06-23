<script>
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import { mapActions, mapState } from 'pinia'
import { materialesStore } from '@/stores/materiales'
import { departamentosStore } from '@/stores/departamentos'
import jsPDF from 'jspdf'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Galleria from 'primevue/galleria'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'


export default {
  components: { Toast, Card, Button, Galleria, Dialog, Divider, ProgressSpinner },

  data() {
    return {
      material: {},
      submitted: false,
      adquirirDialog: false,
      detallesAdqDialog: false,
      cabecera: "",
      isLoading: true,
    }
  },

  computed: {
    ...mapState(materialesStore, ['materiales']),
    ...mapState(materialesStore, ['materialActual']),
    ...mapState(departamentosStore, ['dptoActual']),
    ...mapState(departamentosStore, ['dptoActualAPI']),

  },
  methods: {
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(materialesStore, ['getMaterialPorId']),
    ...mapActions(materialesStore, ['putMaterial']),
    ...mapActions(departamentosStore, ['putAumentarCretido']),

    materialAdquirido(material) {
      return (material.dptoAdquisicionN == this.dptoActual || material.dptoOfertaN == this.dptoActual)
        && (material.estado == "entregado" || material.estado == "recepcionado")
    },
    materialOfertado(material) {
      return material.dptoOfertaN == this.dptoActual && material.estado == "disponible"
    },
    materialDisponible(material) {
      return material.dptoOfertaN !== this.dptoActual && material.estado == "disponible"
    },


    adquirirMaterial(material) {
      this.material = material
      this.adquirirDialog = true
      this.cabecera = "Adquirir material"
    },

    mostrarDetallesAdq(material) {
      this.detallesAdqDialog = true
      this.cabecera = "Detalles de la adquisición"
    },


    generarPDF(material) {
      const doc = new jsPDF()

      const logo = new Image()
      const logoACING = new Image()

      logo.src = "./logos/logo.png"
      logoACING.src = "./logos/logoACING.png"

      const logoWidth = 12
      const logoHeight = 12
      const logoACINGWidth = 12
      const logoACINGHeight = 18


      doc.addImage(logo, 'PNG', 10, 6, logoWidth, logoHeight)
      doc.addImage(logoACING, 'PNG', 180, 4, logoACINGWidth, logoACINGHeight)
      doc.setFontSize(16)
      doc.text('SISTEMA TRUEQUET', doc.internal.pageSize.getWidth() / 2, 10, null, null, 'center')
      doc.setFontSize(14)
      doc.text('DOCUMENTO DE INTERCAMBIO DE MATERIAL', doc.internal.pageSize.getWidth() / 2, 20, null, null, 'center')
      doc.setFontSize(12)
      doc.line(10, 30, doc.internal.pageSize.getWidth() - 10, 30)
      doc.text(`Material intercambiado: ${material.nombre}`, 10, 40)
      doc.text(`Descripción: ${material.descripcion}`, 10, 50)
      doc.text(`Crédito en μilis: ${material.milis}`, 10, 60)
      doc.text(`Unidad ofertante: ${material.dptoOfertaN}`, 10, 70)
      doc.text('Responsable:', 10, 80)
      doc.text('Teléfono:', 10, 90)
      doc.text(`Unidad que adquiere el material: ${material.dptoAdquisicionN}`, 10, 100)
      doc.text('Responsable:', 10, 110)
      doc.text('Teléfono:', 10, 120)
      doc.line(10, 130, doc.internal.pageSize.getWidth() - 10, 130)
      doc.text(`Fecha del sistema: ${new Date().toLocaleDateString('es-ES')}`, 10, 140)
      doc.text('Fecha en la que se produce el intercambio:____________________', 10, 150)
      doc.text('Fdo: Unidad que entrega el material         Fdo: Unidad que adquiere el material', 10, 200)
      doc.save(`intercambio-material${material.nombre}.pdf`)

    },

  },
  mounted() {

    const toast = useToast()

    const modalAdquirirMaterial = () => {
      this.material = {}
      this.submitted = false
      this.adquirirDialog = true
      this.cabecera = "Confirmación de adquisición de material"
    }

    const modalDetallesAdq = () => {
      this.material = {}
      this.submitted = false
      this.detallesAdqDialog = true
      this.cabecera = "Detalles de la adquisición de material"
    }

    const hideDialog = () => {
      this.adquirirDialog = false
      this.submitted = false
    }

    const hideDialogDet = () => {
      this.mostrarDetallesAdq = false
      this.submitted = false
    }


    const saveMaterial = () => {
      this.submitted = true

      this.generarPDF(this.material)
      this.material.estado = "pendiente"
      this.material.categoria = this.material._links.categoria.href
      this.material.dptoAdquisicion = this.dptoActualAPI._links.self.href
      this.material.dptoAdquisicionN = this.dptoActual
      this.material.dptoOferta = this.material._links.dptoOferta.href
      this.material.imgReducida = this.material.imagen
      delete this.material._links
      this.material.fechaAdquisicion = new Date()

      Promise.all([
        this.putMaterial(this.material, this.material.id),
        this.putAumentarCretido(this.material.dptoAdquisicion.split("/").pop(), -this.material.milis * this.material.cantidad),
        this.putAumentarCretido(this.material.dptoOferta.split("/").pop(), this.material.milis * this.material.cantidad)
      ]).then(() => {
        this.materiales.splice(this.materiales.indexOf(this.materiales), 1, this.material)
        toast.add({ severity: 'success', summary: 'Adquisición realizada', detail: this.material.nombre, life: 3000 })
      }).catch((error) => {
        console.error('Error al actualizar material:', error)
      })
    }

    this.modalAdquirirMaterial = modalAdquirirMaterial
    this.modalDetallesAdq = modalDetallesAdq
    this.hideDialog = hideDialog
    this.hideDialogDet = hideDialogDet
    this.saveMaterial = saveMaterial
  },

  async created() {
    this.isLoading = true
    await this.getMaterialPorId(this.$route.params.id)
    this.material = this.materialActual
    this.isLoading = false
  }
}
</script>

<template>
  <Toast />
  <div class="card flex justify-content-center" v-if="isLoading">
    <ProgressSpinner />
  </div>
  <Card v-else :style="{ backgroundColor: '#dfe0d6' }" class="p-col-4">
    <template #title> {{ material.nombre }} </template>
    <template #subtitle> {{ material.milis }} μ </template>
    <template #content>
      <div class="row">
        <div class="col-sm-4">
          <div class="p-mb-2"><strong>Departamento oferta:</strong> {{ material.dptoOfertaN }}</div>
          <div class="p-mb-2"><strong>Descripción:</strong> {{ material.descripcion }}</div>
          <div class="p-mb-2"><strong>Categoría:</strong> {{ material.categoriaN }}</div>
          <div class="p-mb-2"><strong>Grupo:</strong> {{ material.grupoN }}</div>
          <div class="p-mb-2"><strong>Peso:</strong> {{ material.peso }} kg</div>
          <div class="p-mb-2"><strong>Dimensiones:</strong> {{ material.dimensiones }}</div>
          <div class="p-mb-2"><strong>Fecha de adquisición:</strong> {{ material.fechaAdquisicion }}</div>
          <div class="p-mb-2"><strong>Tipo de material:</strong> {{ material.tipoMaterial }}</div>
          <div v-if="material.tipoMaterial == 'Inventariable'" class="p-mb-2"><strong>NOC:</strong> {{ material.noc }}
          </div>
          <div v-if="material.tipoMaterial == 'Inventariable'" class="p-mb-2"><strong>Número de serie:</strong> {{
            material.numeroSerie }}</div>

        </div>
        <div class="col-sm-4">
          <img :src="material.imagen" alt="Imagen del material" style="max-width: 30vw">
        </div>
        <div class="p-mb-2">
          <Button v-if="materialDisponible(this.materialActual)" label="Adquirir" icon="pi pi-shopping-cart"
            @click="adquirirMaterial(material)" />
          <Button v-if="materialAdquirido(material)" label="Ver detalles intercambio" class="p-button-info"
            @click="mostrarDetallesAdq(material)" />
        </div>
      </div>
      <router-link :to="{ name: 'materiales' }" class="centrado-verde">Volver a materiales</router-link>
    </template>
  </Card>

  <Dialog v-model:visible="adquirirDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true" class="p-fluid">
    <div>
      <p><span class="dialog-label">Nombre del material:</span> <span class="dialog-value">{{ material.nombre }}</span>
      </p>
      <Divider />
      <p><span class="dialog-label">Fecha de la operación:</span> <span class="dialog-value">{{ new
        Date().toLocaleDateString('es-ES') }}</span></p>
      <Divider />
      <p><span class="dialog-label">μilis:</span> <span class="dialog-value">{{ material.milis }}</span></p>
      <Divider />
      <p><span class="dialog-label">Unidad ofertante:</span> <span class="dialog-value">{{ material.dptoOfertaN }}</span>
      </p>
      <Divider />
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Confirmar (generar PDF)" icon="pi pi-check" class="p-button-text"
        @click="saveMaterial(); hideDialog()" />
    </template>
  </Dialog>

  <Dialog v-model:visible="detallesAdqDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true" class="p-fluid">
    <div>
      <span class="dialog-label">Nombre del material:</span> <span class="dialog-value">{{ material.nombre }}</span>
      <Divider />
      <span class="dialog-label">Fecha de la operación:</span> <span class="dialog-value">{{ material.fechaAdquisicion
      }}</span>
      <Divider />
      <span class="dialog-label">Milis:</span> <span class="dialog-value">{{ material.milis }}</span>
      <Divider />
      <span class="dialog-label">Unidad ofertante:</span> <span class="dialog-value">{{ material.dptoOfertaN }}</span>
      <Divider />
      <Divider />
      <span class="dialog-label">Fecha de entrega/recepción:</span> <span class="dialog-value">{{
        material.fechaEntregaFisica }}</span>
      <Divider />
    </div>
    <template #footer>
      <Button label="OK" icon="pi pi-times" class="p-button-text" @click="hideDialogDet" />
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-label {
  font-weight: bold;
  font-size: 1.2em;
}

.dialog-value {
  font-size: 1.2em;
}

.centrado-verde {
  display: block;
  text-align: center;
  color:  rgb(77, 102, 23);
}

</style>
