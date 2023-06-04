
<script>

import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import InputSwitch from 'primevue/inputswitch'
import ProgressSpinner from 'primevue/progressspinner'
import { categoriasStore } from '@/stores/categorias'
import { mapState, mapActions } from 'pinia'
import { host } from '@/stores/api-service'


export default {
  components: {
    Toast, Button, Dropdown, DataTable, Textarea,
    InputText, Column, InputNumber, Dialog, ProgressSpinner, InputSwitch
  },

  data() {

    return {
      categoriaDialog: false,
      deleteCategoriaDialog: false,
      cabecera: "",
      categoria: {},
      dt: null,
      filters: {},
      submitted: false,
      minMilis: undefined,  //para solucionar warings al cargar las categorias
      modalEditCreate: null,
      isLoading: true,
      esPrincipal: undefined

    }
  },
  mounted() {

    const toast = useToast()

    const modalEditCreate = () => {
      this.categoria = {}
      this.submitted = false
      this.categoriaDialog = true
      this.cabecera = "Alta de nueva categoría"
    }

    const hideDialog = () => {
      this.categoriaDialog = false
      this.submitted = false
    }

    const saveCategoria = () => {
      this.submitted = true

      const catPadre = this.catPrincipales.find(cat => cat.categoria === this.categoria.grupo)

      if (catPadre) {
        this.categoria.categoriaPadre = host + "api/categorias/" + catPadre.id
      }

      console.log("entrando en la funcion saveCategoria con la categoria: " + this.categoria)

      //detalle para mostrar en los toast
      const detalle = this.categoria.categoria

      if (this.formularioRellenado(this.categoria)) {
        //  console.log("punto 1")
        if (this.categoria.id) {
            //  console.log("punto 2", this.categoria.categoria)
          this.putCategoria(this.categoria).then(() => { this.getCategorias() 
          toast.add({ severity: 'success', summary: 'Categoría actualizada', detail: detalle, life: 3000 })
          })
          .catch(error => {
              toast.add({ severity: 'error', summary: 'Error. No se ha podido crear la categoría', detail: detalle, life: 4000 })
            })
        } else {
          //     console.log("punto 3")

          console.log(JSON.stringify(this.categoria))
          this.postCategoria(this.categoria).then(() => {
            this.getCategorias()
            toast.add({ severity: 'success', summary: 'Categoría creada', detail: detalle, life: 4000 })
          })
            .catch(error => {
              toast.add({ severity: 'error', summary: 'Error. No se ha podido editar la categoría', detail: detalle, life: 4000 })
            })
        }
        this.categoriaDialog = false
        this.categoria = {}
      }
    }

    const editCategoria = (editCategoria) => {
      this.categoria = { ...editCategoria }
      console.log(this.categoria)
      this.categoriaDialog = true
      this.cabecera = "Editar categoría"

    }

    const confirmDeleteCategoria = (categoria) => {
      this.categoria = categoria
      this.deleteCategoriaDialog = true
    }

    //cambiamos deleteCategoria por borrarCategoria
    //para que no entre en bucle con la variable del store
    const borrarCategoria = () => {
      //this.categorias = this.categorias.filter((val) => val.id !== this.categoria.id)
      this.deleteCategoriaDialog = false
      //console.log("antes de borrar")
      this.deleteCategoria(this.categoria).then(() => { this.getCategorias() })
      toast.add({ severity: 'success', summary: 'Categoría eliminada', detail: this.categoria.categoria, life: 3000 })

    }

    this.modalEditCreate = modalEditCreate
    this.hideDialog = hideDialog
    this.saveCategoria = saveCategoria
    this.editCategoria = editCategoria
    this.confirmDeleteCategoria = confirmDeleteCategoria
    this.borrarCategoria = borrarCategoria
  },
  computed: {
    ...mapState(categoriasStore, ['categorias']),
    //  ...mapState(categoriasStore, ['grupos']),
    ...mapState(categoriasStore, ['catPrincipales']),

    getGrupos() {
      const grupos = []
      this.catPrincipales.forEach(cat => {
        grupos.push(cat.categoria)
      })
      return grupos
    }
  },

  methods: {
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(categoriasStore, ['postCategoria']),
    ...mapActions(categoriasStore, ['putCategoria']),
    ...mapActions(categoriasStore, ['deleteCategoria']),
    // ...mapActions(categoriasStore, ['getGrupos']),
    ...mapActions(categoriasStore, ['getCategoriasPrincipales']),

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    },

    formularioRellenado(cat) {
      if (!this.esPrincipal)
        return (cat.categoria &&
          cat.descripcion &&
          cat.minMilis &&
          cat.maxMilis &&
          cat.grupo &&
          (cat.minMilis <= cat.maxMilis))
      else
        return (cat.categoria &&
          cat.descripcion)
    },

  },
  async created() {
    this.initFilters()
    this.isLoading = true
    await this.getCategorias()

    //await this.getGrupos()

    await this.getCategoriasPrincipales()

    this.isLoading = false

    //console.log("categorias desde el Componente: " + this.categorias)
    // this.categorias.forEach(categoria => {
    //   console.log("categoria: ", categoria.categoria)
    //   console.log("id: ", categoria.id)
    // })
    // console.log("grupos", this.getGrupos)
  },
}
</script>



