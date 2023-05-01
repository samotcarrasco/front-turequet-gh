<script>
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import { departamentosStore } from '@/stores/departamentos'
import { materialesStore } from '@/stores/materiales'
//import { categoriasStore } from '@/stores/categorias'
import { mapState, mapActions } from 'pinia'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from 'primevue/api';


export default {
  provide: {
    tipoVista: undefined
  },
  data() {
    return {
      materialDialog: false,
      deleteMaterialDialog: false,
      categoriasFiltro: [],
      categoriasSeleccionadas: [],
      visible: false,
      filters: {}
    }
  },
  mounted() {
   
    const modalEditCreate = () => {
      this.material = {}
      this.submitted = false
      this.materialDialog = true
      this.cabecera = "Alta de nuevo material"
    };

    const hideDialog = () => {
      this.materialDialog = false
      this.submitted = false
    };

    const saveMaterial = () => {
      console.log("entrando en la funcion saveMaterial")
      this.submitted = true;

      // if (this.formularioRellenado(this.categoria)) {
      //   console.log("punto 1");
      //   if (this.categoria.id) {
      //     console.log("punto 2");
      //     //  this.categoria.inventoryStatus = this.categoria.inventoryStatus.value ? this.categoria.inventoryStatus.value : this.categoria.inventoryStatus;
      //     // this.categorias[this.findIndexById(this.categoria.id)] = this.categoria;
      //     //llamad a metodo putcategoria(pendiente de desarrollo)
      //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria actualizada', life: 3000 });
      //   } else {
      //     console.log("punto 3");
      //     // this.categoria.image = 'categoria-placeholder.svg';
      //     //this.categoria.inventoryStatus = this.categoria.inventoryStatus ? this.categoria.inventoryStatus.value : 'INSTOCK';
      //     //this.categorias.push(this.categoria);
      //     console.log(this.categoria);
      //     this.postCategoria(this.categoria).then(() => { this.getCategorias() });
      //     toast.add({ severity: 'success', summary: 'Categoría creada', detail: 'La categoría' + this.categoria.categoria + " se ha creado correctamente", life: 4000 });
      //   }
      //   this.categoriaDialog = false;
      //   this.categoria = {};
      // }
    };

    const editMaterial = (editMaterial) => {
       this.material = { ...editMaterial };
       console.log(this.categoria);
       this.materialDialog = true;
      this.cabecera = "Editar categoría"

    };

    this.modalEditCreate = modalEditCreate;
    this.hideDialog = hideDialog;
    this.saveMaterial = saveMaterial;
    this.editMaterial = editMaterial;
    

  },
  props: {
    tipoVista: {
      type: String,
      required: true
    }
  },
  components: {
    Card,
    Button,
    Dialog,
    MultiSelect,
    DataTable,
    Column, InputText
  },
  computed: {
    ...mapState(materialesStore, ['materiales']),
   // ...mapState(categoriasStore, ['categorias']),
    ...mapState(departamentosStore, ['dptoActual']),

    materialesDtpoActual() {
      //la función llamada en el return está declarada en el store
      return this.materialesDptoActual()
    },

    materialesFiltrados() {
      // console.log('materiales ', this.materiales)
      switch (this.tipoVista) {
        case "ofertados":
          return this.materiales.filter((material) => {
           //  console.log("estado: ",material.estado + " dptoADQ", material.dptoAdquisicion)
            return material.estado === "disponible" && material.dptoOfertaN == this.dptoActual;
          });
        case "disponibles":
              return this.materiales.filter((material) => {
           //  console.log("estado: ",material.estado + " dptoADQ", material.dptoAdquisicion)
            return material.estado === "disponible" && material.dptoOfertaN !== this.dptoActual && this.dptoActual;
          });
        case "adquiridos":
         // console.log("dpto actual: ",this.dptoActual)
          return this.materiales.filter((material) => {
             console.log("estado: ",material.id + material.estado + " dptoADQ", material.dptoAdquisicionN + "actual" + this.dptoActual)
            return material.estado === "adquirido" && material.dptoAdquisicionN === this.dptoActual;
          });
      }
    },
  },

  methods: {
    ...mapActions(materialesStore, ['materialesDptoActual']),
    ...mapActions(materialesStore, ['getMateriales']),
   // ...mapActions(categoriasStore, ['getCategorias']),
   
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },

  },

  async created() {
    this.initFilters();

    //await this.getCategorias();
    await this.getMateriales();
  
    this.categoriasFiltro = Array.from(new Set(this.materiales.map(material => material.categoriaN)))
      .map((categoriaN, index) => ({ id: index + 1, name: categoriaN }));

    console.log("Vista desde materiales:", this.tipoVista, this.materiales)
  }

}
</script>
<template>
  <div class="materiales-container">
    <DataTable :value="materialesFiltrados" tableStyle="min-width: 50rem; margin-top: 1vw" :paginator="true" :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} materiales" 
      responsiveLayout="scroll">

      <template #header>
        <div class="row justify-content-between align-items-center">
          <div class="col-6">
            <span class="block mt-2 p-input-icon-left mr-2">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </span>
            <MultiSelect v-model="categoriasSeleccionadas" display="chip" :options="categoriasFiltro" optionLabel="name"
              placeholder="Categorías" :maxSelectedLabels="3" class="w-full md:w-20rem multiSelect" />
          </div>
          <div class="col-4 text-right">
            <Button v-if="this.tipoVista == 'ofertados'" label="Crear nuevo" icon="pi pi-plus"
              class="p-button-success mr-2" @click="modalEditCreate" />
          </div>
        </div>
      </template>
      <Column field="nombre" header="Nombre" :sortable="true"></Column>
      <Column field="estado" header="Estado" :sortable="true"></Column>
      <Column header="imagen">
        <template #body="material">
          <img :src="material.data.imagen" :alt="material.data.imagen" class="w-6rem shadow-2 border-round img-small" />
        </template>
      </Column>
      <Column field="milis" header="μilis" :sortable="true"> </Column>
      <Column field="categoriaN" header="Categoria" :sortable="true"></Column>
      <!-- <Column field="grupo" header="Grupo" :sortable="true"></Column>-->
      <Column field="dptoOfertaN" header="Ofertante" :sortable="true"></Column> 
       <Column header="VER">
        <template #body="material">
          <router-link :to="{ name: 'material', params: { id: material.data.id }}"><i class="pi pi-info-circle"/></router-link>  
            <!-- <router-link :to="{ name: 'material', params: { id: material.data.id }, query: { tipoVista: tipoVista } }"><i class="pi pi-info-circle"/></router-link>   
         -->
        </template>
      </Column> 

      <!-- <template #footer> Total: {{ materialesFiltrados ? materialesFiltrados.length : 0 }} </template> -->
    </DataTable>



    <Dialog v-model:visible="materialDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true"
          class="p-fluid">
          <div class="field">
            <label for="name">Nombre:</label>
            <InputText id="name" v-model.trim="material.nombre" required="true" autofocus
              :class="{ 'p-invalid': submitted && !material.nombre }" />
          </div>
          <div class="field">
            <label for="descripcion">Descripción</label>
            <Textarea id="descripcion" v-model="material.descripcion" required="true" rows="3" cols="20"
              :class="{ 'p-invalid': submitted && !material.descripcion }" :required="true" />
          </div>
