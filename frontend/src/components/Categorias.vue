
<script>

import { useToast } from 'primevue/usetoast';
//import { useLayout } from '@/layout/composables/layout';
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import { categoriasStore } from '@/stores/categorias';
import { mapState, mapActions } from 'pinia'


export default {
  components: {
    Toast, Button, Dropdown, DataTable, Textarea,
    InputText, Column, InputNumber, Dialog
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
    };
  },
  mounted() {
    const toast = useToast();

    const openNew = () => {
      this.categoria = {};
      this.submitted = false;
      this.categoriaDialog = true;
      this.cabecera = "Alta de nueva categoría"
    };

    const hideDialog = () => {
      this.categoriaDialog = false;
      this.submitted = false;
    };

    // const saveCategoria = () => {
    //     console.log("entrando en la funcion saveCategoria")
    //     this.submitted = true;
    //     if (this.categoria.categoria && this.categoria.descripcion && this.categoria.milis) {
    //         if (this.categoria.id) {
    //             this.categoria.inventoryStatus = this.categoria.inventoryStatus.value ? this.categoria.inventoryStatus.value : this.categoria.inventoryStatus;
    //             this.categorias[this.findIndexById(this.categoria.id)] = this.categoria;
    //             toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria Updated', life: 3000 });
    //         } else {
    //             this.categoria.image = 'categoria-placeholder.svg';
    //             this.categoria.inventoryStatus = this.categoria.inventoryStatus ? this.categoria.inventoryStatus.value : 'INSTOCK';
    //             //this.categorias.push(this.categoria);
    //             this.postCategoria(this.categoria).then(() => { this.getCategorias() });
    //             toast.add({ severity: 'success', summary: 'Categoría creada', detail: 'La categoría' + this.categoria.categoria + " se ha creado correctamente", life: 4000 });
    //         }
    //         this.categoriaDialog = false;
    //         this.categoria = {};
    //     }
    // };

    // const editCategoria = (editCategoria) => {
    //     this.categoria = { ...editCategoria };
    //     console.log(this.categoria);
    //     this.categoriaDialog = true;
    //     this.cabecera = "Editar categoría"

    // };

    // const confirmDeleteCategoria = (editCategoria) => {
    //     this.categoria = editCategoria;
    //     this.deleteCategoriaDialog = true;
    // };

    // const deleteCategoria = () => {
    //     this.categorias = this.categorias.filter((val) => val.id !== this.categoria.id);
    //     this.deleteCategoriaDialog = false;
    //     this.categoria = {};
    //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria Eliminada', life: 3000 });
    // };

    // Variables del componente
    this.openNew = openNew;
    this.hideDialog = hideDialog;
    // this.saveCategoria = saveCategoria;
    //  this.editCategoria = editCategoria;
    // this.confirmDeleteCategoria = confirmDeleteCategoria;
    // this.deleteCategoria = deleteCategoria;
  },
  computed: {
    ...mapState(categoriasStore, ['categorias']),
  },

  methods: {
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(categoriasStore, ['getGrupos']),


    iconoMateriales() {
      return '<font-awesome-icon :icon="[\'fa-sharp\', \'fa-solid\', \'fa-boxes-stacked\']" />';
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },

    getGruposLocal() {
      //     //la función llamada en el return está declarada en el store
      return this.getGrupos()
    },

    // getNumMaterialesPorCategoria(){
    //    return this.getNumeroMaterialesPorCategoria()
    // },

    // asignarMaterialesACategorias(){
    //     this.categorias.forEach(categoria => {
    //     categoria.cantidadMateriales = this.getNumMaterialesPorCategoria()[categoria.categoria] || 0

    //     //console.log ("categoria: ", categoria.categoria , " materiales: ", this.getNumMaterialesPorCategoria()[categoria.categoria] )
    //     })
    // }
  },
  async created() {
    this.initFilters()
    await this.getCategorias()
    console.log("categorias desde el Componente: " + this.categorias)
    this.categorias.forEach(categoria => {
      console.log("categoria: ", categoria.categoria)
    })
  },
}
</script>



<template>
  <div class="grid">
    <div class="col-11">
      <div class="card">
        <Toast />
        <!-- <DataTable ref="dt" :value="categorias" v-model:selection="selectedCategorias" dataKey="categoria.id" -->
        <DataTable ref="dt" :value="categorias" dataKey="categoria.id" :paginator="true" :rows="10" :filters="filters"
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
                <Button label="Crear nueva" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
              </div>
            </div>
          </template>

          <Column field="categoria" header="Categoria" :sortable="true" headerStyle="width:16%; min-width:12rem;">
          </Column>
          <Column field="grupo" header="Grupo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          </Column>
          <Column field="minMilis" header="μilis" :sortable="true" headerStyle="width:10%; min-width:4rem;"
            :sort-field="minMilis">
            <template #body="slotProps">
              {{ slotProps.data.minMilis }}-{{ slotProps.data.maxMilis }}
            </template>
          </Column>
          <Column field="descripcion" header="Descripcion" :sortable="false" headerStyle="width:20%; min-width:20rem;">
          </Column>
          <Column field="numMateriales" header="Materiales" :sortable="true" headerStyle="width:10%; min-width:6rem;">
          </Column>
          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
              <!-- @click="editCategoria(slotProps.data)" /> -->
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                :disabled="slotProps.data.numMateriales > 0" />
              <!-- @click="confirmDeleteCategoria(slotProps.data)" /> -->
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="categoriaDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true"
          class="p-fluid">
          <div class="field">
            <label for="name">Nombre de la categoría</label>
            <InputText id="name" v-model.trim="categoria.categoria" required="true" autofocus
              :class="{ 'p-invalid': submitted && !categoria.categoria }" />
            <small class="p-invalid" v-if="submitted && !categoria.categoria">El nombre de la categoría es
              obligatorio</small>
          </div>
          <div class="field">
            <label for="descripcion">Descripción</label>
            <Textarea id="descripcion" v-model="categoria.descripcion" required="true" rows="3" cols="20" />
            <small class="p-invalid" v-if="submitted && !categoria.descripcion">Es obligatorio aportar una
              descripción
            </small>
          </div>

          <div class="field">
            <label for="grupo" class="mb-3">Grupo</label>
            <Dropdown id="grupo" v-model="categoria.grupo" :options="getGrupos()" optionLabel="label"
              placeholder="Seleccion grupo">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'categoria-badge status-' + slotProps.value.value">{{
                    slotProps.value.label
                  }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span :class="'categoria-badge status-' + slotProps.value.toLowerCase()">{{
                    slotProps.value }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="minMilis">μilis MIN</label>
              <InputNumber id="minMilis" v-model="categoria.minMilis"
                :class="{ 'p-invalid': submitted && !categoria.minMilis }" :required="true" />
              <small class="p-invalid" v-if="submitted && !categoria.minMilis">μilis MIN obligatorio.</small>
              <label for="maxMilis">μilis MAX</label>
              <InputNumber id="maxMilis" v-model="categoria.maxMilis"
                :class="{ 'p-invalid': submitted && !categoria.maxMilis }" :required="true" />
              <small class="p-invalid" v-if="submitted && !categoria.maxMilis">μilis MAX obligatorio.</small>
            </div>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCategoria" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteCategoriaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="categoria">¿Está seguro que desea eliminar la categoría? <b>{{ categoria.name
            }}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCategoriaDialog = false" />
            <Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteCategoria" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* <style scoped lang="scss"> */
/* @import '@/assets/demo/styles/badges.scss'; */

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
</style>