<template>
  <div class="grid">
    <div class="col-11">
      <div class="card">
        <Toast />
        <!-- <DataTable ref="dt" :value="categorias" v-model:selection="selectedCategorias" dataKey="categoria.id" -->
        <div class="card flex justify-content-center" v-if="isLoading">
          <ProgressSpinner />
        </div>

        <DataTable v-else ref="dt" :value="categorias" dataKey="categoria.id" :paginator="true" :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} categorias" responsiveLayout="scroll">
          <template #header>
            <div class="flex flex-row justify-between items-center">
              <div class="flex items-center">
                <span class="block mt-2 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                </span>
              </div>
              <div>
                <Button label="Crear nueva" icon="pi pi-plus" class="p-button-success mr-2" @click="modalEditCreate" />
              </div>
            </div>
          </template>
          <Column field="categoria" header="Categoria" :sortable="true" headerStyle="width:16%; min-width:12rem;">
          </Column>
          <Column field="grupo" header="Grupo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          </Column>
          <Column field="minMilis" header="μilis" :sortable="true" headerStyle="width:10%; min-width:4rem;"
            :sort-field="minMilis">
            <template #body="cat">
              {{ cat.data.minMilis ? cat.data.minMilis + '-' + cat.data.maxMilis : null }}
            </template>
          </Column>
          <Column field="descripcion" header="Descripcion" :sortable="false" headerStyle="width:20%; min-width:20rem;">
          </Column>
          <Column field="numMateriales" header="Materiales" :sortable="true" headerStyle="width:10%; min-width:6rem;">
          </Column>
          <Column headerStyle="min-width:10rem;">
            <template #body="cat">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                @click="editCategoria(cat.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                :disabled="cat.data.numMateriales > 0" @click="confirmDeleteCategoria(cat.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="categoriaDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true"
          class="p-fluid">
          <div class="field col custom-field-switch">
            <label for="esPrincipal" class="custom-label">Categoría principal </label>
            <InputSwitch v-model="esPrincipal" class="custom-input-switch" />
          </div>
          <div class="field">
            <label for="name">Nombre de la categoría</label>
            <InputText id="name" v-model.trim="categoria.categoria" required="true" autofocus
              :class="{ 'p-invalid': submitted && !categoria.categoria }" />
          </div>
          <div class="field">
            <label for="descripcion">Descripción</label>
            <Textarea id="descripcion" v-model="categoria.descripcion" required="true" rows="2" cols="20"
              :class="{ 'p-invalid': submitted && !categoria.descripcion }" :required="true" />
          </div>

          <div v-if="!esPrincipal" class="field">
            <label for="grupo" class="mb-3">Grupo</label>
            <Dropdown v-if="catPrincipales" id="grupo" v-model="categoria.grupo" :options="getGrupos"
              :class="{ 'p-invalid': submitted && !categoria.grupo }" placeholder="Seleccione grupo">
              <template #value="grupo">
                <div>
                  <span v-if="!grupo.value" class="categoria-placeholder">Seleccione</span>
                  <span v-else :class="'categoria-badge status-' + grupo.value">{{ grupo.value }}</span>
                </div>
              </template>
            </Dropdown>
          </div>

          <div v-if="!esPrincipal" class="formgrid grid">
            <div class="field col">
              <label for="minMilis">μilis MIN</label>
              <InputNumber id="minMilis" v-model="categoria.minMilis" rows="1" cols="3"
                :class="{ 'p-invalid': submitted && !categoria.minMilis || categoria.minMilis > categoria.maxMilis }"
                :required="true" />
              <label for="maxMilis">μilis MAX</label>
              <InputNumber id="maxMilis" v-model="categoria.maxMilis"
                :class="{ 'p-invalid': submitted && !categoria.maxMilis || categoria.minMilis > categoria.maxMilis }"
                :required="true" />
            </div>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCategoria" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }"
          header="Confirmación de borrado de categoría" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="categoria">¿Está seguro que desea eliminar la categoría <b>{{ categoria.categoria
            }}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCategoriaDialog = false" />
            <Button label="Si" icon="pi pi-check" class="p-button-text" @click="borrarCategoria" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.justify-between {
  justify-content: space-between;
}

.p-button-rounded {
  margin-left: 4px;
}

.p-button.p-button-success,
.p-button.p-button-warning {
  color: #fff;
  background: rgb(136, 158, 89);
  border: 0 none;
}

.formgrid.grid .field.col {
  display: flex;
  align-items: center;
}

.formgrid.grid .field.col label {
  width: 100px;
  margin: 1vw;
}

.p-datatable-tbody .p-datatable-row {
  padding-top: 0;
  padding-bottom: 0;
}

.custom-input-switch {
  margin-top: 4px;
  margin-left: 1rem;
}

.custom-field-switch {
  display: flex;
  justify-content: center;
}
</style>