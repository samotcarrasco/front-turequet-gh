<script>
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import { departamentosStore } from '@/stores/departamentos'
import { materialesStore } from '@/stores/materiales'
import { categoriasStore } from '@/stores/categorias'
import { mapState, mapActions } from 'pinia'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import FileUpload from 'primevue/fileupload'
import { FilterMatchMode } from 'primevue/api';
import { llamadaAPI, host } from '@/stores/api-service';




export default {
  components: {
    Toast, Button, Dropdown, DataTable, Textarea, InputText, Column, InputNumber, Dialog,
    Card, Button, MultiSelect, Tag, FileUpload, Calendar, InputSwitch
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
      foto: null,
      materialDialog: false,
      deleteMaterialDialog: false,
      categoriasFiltro: [],
      categoriasSeleccionadas: [],
      categoriasAgrupadas: [],
      grupoSeleccionado: null,
      // categoriaSeleccionada: null,
      visible: false,
      filters: {},
      materialDialog: false,
      material: {
        nombre: '',
        descripcion: '',
        fechaAdquisicion: null,
        fechaOferta: null,
        categoria: '',
        imagen: '',
        estado: '',
        milis: 0,
        cantidad: 1,
        dimensiones: '',
        peso: '',
        tipoMaterial: '',
        inventariable: '',
        noc: '',
        numeroSerie: '',
        bonificacion: 0
      },
      isInventariable: undefined,
      idCategoria: undefined,
      submitted: false,
      cabecera: 'Crear material',
      grupos: [],
      minMilis: null,
      maxMilis: null,
      categoriaSeleccionada: null,

    }
  },
  mounted() {
    const toast = useToast();
    console.log(this.categoriasAgrupadas);

    const modalEditCreate = () => {
      this.inicializarSelectorCategorias();
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
      //this.material.categoria
      //console.log("CATEG", this.material)
      this.material.categoria = host + "api/categorias/" + this.idCategoria;
      this.material.estado = 0;
      this.material.fechaOferta = new Date();
      console.log("DPTO API" + JSON.stringify(this.dptoActualAPI))
      console.log("DPTO API" + this.dptoActualAPI._links.self.href);

      this.material.dptoOferta = this.dptoActualAPI._links.self.href

      switch (this.isInventariable) {
        case true:
          this.material.tipoMaterial = "Inventariable";
          break;
        case false:
          this.material.tipoMaterial = "noInventariable";
          break;
      }
      
      console.log("entrando en la funcion saveMaterial con el material", JSON.stringify(this.material))

      this.submitted = true;

      // if (this.formularioRellenado(this.categoria)) {
      // console.log("nombre", this.material.nombre)
      // console.log("imgen", this.material.imagen)
      console.log("punto 1");
      //if (this.material.id) {
        //     console.log("punto 2");
        //     //  this.categoria.inventoryStatus = this.categoria.inventoryStatus.value ? this.categoria.inventoryStatus.value : this.categoria.inventoryStatus;
        //     // this.categorias[this.findIndexById(this.categoria.id)] = this.categoria;
        //     //llamad a metodo putcategoria(pendiente de desarrollo)
        //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria actualizada', life: 3000 });
      // } else {
      //   console.log("punto 3");

             this.postMaterial(this.material).then(() => { this.getMateriales() });
             toast.add({ severity: 'success', summary: 'Categoría creada', detail: this.material.material + " se ha creado correctamente", life: 4000 });
           //}
           this.materialDialog = false;
           this.material = {};
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
    ...mapState(departamentosStore, ['dptoActualAPI']),



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
            : this.materiales.filter((material) => material.estado === "disponible" &&
              material.dptoOfertaN !== this.dptoActual && this.dptoActual &&
              this.categoriasSeleccionadas.some((c) => c.label === material.categoriaN)
            );

        case "intercambiados":
          //asiganmos el valor "entregado" en los casos que corresponda
          this.asignarEntregados();
          return this.categoriasSeleccionadas.length === 0
            ? this.materiales.filter((material) => (material.estado === "adquirido" || material.estado === "entregado") &&
              (material.dptoAdquisicionN == this.dptoActual || material.dptoOfertaN == this.dptoActual))
            : this.materiales.filter((material) => (material.estado === "adquirido" || material.estado === "entregado") &&
              (material.estado === "adquirido" || material.estado === "entregado") &&
              (material.dptoOfertaN == this.dptoActual || material.dptoAdquisicionN == this.dptoActual) &&
              this.dptoActual &&
              this.categoriasSeleccionadas.some((c) => c.label === material.categoriaN)
            );
      }
    },

    getMilisDeCategoria() {
      if (this.categoriaSeleccionada) {
        const categoria = this.categorias.find(c => c.categoria === this.categoriaSeleccionada.value);
        if (categoria) {
          this.minMilis = categoria.minMilis;
          this.maxMilis = categoria.maxMilis;
          this.idCategoria = categoria.id;
        }
      } else {
        this.minMilis = null;
        this.maxMilis = null;
      }
    },
  },

  methods: {
    ...mapActions(materialesStore, ['materialesDptoActual']),
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(materialesStore, ['postMaterial']),
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
        case 'entregado':
          return 'info';
        default:
          return null;
      }
    },

    cargarImagen(e) {
      console.log("subiendo fichero...");
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        this.material.imagen = reader.result;
        console.log("resultado", this.material.imagen);
      };
      reader.readAsDataURL(file);
    },

    asignarEntregados() {
      // Actualizar el estado a "adquirido" en los materiales entregados y de la unidad actual
      this.materiales.forEach(material => {
        if (material.estado === "adquirido" && material.dptoOfertaN === this.dptoActual) {
          material.estado = "entregado"
        } else if (material.estado === "entregado" && material.dptoAdquisicionN === this.dptoActual) {
          material.estado = "adquirido"
        }
      });
    },

    asignarCategoriaMaterial() {
      this.materiales.forEach(m => {
        //console.log("URL LINK " + m._links.categoria.href)
        llamadaAPI('get', null, m._links.categoria.href).then(r => {
          m.categoria = r.data;
          console.log("ASDFASDF" + m.categoria)
        })
      })

    },

    inicializarSelectorCategorias() {
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
      this.grupos = this.categoriasAgrupadas.map(grupo => grupo.label);
    },

    actualizarCategorias() {
      const grupo = this.categoriasAgrupadas.find(grupo => grupo.label === this.grupoSeleccionado);
      this.categoriasSeleccionadas = grupo ? grupo.items : [];
    },

    formularioRellenado(mat) {
      return (mat.nombre &&
        mat.descripcion &&
        mat.milis >= this.minMilis &&
        mat.milis <= this.maxMilis)

    },

    incrementarCantidad() {
      this.material.cantidad++;
    },

    decrementarCantidad() {
      if (this.material.cantidad > 1) {
        this.material.cantidad--;
      }
    }



  },

  async created() {
    this.initFilters();

    await this.getCategorias();

    await this.getMateriales();

    this.asignarCategoriaMaterial();

    this.inicializarSelectorCategorias();


    // // Resultado final: categorías agrupadas por grupo
    //console.log("categorias agrupadas", this.categoriasAgrupadas);

    // this.categoriasFiltro = Array.from(new Set(this.materiales.map(material => material.categoriaN)))
    //   .map((categoriaN, index) => ({ id: index + 1, name: categoriaN }));
    //  this.categoriasFiltro = Array.from(new Set(this.materiales.map(material => material.categoriaN)))
    // .map((categoriaN, index) => ({ id: index + 1, name: categoriaN }));


  }

}
</script>
<template>
  <div class="materiales-container">
    <Toast/>
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
              optionGroupLabel="label" optionGroupChildren="items" placeholder="Categorías" :maxSelectedLabels="3"
              class="w-80 multiSelect">
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
          <!-- <img :src="material.data.imagen" :alt="material.data.imagen" class="w-6rem shadow-2 border-round img-small" /> -->
          <!-- <img :src="'data:image/png;base64,' + material.data.imagen" :alt="material.data.imagen"
            class="w-6rem shadow-2 border-round img-small" /> -->
          <img :src="material.data.imagen" :alt="material.data.imagen" class="w-6rem shadow-2 border-round img-small" />
        </template>
      </Column>
      <Column field="descripcion" header="Descripción" :sortable="false"></Column>
      <Column field="milis" header="μilis" :sortable="true"> </Column>
      <Column field="categoriaN" header="Categoria" :sortable="true"></Column>
      <!-- <Column field="grupo" header="Grupo" :sortable="true"></Column>-->
      <Column header="Estado" :sortable="true">
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

  <Dialog v-model:visible="materialDialog" :style="{ width: '80vw' }" :header="cabecera" :modal="true" class="p-fluid">
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
    <div class="field">
      <FileUpload @upload="cargarFichero($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
        <template #empty>
          <p>Arrastre aquí las imagenes</p>
        </template>
      </FileUpload>
    </div>

    <div class="field d-flex mt-2">
      <Dropdown v-model="grupoSeleccionado" :options="grupos" placeholder="Seleccione un grupo"
        @change="actualizarCategorias" />
      <Dropdown v-model="categoriaSeleccionada" :options="categoriasSeleccionadas" optionLabel="label"
        placeholder="Seleccione una categoría" class="mx-2" @change="getMilisDeCategoria" />
      <label for="milis">Milis: </label>
      <InputNumber id="milis" v-model="material.milis" required="true"
        :class="{ 'p-invalid': submitted && (material.milis > maxMilis || material.milis < minMilis) }" :required="true"
        :placeholder="categoriaSeleccionada ? ' (entre ' + minMilis + ' y ' + maxMilis + ') ' : ''" />
    </div>
    <div class="field d-flex mt-2">

      <label for="cantidad">Cantidad: </label>
      <div class="p-inputgroup">
        <Button icon="pi pi-minus" @click="decrementarCantidad" />
        <InputNumber id="cantidad" v-model="material.cantidad" :min="1" :max="100" :placeholder="1" />
        <Button icon="pi pi-plus" @click="incrementarCantidad" />
      </div>

      <label for="peso">Peso (kg):</label>
      <InputText id="peso" v-model="material.peso" class="p-inputtext" />

      <label for="dimensiones">Dimensiones:</label>
      <InputText id="dimensiones" v-model="material.dimensiones" class="p-inputtext" />
    </div>

    <div class="field">
      <label for="inventariable">Inventariable: </label>
      <InputSwitch v-model="isInventariable" />
    </div>


    <div v-if="isInventariable" class="field">
      <label for="noc">NOC: </label>
      <InputText id="noc" v-model="material.noc" :class="{ 'p-invalid': submitted && !material.noc }" :required="true" />
    </div>

    <div v-if="isInventariable" class="field">
      <label for="numSerie">Número de Serie: </label>
      <InputText id="numSerie" v-model="material.numSerie" :class="{ 'p-invalid': submitted && !material.numSerie }"
        :required="true" />
    </div>

    <div v-else class="field">
      <label for="bonificacion">Bonificación: </label>
      <InputText id="bonificacion" v-model="material.bonificacion"
        :class="{ 'p-invalid': submitted && !material.bonificacion }" :required="true" />
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveMaterial" />
    </template>
  </Dialog>
</template>

<style >
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
