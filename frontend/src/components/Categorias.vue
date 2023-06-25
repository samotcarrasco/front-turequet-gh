
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
import { putCategoria, postCategoria, deleteCategoria } from '@/stores/api-service'



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
      minMilis: undefined,
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
        this.categoria.categoriaPadre = catPadre._links.self.href
      }


      if (this.formularioRellenado(this.categoria)) {
        if (this.categoria.id) {
          putCategoria(this.categoria).then(r => {
            if (r.status == 200) {
              this.getCategorias()
              toast.add({ severity: 'success', summary: 'Categoría modificada', detail: this.categoria.categoria, life: 3000 })
            }
          })
        } else {
          postCategoria(this.categoria).then(r => {
            if (r.status == 200) {
              this.categorias.unshift(r.data)
              toast.add({ severity: 'success', summary: 'Categoría creada', detail: this.categoria.categoria, life: 3000 })
            }
          })
        }
        this.categoriaDialog = false
        this.categoria = {}
      }
    }

    const editCategoria = (editCategoria) => {
      this.categoria = { ...editCategoria }
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
      this.deleteCategoriaDialog = false

      deleteCategoria(this.categoria).then(r => {
        if (r.status == 200) {
          this.categorias.splice(this.categorias.indexOf(this.categoria), 1)
          //this.categorias = this.categorias.filter(item => item !== this.categoria);
          toast.add({ severity: 'success', summary: 'Categoria eliminado', detail: this.categoria.categoria, life: 3000 })
        }
      })
    }

    this.modalEditCreate = modalEditCreate
    this.hideDialog = hideDialog
    this.saveCategoria = saveCategoria
    this.editCategoria = editCategoria
    this.confirmDeleteCategoria = confirmDeleteCategoria
    this.borrarCategoria = borrarCategoria
  },
  computed: {
    ...mapState(categoriasStore, ['categorias', 'catPrincipales']),
    
    getGrupos() {
      const grupos = []
      this.catPrincipales.forEach(cat => {
        grupos.push(cat.categoria)
      })
      return grupos
    }
  },

  methods: {
    ...mapActions(categoriasStore, ['getCategorias', 'getCategoriasPrincipales']),
    

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
    await this.getCategoriasPrincipales()

    this.isLoading = false
  },
}
</script>

<template>
  <div class="grid">
    <div class="col-11">
      <div class="card">
        <Toast />
        <div class="card flex justify-content-center" v-if="isLoading">
          <ProgressSpinner />
        </div>

        <DataTable v-else ref="dt" :value="categorias" dataKey="categoria.id" :paginator="true" :rows="10"
          :filters="filters" tableStyle="min-width: 50rem"
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

        <Dialog v-model:visible="categoriaDialog" :header="cabecera" :modal="true"
          class="p-fluid">
          <div class="field col custom-field-switch">
            <label for="esPrincipal" class="custom-label">Categoría principal </label>
            <InputSwitch v-model="esPrincipal" class="custom-input-switch" />
          </div>
          <div v-if="!esPrincipal" class="field">
            <Dropdown v-if="catPrincipales" id="grupo" v-model="categoria.grupo" :options="getGrupos"
              :class="{ 'p-invalid': submitted && !categoria.grupo }">
              <template #value="grupo">
                <div>
                  <span v-if="!grupo.value" class="categoria-placeholder">Seleccione categoría principal</span>
                  <span v-else :class="'categoria-badge status-' + grupo.value">{{ grupo.value }}</span>
                </div>
              </template>
            </Dropdown>
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
.grid {
  display: grid;
  justify-content: center;
}

.card {
  margin-top: 16px;
}

@media (max-width: 600px) {
  .col-11 {
    width: auto;
    max-width: none;
    margin-left: 200vw;
  }
}
</style>