<script>
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import { departamentosStore } from '@/stores/departamentos'
import { materialesStore } from '@/stores/materiales'
import { categoriasStore } from '@/stores/categorias'
//import { categoriasStore } from '@/stores/categorias'
import { mapState, mapActions } from 'pinia'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from 'primevue/api';


export default {
  components: {
    Button, Dropdown, DataTable, Textarea,
    InputText, Column, InputNumber, Dialog,
    Card, Button, MultiSelect, Tag
  },
  provide: {
    tipoVista: undefined
  },
  props: {
    tipoVista: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      materialDialog: false,
      deleteMaterialDialog: false,
      categoriasFiltro: [],
      categoriasSeleccionadas: [],
      visible: false,
      filters: {},
      materialDialog: false,
      material: {
        nombre: '',
        descripcion: '',
        fechaAdquisicion: null,
        fechaOferta: null,
        imagen: '',
        estado: '',
        milis: 0,
        cantidad: 0,
        dimensiones: '',
        peso: '',
        tipoMaterial: '',
        noc: '',
        numeroSerie: '',
        bonificacion: 0
      },
      categoriasAgrupadas: [],
      submitted: false,
      estados: [
        { label: 'Disponible', value: 'disponible' },
        { label: 'No disponible', value: 'noDisponible' }
      ],
      tiposMaterial: [
        { label: 'Inventariable', value: 'inventariable' },
        { label: 'No inventariable', value: 'noInventariable' }
      ],
      cabecera: 'Crear material'
    }
  },
  mounted() {
    console.log(this.categoriasAgrupadas);

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

    //  //Agrupar categorías por grupo


  },

  computed: {
    ...mapState(materialesStore, ['materiales']),
    ...mapState(categoriasStore, ['categorias']),
    ...mapState(departamentosStore, ['dptoActual']),


    materialesFiltrados() {
      // console.log('materiales ', this.materiales)
      switch (this.tipoVista) {
        case "ofertados":
          return this.categoriasSeleccionadas.length === 0
            ? this.materiales.filter((material) => material.estado === "disponible" && material.dptoOfertaN == this.dptoActual)
            : this.materiales.filter((material) =>
              material.estado === "disponible" &&
              material.dptoOfertaN == this.dptoActual &&
              this.categoriasSeleccionadas.some((c) => c.label === material.categoriaN)
            );
        case "disponibles":
          return this.categoriasSeleccionadas.length === 0
            ? this.materiales.filter((material) => material.estado === "disponible" && material.dptoOfertaN !== this.dptoActual && this.dptoActual)
            : this.materiales.filter((material) =>
              material.estado === "disponible" &&
              material.dptoOfertaN !== this.dptoActual && this.dptoActual &&
              this.categoriasSeleccionadas.some((c) => c.label === material.categoriaN)
            );

        case "adquiridos":
          return this.categoriasSeleccionadas.length === 0
            ? this.materiales.filter((material) => material.estado === "adquirido" && (material.dptoAdquisicionN == this.dptoActual || material.dptoOfertaN == this.dptoActual))
            : this.materiales.filter((material) =>
              material.estado === "adquirido" && (material.dptoOfertaN == this.dptoActual || material.dptoAdquisicionN == this.dptoActual)
              && this.dptoActual &&
              this.categoriasSeleccionadas.some((c) => c.label === material.categoriaN)
            );
      }
    },
  },

  methods: {
    ...mapActions(materialesStore, ['materialesDptoActual']),
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(categoriasStore, ['getCategorias']),


    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    getSeverity(material) {
      switch (material.data.estado) {
        case 'adquirido':
          return 'success';
        case 'disponible':
          return 'warning';
        case 'ofertado':
          return 'danger';
        default:
          return null;
      }
    },



  },

  async created() {
    this.initFilters();

    await this.getCategorias();

    await this.getMateriales();


    console.log("Vista desde materiales:", this.tipoVista, this.materiales)

    console.log("categorias", this.categorias)
    this.categoriasAgrupadas = this.categorias.reduce((grupos, categoria) => {
      let grupo = grupos.find(g => g.label === categoria.grupo);
      if (!grupo) {
        // Si no existe, crear un nuevo grupo
        grupo = {
          label: categoria.grupo,
          code: categoria.grupo,
          items: []
        };
        console.log("leido grupo", grupo)
        grupos.push(grupo);
      }
      //grupos.push(grupo);
      // Agregar la categoría al grupo
      grupo.items.push({ label: categoria.categoria, value: categoria.categoria });
      return grupos;
    }, []);

    // // Resultado final: categorías agrupadas por grupo
    console.log("categorias agrupadas", this.categoriasAgrupadas);

    // this.categoriasFiltro = Array.from(new Set(this.materiales.map(material => material.categoriaN)))
    //   .map((categoriaN, index) => ({ id: index + 1, name: categoriaN }));
    //  this.categoriasFiltro = Array.from(new Set(this.materiales.map(material => material.categoriaN)))
    // .map((categoriaN, index) => ({ id: index + 1, name: categoriaN }));


  }

}
</script>
<template>
  <div class="materiales-container">
    <DataTable :value="materialesFiltrados" tableStyle="min-width: 50rem; margin-top: 1vw" :paginator="true" :rows="10"
      :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} materiales" responsiveLayout="scroll">

      <template #header>
        <div class="row justify-content-between align-items-center">
          <div class="col-6 d-flex align-items-center">
            <span class="block p-input-icon-left mr-2 flex-grow-1">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar..." class="flex-grow-1" />
            </span>
            <MultiSelect v-model="categoriasSeleccionadas" :options="categoriasAgrupadas" optionLabel="label"
              optionGroupLabel="label" optionGroupChildren="items" display="chip" placeholder="Categorías"
              :maxSelectedLabels="3" class="w-50 multiSelect">
              <template #optiongroup="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option.label }}</div>
                </div>
              </template>
            </MultiSelect>
          </div>
          <div class="col-4 text-right">
            <Button v-if="this.tipoVista == 'ofertados'" label="Crear nuevo" icon="pi pi-plus"
              class="p-button-success mr-2" @click="modalEditCreate" />
          </div>
        </div>
      </template>
      <Column field="nombre" header="Nombre" :sortable="true"></Column>

      <Column header="imagen">
        <template #body="material">
          <img :src="material.data.imagen" :alt="material.data.imagen" class="w-6rem shadow-2 border-round img-small" />
        </template>
      </Column>
      <Column field="milis" header="μilis" :sortable="true"> </Column>
      <Column field="categoriaN" header="Categoria" :sortable="true"></Column>
      <!-- <Column field="grupo" header="Grupo" :sortable="true"></Column>-->
      <Column header="Estado">
        <template #body="material">
          <Tag :value="material.data.estado" :severity="getSeverity(material)" />
        </template>
      </Column>

      <Column field="dptoOfertaN" header="Ofertante" :sortable="true"></Column>
      <Column header="VER">
        <template #body="material">
          <router-link :to="{ name: 'material', params: { id: material.data.id } }"><i
              class="pi pi-info-circle" /></router-link>
          <!-- <router-link :to="{ name: 'material', params: { id: material.data.id }, query: { tipoVista: tipoVista } }"><i class="pi pi-info-circle"/></router-link>   
         -->
        </template>
      </Column>

      <!-- <template #footer> Total: {{ materialesFiltrados ? materialesFiltrados.length : 0 }} </template> -->
    </DataTable>

  </div>
  <Dialog v-model:visible="materialDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true" class="p-fluid">
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
    <!-- <div class="field">
        <label for="fechaOferta">Fecha de oferta:</label>
        <Calendar id="fechaOferta" v-model="material.fechaOferta" required="true"
          :class="{ 'p-invalid': submitted && !material.fechaOferta }" :required="true" />
      </div> -->
    <div class="field">
      <label for="imagen">Imagen:</label>
      <InputText id="imagen" v-model.trim="material.imagen" />
    </div>
    <div class="field">
      <label for="estado">Estado:</label>
      <Dropdown id="estado" v-model="material.estado" :options="estados" optionLabel="label" optionValue="value"
        required="true" :class="{ 'p-invalid': submitted && !material.estado }" :required="true" />
    </div>
    <div class="field">
      <label for="milis">Milis:</label>
      <InputNumber id="milis" v-model.number="material.milis" required="true"
        :class="{ 'p-invalid': submitted && !material.milis }" :required="true" />
    </div>
    <div class="field">
      <label for="cantidad">Cantidad:</label>
      <InputNumber id="cantidad" v-model.number="material.cantidad" required="true"
        :class="{ 'p-invalid': submitted && !material.cantidad }" :required="true" />
    </div>
    <div class="field">
      <label for="dimensiones">Dimensiones:</label>
      <InputText id="dimensiones" v-model.trim="material.dimensiones" />
    </div>
    <div class="field">
      <label for="peso">Peso:</label>
      <InputText id="peso" v-model.trim="material.peso" />
    </div>
    <div class="field">
      <label for="tipoMaterial">Tipo de material:</label>
      <Dropdown id="tipoMaterial" v-model="material.tipoMaterial" :options="tiposMaterial" optionLabel="label"
        optionValue="value" required="true" :class="{ 'p-invalid': submitted && !material.tipoMaterial }"
        :required="true" />
    </div>

    <!-- <div class="field" v-if="material.tipoMaterial.value === 'inventariable'">
        <label for="noc">NOC:</label>
        <InputText id="noc" v-model.trim="material.noc" />
      </div>
      <div class="field" v-if="material.tipoMaterial.value === 'inventariable'">
        <label for="numeroSerie">Número de serie:</label>
        <InputText id="numeroSerie" v-model.trim="material.numeroSerie" />
      </div>
      <div class="field" v-if="material.tipoMaterial.value !== 'inventariable'">
        <label for="bonificacion">Bonificación:</label>
        <InputNumber id="bonificacion" v-model.number="material.bonificacion" required="true"
          :class="{ 'p-invalid': submitted && !material.bonificacion }" :required="true" />
      </div> -->
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarMaterial" />
    </template>
  </Dialog>
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
