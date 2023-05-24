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
import { mapState, mapWritableState, mapActions } from 'pinia'
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
      materialDialog: false,
      deleteMaterialDialog: false,
      categoriasFiltro: [],
      categoriasSeleccionadas: [],
      categoriasAgrupadas: [],
      grupoSeleccionado: null,
      // categoriaSeleccionada: null,
      visible: false,
      filters: {},
      material: {
        nombre: '',
        descripcion: '',
        fechaAdquisicion: null,
        fechaOferta: null,
        categoria: '',
        imagen: '',
        imgReducida: '',
        estado: '',
        milis: 0,
        cantidad: 1,
        dimensiones: '',
        peso: '',
        tipoMaterial: '',
        inventariable: '',
        noc: '',
        numeroSerie: '',
        bonificacion: undefined,
      },
      isInventariable: true,
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


      // const image = new Image();
      // image.src = this.material.imagen;

      // image.onload = () => {
      //     const canvas = document.createElement('canvas');
      //     const context = canvas.getContext('2d');

      //     canvas.width = 80;
      //     canvas.height = 80;

      //     context.drawImage(image, 0, 0, newWidth, newHeight);

      //     const reducedImage = canvas.toDataURL('image/jpeg', 0.8);

      //     console.log("imagen reducida", reducedImage);
      //     this.material.imgReducida = reducedImage;
      //  };



      //this.material.categoria
      //console.log("CATEG", this.material)
      this.material.categoria = host + "api/categorias/" + this.idCategoria
      this.material.estado = 0
      this.material.fechaOferta = new Date()
     
      
      console.log("DPTO API" + JSON.stringify(this.dptoActualAPI))
      console.log("DPTO API" + this.dptoActualAPI._links.self.href)
      console.log("IMAGEN REDUCIDA" + this.material.imgReducida)

      this.material.dptoOferta = this.dptoActualAPI._links.self.href

      this.material.cantidad = this.material.cantidad === 0 || this.material.cantidad === null ? 1 : this.material.cantidad;


      switch (this.isInventariable) {
        case true:
          this.material.tipoMaterial = "Inventariable";
          this.material.bonificacion = 0;
          break;
        case false:
          this.material.tipoMaterial = "noInventariable";
          this.material.bonificacion = this.bonificacion;
          //incrementamos el credito en milis visibles en el menú
          this.
          break;
      }

      console.log("entrando en la funcion saveMaterial con el material", JSON.stringify(this.material))

      this.submitted = true;

      if (this.formularioRellenado(this.material)) {
        //if (this.material.id) {
        //     console.log("punto 2");
        //     //  this.categoria.inventoryStatus = this.categoria.inventoryStatus.value ? this.categoria.inventoryStatus.value : this.categoria.inventoryStatus;
        //     // this.categorias[this.findIndexById(this.categoria.id)] = this.categoria;
        //     //llamad a metodo putcategoria(pendiente de desarrollo)
        //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria actualizada', life: 3000 });
        // } else {
        //   console.log("punto 3");


        this.postMaterial(this.material).then(() => { this.getMateriales() });

        
        toast.add({ severity: 'success', summary: 'Material creado', detail: this.material.nombre, life: 3000 });
        if (this.material.bonificacion) {
           toast.add({ severity: 'info', summary: 'Bonificación obtenida', detail: this.material.bonificacion + " μilis", life: 3050 });
        }

        //this.milisMenu = this.milisMenu + this.material.bonificacion;ç
        console.log("llamando a actualizar milis menu")
        this.actualizarMilisMenu(this.material.bonificacion)
      
        this.materialDialog = false;
        this.material = {};
        
      }
    };

    const editMaterial = (editMaterial) => {
      this.material = { ...editMaterial };
      console.log(this.categoria);
      this.materialDialog = true;
      this.cabecera = "Editar material"

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
    ...mapState(departamentosStore, ['bonificacion']),
    ...mapState(departamentosStore, ['milisMenu']),



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

    fechaFormateada() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      return `${day}/${month}/${year}`;
    },

  },

  methods: {
    ...mapActions(materialesStore, ['materialesDptoActual']),
    ...mapActions(materialesStore, ['getMateriales']),
    ...mapActions(materialesStore, ['postMaterial']),
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(departamentosStore, ['actualizarMilisMenu']),
   

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
      let file = e.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        this.material.imagen = reader.result;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const newWidth = 80; // Nueva anchura deseada
        const newHeight = 80; // Nueva altura deseada

        canvas.width = newWidth;
        canvas.height = newHeight;

        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0, newWidth, newHeight);

          const reducedImage = canvas.toDataURL('image/jpeg', 0.8);

          console.log("imagen reducida", reducedImage);
          this.material.imgReducida = reducedImage;
        };
        img.src = this.material.imagen;
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
          //console.log("ASDFASDF" + m.categoria)
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
        mat.milis <= this.maxMilis
        && mat.milis > 0)
    },

    incrementarCantidad() {
      this.material.cantidad++;
    },

    decrementarCantidad() {
      if (this.material.cantidad > 1) {
        this.material.cantidad--;
      }
    },

   



  },

  async created() {
    this.initFilters();

    await this.getCategorias();

    await this.getMateriales();


    

console.log("DPTO ACTUAL API" , JSON.stringify(this.dptoActualAPI));

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
    <Toast />

    <!-- <div v-if="!this.departamentos">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      {{ console.log('Mostrando icono') }}
    </div> -->

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
            <Button v-if="this.tipoVista == 'ofertados'" label="Crear nuevo" icon="pi pi-plus" @click="modalEditCreate" />
          </div>
        </div>
      </template>

      <Column field="nombre" header="Nombre" :sortable="true"></Column>

      <Column header="imagen">
        <template #body="material">
          <!-- <img :src="material.data.imagen" :alt="material.data.imagen" class="w-6rem shadow-2 border-round img-small" /> -->
          <img :src="material.data.imgReducida" :alt="material.data.imagen"
            class="w-6rem shadow-2 border-round img-small" />
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

  <Dialog v-model:visible="materialDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true" class="p-fluid">
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Nombre:</label>
        <InputText id="name" v-model.trim="material.nombre" required="true" autofocus
          :class="{ 'p-invalid': submitted && !material.nombre }" />
      </div>
      <div class="field col custom-field">
        <label for="fecha">Fecha oferta:</label>
        <InputText id="fecha" v-model.trim="fechaFormateada" disabled />
      </div>
    </div>
    <div class="field">
      <label for="descripcion">Descripción:</label>
      <Textarea id="descripcion" v-model="material.descripcion" required="true" rows="3" cols="20"
        :class="{ 'p-invalid': submitted && !material.descripcion }" :required="true" />
    </div>
    <div class="field">
      <!-- <input type="file" @change="cargarImagen" accept="image/*"> -->
      <!-- <FileUpload @upload="cargarImagen($event)" url="null" :multiple="false" accept="image/*" :maxFileSize="1000000">
        <template #empty>
          <p>Seleccione o arrastre aquí la imagen y pulse en Upload</p>
        </template>
      </FileUpload>  -->
      <FileUpload @select="cargarImagen($event)" :showUploadButton="true" accept="image/*" chooseLabel="Seleccionar"
        cancel-label="Cancelar">
        <!-- <img :src="material.imagen" v-if="imagen" alt="Imagen cargada correctamente"> -->
        <template #empty>
          <p>Seleccione o arrastre aquí la imagen</p>
        </template>
      </FileUpload>

    </div>

    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="grupo">Grupo: </label>
        <Dropdown v-model="grupoSeleccionado" :options="grupos" placeholder="Seleccione un grupo"
          @change="actualizarCategorias" />
      </div>
      <div class="field col custom-field">
        <label for="categoria">Categoría: </label>
        <Dropdown v-model="categoriaSeleccionada" :options="categoriasSeleccionadas" optionLabel="label"
          placeholder="Seleccione una categoría" @change="getMilisDeCategoria" />
      </div>
      <div class="field col custom-field">
        <label for="milis">Milis: </label>
        <InputNumber id="milis" v-model="material.milis" required="true"
          :class="{ 'p-invalid': submitted && (material.milis > maxMilis || material.milis < minMilis || !milis) }"
          :required="true" :placeholder="categoriaSeleccionada ? ' (entre ' + minMilis + ' y ' + maxMilis + ') ' : ''" />
      </div>
    </div>
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="cantidad">Cantidad: </label>
        <div class="p-inputgroup">
          <Button icon="pi pi-minus" @click="decrementarCantidad" />
          <InputNumber id="cantidad" v-model="material.cantidad" :min="1" :max="100" :placeholder="1"
            class="c-cantidad" />
          <Button icon="pi pi-plus" @click="incrementarCantidad" />
        </div>
      </div>
      <div class="field col custom-field">
        <label for="peso">Peso (kg):</label>
        <InputText id="peso" v-model="material.peso" class="p-inputtext" />
      </div>
      <div class="field col custom-field">
        <label for="dimensiones">Dimensiones:</label>
        <InputText id="dimensiones" v-model="material.dimensiones" class="p-inputtext" />
      </div>
    </div>

    <div class="field d-flex mt-2">
      <div class="field col custom-field-switch">
        <label for="inventariable" class="custom-label">Inventariable: </label>
        <InputSwitch v-model="isInventariable" class="custom-input-switch" />
      </div>
      <div v-if="isInventariable" class="field col custom-field">
        <label for="noc">NOC: </label>
        <InputText id="noc" v-model="material.noc" :required="false" />
      </div>
      <div v-if="isInventariable" class="field col custom-field">
        <label for="numSerie">Número de Serie: </label>
        <InputText id="numSerie" v-model="material.numSerie" :required="false" />
      </div>
      <div v-if="!isInventariable" class="field col custom-field">
        <label for="bonificacion">Bonificación: </label>
         <InputText id="bonificacion" v-model.trim="bonificacion" disabled /> 
        <!-- <InputText id="bonificacion" v-model="material.bonificacion" :required="false" readonly /> -->
      </div>
      <div v-if="!isInventariable" class="field col custom-field">
        <label for="null"> </label>
      </div>

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

.c-cantidad {
  text-align: center;
}

.field.d-flex {
  margin-bottom: 1rem;
}

.custom-field {
  margin-right: 1rem;
}

.custom-field-switch {
  display: flex;
  justify-content: center;
}

.custom-input-switch {
  margin-top: 2rem;
  margin-right: 1rem;
}

.custom-label {
  margin-top: 1.7rem;
  margin-right: 1rem;
}
</style>
