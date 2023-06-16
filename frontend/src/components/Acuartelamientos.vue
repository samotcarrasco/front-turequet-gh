<script>
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import { acuartelamientosStore } from '@/stores/acuartelamientos'
import { mapState, mapActions } from 'pinia'
import InputText from 'primevue/inputtext'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import { postAcuartelamiento, putAcuartelamiento, deleteAcuartelamiento } from '@/stores/api-service'

export default {
  components: {
    Toast, InputText, Button, Accordion, AccordionTab, Dialog, Dropdown, ProgressSpinner
  },

  data() {
    return {
      acuartDialog: false,
      address: "",
      direccionModal: "",
      error: "",
      acuartDialog: null,
      modalCreate: null,
      submitted: false,
      deleteAcuartDialog: false,
      acuartelamiento: {},
      isLoading: true,
      cabecera: null,
      onDialogShow: undefined
    }
  },

  computed: {
    ...mapState(acuartelamientosStore, ['acuartelamientos']),
    ...mapState(acuartelamientosStore, ['empleos']),
  },

  mounted() {
    const toast = useToast()

    const modalCreate = () => {
      this.acuartelamiento = {}
      this.submitted = false
      this.acuartDialog = true
      this.cabecera = "Alta de nuevo acuartelamiento"
    }

    const hideDialog = () => {
      this.acuartDialog = false
      this.submitted = false
    }

    const saveAcuart = () => {
      this.submitted = true
      this.acuartelamiento.direccion = this.address
      if (this.formularioRellenado(this.acuartelamiento)) {
        if (this.acuartelamiento.id) {
          putAcuartelamiento(this.acuartelamiento).then(r => {
            if (r.status == 200) {
              this.getAcuartelamientos()
              //this.acuartelamientos.splice(this.acuartelamientos.indexOf(this.acuartelamientos), 1, r.data)
              toast.add({ severity: 'success', summary: 'Acuartelamiento actualizado', detail: this.acuartelamiento.nombre, life: 3000 })
            }
          })
       
        } else {
          postAcuartelamiento(this.acuartelamiento).then(r => {
            if (r.status == 200) {
              this.acuartelamientos.unshift(r.data)
              toast.add({ severity: 'success', summary: 'Acuartelamiento creado', detail: this.acuartelamiento.nombre + " se ha creado correctamente", life: 4000 })
            }
          })         
        }
        this.acuartDialog = false
        this.acuartelamiento = {}
      }
    }

    const editAcuart = (editAcuart) => {
      this.acuartelamiento = { ...editAcuart }
      this.acuartDialog = true
      this.cabecera = "Editar acuartelamiento"

    }

    const confirmDeleteAcuart = (acuart) => {
      this.acuartelamiento = acuart
      this.deleteAcuartDialog = true
    }

    const borrarAcuart = () => {
      this.deleteAcuartDialog = false
      deleteAcuartelamiento(this.acuartelamiento).then(r => {
       if (r.status == 200) {  
          this.getAcuartelamientos()
          //this.acuartelamientos.splice(this.acuartelamientos.indexOf(this.acuartelamientos), 1)
          toast.add({ severity: 'success', summary: 'Acuartelamiento eliminado', detail: this.acuartelamiento.nombre, life: 3000 })
        }
      })
      
    }
    this.modalCreate = modalCreate
    this.hideDialog = hideDialog
    this.saveAcuart = saveAcuart
    this.editAcuart = editAcuart
    this.confirmDeleteAcuart = confirmDeleteAcuart
    this.borrarAcuart = borrarAcuart

  },
  methods: {
    ...mapActions(acuartelamientosStore, ['getAcuartelamientos']),
    ...mapActions(acuartelamientosStore, ['getEmpleos']),

    formularioRellenado(acu) {     
      return !(!acu.nombre || ! acu.abreviatura ||
        !acu.email || !acu.responsableNombre ||
        !acu.responsableEmpleo || !acu.telefono) 
      },
  },

  async created() {
    this.isLoading = true
    await this.getAcuartelamientos()
    await this.getEmpleos()
    this.isLoading = false

  }
}
</script>