<!-- 
          <div class="field">
            <label for="grupo" class="mb-3">Grupo</label>
            <Dropdown id="grupo" v-model="categoria.grupo" :options="getGrupos()" 
               :class="{ 'p-invalid': submitted && !categoria.grupo }"
               placeholder="Seleccione grupo">
              <template #value="grupo">
                <div v-if="grupo.value">
                  <span :class="'categoria-badge status-' + grupo.value">{{
                    grupo.value
                  }}</span>
                </div>
                <div v-else>
                  <span :class="'categoria-badge status-' + grupo.value">{{
                    grupo.value }}</span>
                </div>
              </template>
            </Dropdown>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="minMilis">μilis MIN</label>
              <InputNumber id="minMilis" v-model="categoria.minMilis"
                :class="{ 'p-invalid': submitted && !categoria.minMilis || categoria.minMilis > categoria.maxMilis }" :required="true" />
              <label for="maxMilis">μilis MAX</label>
              <InputNumber id="maxMilis" v-model="categoria.maxMilis"
                :class="{ 'p-invalid': submitted && !categoria.maxMilis || categoria.minMilis > categoria.maxMilis}" :required="true" />
            </div>
          </div> -->

          <template #footer>
            <!-- <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveCategoria" /> -->
          </template> 
        </Dialog>

  </div>
 </template>

<style scoped>
.img-small {
  width: 50px;
  height: auto;
}

.multiSelect {
  margin-right: 1vw;
}

.p-inputtext {
  margin-right: 1rem;
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
.pi {
  color: #4b5320;
}

</style>
