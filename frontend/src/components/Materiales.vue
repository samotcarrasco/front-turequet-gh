<script>
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import FileUpload from 'primevue/fileupload'
import { FilterMatchMode } from 'primevue/api'
import { putMaterial, postMaterial, deleteMaterial, patchFechaEntrega } from '@/stores/api-service'
import { departamentosStore } from '@/stores/departamentos'
import { materialesStore } from '@/stores/materiales'
import { categoriasStore } from '@/stores/categorias'
import { mapState, mapActions } from 'pinia'


export default {
  components: {
    Toast, Button, Dropdown, DataTable, Textarea, InputText, Column, InputNumber, Dialog,
    Button, MultiSelect, Tag, FileUpload, Calendar, InputSwitch
  },
  props: {
    tipoVista: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fechaCalendario: undefined,
      materialDialog: false,
      asignarFechaDialog: false,
      deleteMaterialDialog: false,
      categoriasFiltro: [],
      categoriasSeleccionadas: [],
      categoriasAgrupadas: [],
      grupoSeleccionado: null,
      visible: false,
      filters: {},
      material: undefined,
      esInventariable: false,
      idCategoria: undefined,
      submitted: false,
      grupos: [],
      minMilis: null,
      maxMilis: null,
      categoriaSeleccionada: null,
      categoriaLink: null,
      cabecera: null,
      modalEditCreate: undefined,
      changeCursor: undefined,
      materialesFiltrados: []
    }
  },


  watch: {
    tipoVista: {
      handler(nuevaVista) {
        this.getElementosVista(nuevaVista, this.categoriasSeleccionadas);
      }
    },
    categoriasSeleccionadas: {
      handler(nuevasCategoriasSeleccionadas) {
        this.getElementosVista(this.tipoVista, nuevasCategoriasSeleccionadas);
      }
    },
    dptoActual: {
      handler() {
        this.getElementosVista(this.tipoVista, this.categoriasSeleccionadas);
      }
    }
  },


  mounted() {
    const toast = useToast()
    const modalEditCreate = () => {
      this.inicializarSelectorCategorias()
      this.material = {}
      this.submitted = false
      this.materialDialog = true
      if (this.material.cantidad == undefined) {
        this.material.cantidad = 1
      }
      this.cabecera = "Alta de nuevo material"
    }

    const hideDialog = () => {
      this.materialDialog = false
      this.asignarFechaDialog = false
      this.submitted = false
    }

    const saveMaterial = () => {
      this.material.estado = 0
      this.material.fechaOferta = new Date()
      this.material.categoria = this.categoriaLink;
      this.material.dptoOferta = this.dptoActualAPI._links.self.href
      this.material.cantidad = this.material.cantidad === 0 || this.material.cantidad === null || this.material.cantidad === undefined
        ? 1 : this.material.cantidad

      switch (this.esInventariable) {
        case true:
          this.material.tipoMaterial = "Inventariable"
          this.material.bonificacion = 0
          break
        case false:
          this.material.tipoMaterial = "noInventariable"
          this.material.bonificacion = this.bonificacion
          break
      }

      this.submitted = true

      if (this.formularioRellenado(this.material)) {
        if (this.material.id) {

          putMaterial(this.material).then(r => {
            if (r.status == 200) {
              //this.materiales.splice(this.materiales.indexOf(this.material), 1, r.data)
              this.getMateriales()
              toast.add({ severity: 'success', summary: 'Material modificado', detail: this.material.nombre, life: 3000 })
            }
          })
        } else {
          postMaterial(this.material).then(r => {
            if (r.status == 200) {
              this.materiales.unshift(r.data)
              toast.add({ severity: 'success', summary: 'Material creado', detail: this.material.nombre, life: 3000 })
            }
          })
        }

        if (this.material.bonificacion && !this.material.id) {
          toast.add({ severity: 'info', summary: 'Bonificación obtenida', detail: this.material.bonificacion + " μilis", life: 3050 })
          this.actualizarMilisMenu(this.material.bonificacion)
        }

        this.materialDialog = false
        this.categoriasSeleccionadas = []
        this.inicializarSelectorCategorias()
        this.material = {}
      }
    }

    const patchFechaEntregaModal = () => {
      const modeloFecha = JSON.stringify({ fechaEntrega: this.fechaCalendario })
      this.submitted = true
      patchFechaEntrega(modeloFecha, this.material.id).then(r => {
        if (r.status == 200) {
          this.materiales.splice(this.materiales.indexOf(this.material), 1, r.data)
          toast.add({ severity: 'success', summary: 'Entrega finalizada', detail: this.material.nombre, life: 3000 })
        }
      })
      this.asignarFechaDialog = false
    }

    const confirmDeleteMaterial = (material) => {
      this.material = material
      this.deleteMaterialDialog = true
    }

    const borrarMaterial = () => {
      this.deleteMaterialDialog = false
      deleteMaterial(this.material).then(r => {
        if (r.status == 200) {
          this.materiales.splice(this.materiales.indexOf(this.material), 1)
          toast.add({ severity: 'success', summary: 'Material eliminado', detail: this.material.nombre, life: 3000 })
          if (this.material.bonificacion) {
            this.actualizarMilisMenu(-this.material.bonificacion)
          }
        }
      })
    }

    this.modalEditCreate = modalEditCreate
    this.hideDialog = hideDialog
    this.saveMaterial = saveMaterial
    this.patchFechaEntregaModal = patchFechaEntregaModal
    this.confirmDeleteMaterial = confirmDeleteMaterial
    this.borrarMaterial = borrarMaterial
  },

  computed: {
    ...mapState(materialesStore, ['materiales', 'materialActual']),
    ...mapState(categoriasStore, ['categorias']),
    ...mapState(departamentosStore, ['dptoActual', 'dptoActualAPI', 'bonificacion', 'milisMenu']),

    getMilisDeCategoria() {
      let categoria = undefined
      if (this.categoriaSeleccionada) {
        categoria = this.categorias.find(c => c.categoria === this.categoriaSeleccionada.value)
      } else if (this.material.categoriaN) {
        categoria = this.categorias.find(c => c.categoria === this.material.categoriaN)
      }
      if (categoria != undefined) {
        this.categoriaLink = categoria._links.self.href
        this.minMilis = categoria.minMilis
        this.maxMilis = categoria.maxMilis
        this.idCategoria = categoria.id
        this.categoria = undefined
      }
      else {
        this.minMilis = null
        this.maxMilis = null
        this.categoria = undefined
      }
    },

    fechaFormateada() {
      const hoy = new Date()
      const dia = String(hoy.getDate()).padStart(2, '0')
      const mes = String(hoy.getMonth() + 1).padStart(2, '0')
      const anio = hoy.getFullYear()
      return `${dia}/${mes}/${anio}`
    },

  },

  methods: {
    ...mapActions(materialesStore, ['getMateriales', 'getMaterialPorId', 'getMaterialesOfertados',
      'getMaterialesDisponibles', 'getMaterialesPendientes', 'getMaterialesEntregados']),
    ...mapActions(categoriasStore, ['getCategorias']),
    ...mapActions(departamentosStore, ['actualizarMilisMenu']),

    getElementosVista(tipoVista, categoriasSeleccionadas) {
      let materiales = [];

      if (tipoVista === "ofertados") {
        materiales = this.getMaterialesOfertados();
      } else if (tipoVista === "disponibles") {
        materiales = this.getMaterialesDisponibles();
      } else if (tipoVista === "pendientes") {
        this.asignarPendientes();
        materiales = this.getMaterialesPendientes();
      } else if (tipoVista === "entregados") {
        this.asignarEntregados();
        materiales = this.getMaterialesEntregados();
      }

      this.materialesFiltrados = this.filtrarMaterialesPorCategoria(materiales, categoriasSeleccionadas);
    },

    async editMaterial(id) {
      await this.getMaterialPorId(id)
      this.material = this.materialActual
      this.materialDialog = true
      this.cabecera = "Editar material"
    },

    async asignarFechaEntrega(id) {
      await this.getMaterialPorId(id)
      this.material = this.materialActual
      this.asignarFechaDialog = true
      this.cabecera = "Confirme la fecha de entrega/recepción"
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    },

    getSeverity(material) {
      switch (material.data.estado) {
        case 'pendiente entrega':
          return 'warning'
        case 'pendiente recepcion':
          return 'success'
        case 'disponible':
          return 'warning'
        case 'ofertado':
          return 'danger'
        case 'entregado':
          return 'warning'
        case 'recepcionado':
          return 'success'
        default:
          return null
      }
    },

    cargarImagen(foto) {
      let file = foto.files[0]
      let reader = new FileReader()
      reader.onload = () => {
        this.material.imagen = reader.result
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        const newWidth = 80
        const newHeight = 80

        canvas.width = newWidth
        canvas.height = newHeight

        const img = new Image()
        img.onload = () => {
          context.drawImage(img, 0, 0, newWidth, newHeight)
          const reducedImage = canvas.toDataURL('image/jpeg', 0.8)
          this.material.imgReducida = reducedImage
        }
        img.src = this.material.imagen
      }
      reader.readAsDataURL(file)
    },

    filtrarMaterialesPorCategoria(materiales, categoriasSeleccionadas) {
      console.log("cat seleccionadas: " + categoriasSeleccionadas.length)
      return categoriasSeleccionadas.length === 0
        ? materiales
        : materiales.filter(material => categoriasSeleccionadas.some(c => c.label === material.categoriaN));
    },

    asignarPendientes() {
      this.materiales.forEach(material => {
        if (material.estado === "pendiente" || material.estado === "pendiente recepcion" && material.dptoOfertaN === this.dptoActual) {
          material.estado = "pendiente entrega"
        } else if (material.estado === "pendiente" || material.estado == "pendiente entrega" && material.dptoAdquisicionN === this.dptoActual) {
          material.estado = "pendiente recepcion"
        }
      })
    },

    asignarEntregados() {
      this.materiales.forEach(material => {
        if ((material.estado === "entregado" || material.estado === "recepcionado") && material.dptoOfertaN === this.dptoActual) {
          material.estado = "entregado"
        } else if (material.estado === "entregado" && material.dptoAdquisicionN === this.dptoActual) {
          material.estado = "recepcionado"
        }
      })
    },

    inicializarSelectorCategorias() {
      this.categoriasAgrupadas = this.categorias.reduce((grupos, categoria) => {
        let grupo = grupos.find(g => g.label === categoria.grupo)
        if (!grupo) {
          grupo = {
            label: categoria.grupo,
            code: categoria.grupo,
            items: []
          }
          grupos.push(grupo)
        }
        grupo.items.push({ label: categoria.categoria, value: categoria.categoria })
        return grupos
      }, [])
      this.grupos = this.categoriasAgrupadas.map(grupo => grupo.label)
    },

    actualizarCategorias() {
      const grupo = this.categoriasAgrupadas.find(grupo => grupo.label === this.grupoSeleccionado)
      this.material.categoriaN = undefined
      this.categoriasSeleccionadas = grupo ? grupo.items : []
    },

    formularioRellenado(mat) {
      return (mat.nombre != null && mat.descripcion != null && mat.milis >= this.minMilis
        && mat.milis <= this.maxMilis && mat.milis > 0 && mat.imagen != null)
    },

    incrementarCantidad() {
      this.material.cantidad++
    },

    decrementarCantidad() {
      if (this.material.cantidad > 1) {
        this.material.cantidad--
      }
    },
  },

  async created() {
    this.initFilters()
    await this.getCategorias()
    await this.getMateriales()
    this.inicializarSelectorCategorias()
  }

}
</script>
<template>
  <div class="grid">
    <div class="col-11">
      <Toast />
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
              <Button v-if="this.tipoVista == 'ofertados' && this.dptoActual" label="Crear nuevo" icon="pi pi-plus"
                @click="modalEditCreate" />
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
        <Column field="grupoN" header="Grupo" :sortable="true"></Column>
        <Column v-if="tipoVista === 'pendientes'" header="Estado" :sortable="true">
          <template #body="material">
            <Tag :value="material.data.estado" :severity="getSeverity(material)"
              @click="asignarFechaEntrega(material.data.id)" @mouseover="changeCursor" style="cursor: pointer" />
          </template>
        </Column>
        <Column v-else header="Estado" :sortable="true">
          <template #body="material">
            <Tag :value="material.data.estado" :severity="getSeverity(material)" />
          </template>
        </Column>

        <Column field="dptoOfertaN" header="Ofertante" :sortable="true"></Column>
        <Column v-if="this.tipoVista == 'ofertados'" headerStyle="min-width:10rem;">
          <template #body="material">
            <div class="d-flex">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2"
                @click="editMaterial(material.data.id)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning p-mr-2"
                @click="confirmDeleteMaterial(material.data)" />
              <router-link :to="{ name: 'material', params: { id: material.data.id } }">
                <Button icon="pi pi-info" class="p-button-rounded p-button-info p-button-xs" />
              </router-link>
            </div>
          </template>
        </Column>
        <Column v-else header="+INFO">
          <template #body="material">
            <router-link :to="{ name: 'material', params: { id: material.data.id } }">
              <Button icon="pi pi-info" class="p-button-rounded p-button-info p-button-xs mt-2" />
            </router-link>
          </template>
        </Column>
      </DataTable>
    </div>
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
      <FileUpload @select="cargarImagen($event)" :showUploadButton="true" accept="image/*" chooseLabel="Seleccionar"
        cancel-label="Cancelar" required="true">
        <template #empty>
          <img :src="material.imagen" v-if="material.imagen" style="max-width: 200px; max-height: 200px;"
            required="true" />
          <p v-else>Seleccione o arrastre aquí la imagen </p>
        </template>
      </FileUpload>


    </div>

    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="grupo">Grupo: </label>
        <Dropdown v-model="grupoSeleccionado" :options="grupos"
          :placeholder="material.id ? material.grupoN : 'Seleccione un grupo'" @change="actualizarCategorias"
          required="true" />
      </div>
      <div class="field col custom-field">
        <label for="categoria">Categoría: </label>
        <Dropdown v-model="categoriaSeleccionada" :options="categoriasSeleccionadas" optionLabel="label"
          :placeholder="material.id ? material.categoriaN : 'Seleccione una categoría'" @change="getMilisDeCategoria"
          required="true" />
      </div>
      <div class="field col custom-field">
        <label for="milis">Milis: </label>
        <InputNumber id="milis" v-model="material.milis" required="true"
          :class="{ 'p-invalid': submitted && (material.milis > maxMilis || material.milis < minMilis || !material.milis) }"
          :required="true" :placeholder="categoriaSeleccionada ? ' (entre ' + minMilis + ' y ' + maxMilis + ') ' : ''" />
      </div>
    </div>
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="cantidad">Cantidad: </label>
        <div class="p-inputgroup">
          <Button icon="pi pi-minus" @click="decrementarCantidad" />
          <InputNumber id="cantidad" v-model="material.cantidad" :min="1" :max="100" class="c-cantidad" />
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
        <InputSwitch v-model="esInventariable" class="custom-input-switch" />
      </div>
      <div v-if="esInventariable" class="field col custom-field">
        <label for="noc">NOC: </label>
        <InputText id="noc" v-model="material.noc" :required="false" />
      </div>
      <div v-if="esInventariable" class="field col custom-field">
        <label for="numeroSerie">Número de Serie: </label>
        <InputText id="numSerie" v-model="material.numeroSerie" :required="false" />
      </div>
      <div v-if="!esInventariable" class="field col custom-field">
        <label for="bonificacion">Bonificación: </label>
        <label v-if="material.id" for="bonificacion"> (no aplicable al editar)</label>
        <InputText id="bonificacion" v-model.trim="bonificacion" disabled />
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveMaterial" />
    </template>
  </Dialog>


  <Dialog v-model:visible="asignarFechaDialog" :style="{ width: '50vw' }" :header="cabecera" :modal="true"
    class="p-fluid">
    <div class="field col custom-field">
      <label for="fecha">Seleccione la fecha de entrega:</label>
      <Calendar v-model="fechaCalendario" />
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="patchFechaEntregaModal" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteMaterialDialog" :style="{ width: '450px' }" header="Confirmación de borrado de material"
    :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="material">¿Está seguro que desea eliminar el material <b>{{ material.nombre
      }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMaterialDialog = false" />
      <Button label="Si" icon="pi pi-check" class="p-button-text" @click="borrarMaterial" />
    </template>
  </Dialog>
</template>

<style scoped>
.img-small {
  width: 50px;
  height: auto;
}

.pi {
  color: #4b5320;
}

.c-cantidad {
  text-align: center;
}

.p-button-rounded {
  background: rgb(136, 158, 89);
  margin: 2px;
}
</style>