<template>
  <div class="container">
    <section class="left-section">
      <Toast />
      <div class="card flex justify-content-center" v-if="isLoading">
        <ProgressSpinner />
      </div>
      <div v-else>
        <Button label="Crear nuevo" class="boton-nuevo" icon="pi pi-plus" @click="modalCreate" />
        <div class="card">
          <Accordion :multiple="true" :activeIndex="[0]">
            <AccordionTab v-for="acuartelamiento in acuartelamientos" :header="acuartelamiento.abreviatura"
              :key="acuartelamiento.id">
              <b>
                <p>
                  {{ acuartelamiento.nombre }} <br>
                  <font-awesome-icon icon="fa-solid fa-envelope" />{{ acuartelamiento.email }}<br>
                  <font-awesome-icon icon="fa-solid fa-user" /> {{ acuartelamiento.responsableEmpleo }} {{
                    acuartelamiento.responsableNombre }} <br>
                  <font-awesome-icon icon="fa-solid fa-address-card" /> {{ acuartelamiento.direccion }}<br>
                  <font-awesome-icon icon="fa-solid fa-phone" /> {{ acuartelamiento.telefono }}
                </p>
              </b>
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                @click="editAcuart(acuartelamiento)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                :disabled="acuartelamiento.numDepartamentos > 0" @click="confirmDeleteAcuart(acuartelamiento)" />

            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </section>
  </div>

  <Dialog v-model:visible="acuartDialog" :style="{ width: '70vw' }" :header="cabecera" :modal="true" class="p-fluid"
    @show="onDialogShow">
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Nombre:</label>
        <InputText id="name" v-model.trim="acuartelamiento.nombre" required="true" autofocus
          :class="{ 'p-invalid': submitted && !acuartelamiento.nombre }" />
      </div>
      <div class="field col custom-field">
        <label for="name">Abreviatura:</label>
        <InputText id="name" v-model.trim="acuartelamiento.abreviatura" required="true" autofocus=""
          :class="{ 'p-invalid': submitted && !acuartelamiento.abreviatura }" />
      </div>
      <div class="field col custom-field">
        <label for="name">Email:</label>
        <InputText id="name" v-model.trim="acuartelamiento.email" required="true" autofocus
          :class="{ 'p-invalid': submitted && !acuartelamiento.email }" />
      </div>
    </div>
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Nombre y Apellidos del responsable</label>
        <InputText id="name" v-model.trim="acuartelamiento.responsableNombre" required="true" autofocus=""
          :class="{ 'p-invalid': submitted && !acuartelamiento.responsableNombre }" />
      </div>
      <div class="field col custom-field">
        <label for="empleo">Empleo: </label>
        <Dropdown v-model="acuartelamiento.responsableEmpleo" :options="empleos" placeholder="Seleccione un empleo"
          :class="{ 'p-invalid': submitted && !acuartelamiento.responsableEmpleo }">
          <template #value="empleo">
            <div>
              <span v-if="!empleo.value" class="acuartelamiento-placeholder">Seleccione</span>
              <span v-else :class="'acuartelamiento-badge status-' + empleo.value">{{ empleo.value }}</span>
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="field col custom-field">
        <label for="name">Telefono:</label>
        <InputText id="name" v-model.trim="acuartelamiento.telefono" required="true" autofocus
          :class="{ 'p-invalid': submitted && !acuartelamiento.telefono }" />
      </div>
    </div>

    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Direccion</label>
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />

      </div>
    </div>
    <div id="mapModal" ref="mapModalRef">
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveAcuart" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteAcuartDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="acuartelamiento"> ¿Está seguro que desea eliminar el acuartelamiento <b>{{ acuartelamiento.nombre
      }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAcuartDialog = false" />
      <Button label="Si" icon="pi pi-check" class="p-button-text" @click="borrarAcuart" />
    </template>
  </Dialog>
</template>

<style scoped>
 
.container {
  display: flex;
}
.left-section {
  flex: 1;
  padding-right: 1vw;
  width: 40vw;
}

.boton-nuevo {
  margin-top: 1vw;
  margin-bottom: 1vw;
}

.card {
  margin-top: 1rem;
}

</style>