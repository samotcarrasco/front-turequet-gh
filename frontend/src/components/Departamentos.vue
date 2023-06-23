<script>
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

import { departamentosStore } from '@/stores/departamentos'
import { acuartelamientosStore } from '@/stores/acuartelamientos'
import { mapState, mapWritableState, mapActions } from 'pinia'
import InputText from 'primevue/inputtext'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import axios from 'axios'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import { postDepartamento, putDepartamento, deleteDepartamento } from '@/stores/api-service'

export default {
  components: {
    Toast, InputText, Button, Accordion, AccordionTab, Dialog, Dropdown, ProgressSpinner
  },

  data() {
    return {
      dptoDialog: false,
      address: "",
      latLong: "",
      direccionModal: "",
      error: "",
      dptoDialog: null,
      modalCreate: null,
      submitted: false,
      deleteDptoDialog: false,
      departamento: {},
      isLoading: true,
      filtroAcuartelamiento: null,
      acuartelamientoFiltroModal: undefined,
      cabecera: null
    };
  },

  computed: {
    ...mapState(departamentosStore, ['empleos', 'bases']),
    ...mapWritableState(acuartelamientosStore, ['acuartelamiento']),
    ...mapWritableState(departamentosStore, ['departamentos']),

    acuartFiltroModal() {
      return this.departamento.acuartelamientoN
    },

    departamentosFiltrados() {
      let dptosFiltrados = undefined;
      if (this.filtroAcuartelamiento) {
        dptosFiltrados = this.departamentos.filter(departamento => {
          return this.filtroAcuartelamiento === departamento.acuartelamientoN
        });
      } else {
        dptosFiltrados = this.getDepartamentos()
      }
      return dptosFiltrados;
    },

    abreviaturaAntesDelGuion() {
      const guionIndex = this.departamento.abreviatura.indexOf('-')
      let abreviatura = undefined
      if (guionIndex !== -1) {
        abreviatura = this.departamento.abreviatura.substring(0, guionIndex)
      } else {
        abreviatura = this.departamento.abreviatura;
      }
      return abreviatura
    },
  },

  mounted() {
    const toast = useToast();

    const modalCreate = () => {
      this.departamento = {}
      this.submitted = false
      this.dptoDialog = true
      this.cabecera = "Alta de nuevo departamento"
      this.mostrarYCentrarMapa("mapModal")
    };

    //Autocompletado de dirección
    /* descomentar para ver funcionlaidad de relleno de direccion en el mapa principal
       const autocomplete = new google.maps.places.Autocomplete(
         document.getElementById("direccion")
       );
       autocomplete.addListener("place_changed", () => {
         const place = autocomplete.getPlace();
         this.address = place.formatted_address;
         this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`
       });
       */

    const hideDialog = () => {
      this.dptoDialog = false
      this.submitted = false
    };

    const saveDpto = () => {
      this.submitted = true;
      this.departamento.acuartelamiento = this.acuartelamiento
      const [latitud, longitud] = this.latLong.split(",")
      this.departamento.latitud = latitud
      this.departamento.longitud = longitud

      if (this.formularioRellenado(this.departamento)) {
        if (this.departamento.id) {
          this.departamento.acuartelamiento = this.departamento._links.acuartelamiento.href
          this.departamento.abreviatura = this.departamento.abreviatura.replace(/-.*$/, '')

          putDepartamento(this.departamento).then(r => {
            if (r.status == 200) {
              this.getDepartamentos()
              //this.departamentos.splice(this.departamentos.indexOf(this.departamentos), 1, r.data)
              toast.add({ severity: 'success', summary: 'Departamento actualizado', detail: this.departamento.nombre, life: 3000 })
            }
          })
        } else {
          postDepartamento(this.departamento).then(r => {
            if (r.status == 200) {
              this.departamentos.unshift(r.data)
              toast.add({ severity: 'success', summary: 'Departamento creado', detail: this.departamento.nombre + " se ha creado correctamente", life: 4000 })
            }
          })
        }
        this.dptoDialog = false
        this.departamentoF = {}
      }
    };

    const editDpto = (editDpto) => {
      this.departamento = { ...editDpto }
      this.dptoDialog = true
      this.cabecera = "Editar departamento"
      this.mostrarYCentrarMapa("mapModal")

    };

    const confirmDeleteDpto = (dpto) => {
      this.departamento = dpto
      this.deleteDptoDialog = true
    };

    const borrarDpto = () => {
      this.deleteDptoDialog = false;
      deleteDepartamento(this.departamento).then(r => {
       if (r.status == 200) {  
          //this.departamentos.splice(this.departamentos.indexOf(this.departamentos), 1)
          this.getDepartamentos()
          toast.add({ severity: 'success', summary: 'Departamento eliminado', detail: this.departamento.nombre, life: 3000 });
        }
      })

    };
    this.modalCreate = modalCreate
    this.hideDialog = hideDialog
    this.saveDpto = saveDpto
    this.editDpto = editDpto
    this.confirmDeleteDpto = confirmDeleteDpto
    this.borrarDpto = borrarDpto

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos','getEmpleos','getBases']),
    ...mapActions(acuartelamientosStore, ['getAcuartPorSiglas']),

    actualizarAcuartelamiento() {
      this.getAcuartPorSiglas(this.acuartFiltroModal)
    },

    filtrarDepartamentos() {
      //actualizamos el mapa despues de cada filtro, para que se muestren solamente los markers
      // en los departamentos filtrados
      this.mostrarYCentrarMapa("map")
      if (this.filtroAcuartelamiento) {
        this.departamentos = this.departamentos.filter(departamento => {
          return departamento.acuartelamientoN === this.filtroAcuartelamiento
        });
      }

      this.getDepartamentos()
    },


    mostrarYCentrarMapa(idMapa) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords
          this.getAddressFrom(latitude, longitude)
          this.mostrarUbicacion(idMapa, latitude, longitude)
        }, error => {
          this.error = error;
        });
      } else {
        this.error = "El navegador no soporta geolocalización";
      }
    },


    getAddressFrom(lat, long) {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAFnZTjnmXpBH9nZgMyzxKZzwzAYPKpYow`)
        .then(response => {
          if (response.data.error_message) {
            this.error = response.data.error_message;
         } else {
            //inicialmente dejamos estos datos vacios (hasta pulsar en mostrar mapa)
            // this.address = response.data.results[0].formatted_address;
            // this.latLong = `${lat}, ${long}`;
          }
        })
        .catch(error => {
          this.error = error.message;
        });
    },

    mostrarUbicacion(idMapa, lat, long) {
      let map = new google.maps.Map(document.getElementById(idMapa), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      if (idMapa == "map" && this.filtroAcuartelamiento) {
        this.departamentos.forEach(dpto => {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(dpto.latitud, dpto.longitud),
            map: map
          });
          const infoWindow = new google.maps.InfoWindow({
            content: `${dpto.abreviatura} ( # ${dpto.numMateriales} - ${dpto.credito} μ )`
          });
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      }

      if (idMapa == "mapModal") {
        map.addListener('click', this.handleMapClick);
      }
    },


    handleMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const formattedAddress = results[0].formatted_address;
          this.latLong = latlng.toString().replace(/\(|\)/g, "");
          this.departamento.direccion = formattedAddress;
        } else {
          console.log('No se pudo obtener la dirección correspondiente a las coordenadas.');
        }
      });

    },

    formularioRellenado(dep) {
      return !(!dep.nombre || !dep.abreviatura || !dep.email || !dep.responsableNombre ||
               !dep.responsableEmpleo || !dep.telefono)
    },
  },

  async created() {
    this.isLoading = true
    await this.getDepartamentos()
    this.mostrarYCentrarMapa("map");
    await this.getEmpleos()
    await this.getBases()
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
        <div>
          <Button label="Crear nuevo" class="boton-nuevo" icon="pi pi-plus" @click="modalCreate" />
          <Dropdown class="filtro" v-model="filtroAcuartelamiento" :options="bases"
            placeholder="Seleccione un acuartelamiento" @change="filtrarDepartamentos" />
        </div>
        <div class="card">
          <Accordion :multiple="true" :activeIndex="[0]">
            <AccordionTab v-for="departamento in departamentosFiltrados" :key="departamento.id">
              <template #header>
                <span> {{ departamento.abreviatura }} </span>
                <span class="spacer"></span>
                <span> <font-awesome-icon icon="fa-solid fa-dolly" /> </span>
                <span> {{ departamento.numMateriales }} </span>
              </template>
              <b>
                <p>
                  {{ departamento.nombre }} <br>
                  <font-awesome-icon icon="fa-solid fa-envelope" /> {{ departamento.email }}<br>
                  <font-awesome-icon icon="fa-solid fa-coins" /> {{ departamento.credito }} &mu;ilis<br>
                  <font-awesome-icon icon="fa-solid fa-user" /> {{ departamento.responsableEmpleo }}
                  {{ departamento.responsableNombre }}<br>
                  <font-awesome-icon icon="fa-solid fa-address-card" /> {{ departamento.direccion }}<br>
                  <font-awesome-icon icon="fa-solid fa-phone" /> {{ departamento.telefono }} <br>
                  <font-awesome-icon icon="fa-solid fa-dolly" />{{ departamento.numMateriales }}
                </p>
              </b>
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                @click="editDpto(departamento)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                :disabled="departamento.numMateriales > 0" @click="confirmDeleteDpto(departamento)" />

            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </section>
    <section class="right-section">
      <section id="map">
      </section>
    </section>
  </div>

  <Dialog v-model:visible="dptoDialog" :style="{ width: '70vw' }" :header="cabecera" :modal="true" class="p-fluid">
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Nombre:</label>
        <InputText id="name" v-model.trim="departamento.nombre" required="true" autofocus
          :class="{ 'p-invalid': submitted && !departamento.nombre }" />
      </div>
      <div class="field col custom-field">
        <label for="name">Abreviatura:</label>
        <InputText v-if="departamento.id" id="name" v-model.trim="abreviaturaAntesDelGuion" required="true" autofocus=""
          :class="{ 'p-invalid': submitted && !departamento.abreviatura }" />
        <InputText v-else id="name" v-model.trim="departamento.abreviatura" required="true" autofocus=""
          :class="{ 'p-invalid': submitted && !departamento.abreviatura }" />
      </div>
      <div class="field col custom-field">
        <label for="name">Email:</label>
        <InputText id="name" v-model.trim="departamento.email" required="true" autofocus
          :class="{ 'p-invalid': submitted && !departamento.email }" />
      </div>
    </div>
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Nombre y Apellidos del responsable</label>
        <InputText id="name" v-model.trim="departamento.responsableNombre" required="true" autofocus=""
          :class="{ 'p-invalid': submitted && !departamento.responsableNombre }" />
      </div>
      <div class="field col custom-field">
        <label for="empleo">Empleo: </label>
        <Dropdown v-model="departamento.responsableEmpleo" :options="empleos" placeholder="Seleccione un empleo"
          :class="{ 'p-invalid': submitted && !departamento.responsableEmpleo }">
          <template #value="empleo">
            <div>
              <span v-if="!empleo.value" class="departamento-placeholder">Seleccione</span>
              <span v-else :class="'departamento-badge status-' + empleo.value">{{ empleo.value }}</span>
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="field col custom-field">
        <label for="name">Telefono:</label>
        <InputText id="name" v-model.trim="departamento.telefono" required="true" autofocus
          :class="{ 'p-invalid': submitted && !departamento.telefono }" />
      </div>
    </div>

    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Direccion</label>
        <!-- <InputText id="direccionModal" v-model.trim="address" required="true" autofocus/>   -->
        <InputText id="direccionModal" v-model.trim="departamento.direccion" required="true" autofocus />

      </div>
      <div class="field col custom-field">
        <label for="name">Coordenadas</label>
        <InputText id="LatLongModal" v-model.trim="latLong" disabled />
      </div>

      <div class="field col custom-field">
        <label for="empleo">Acuartelamiento: </label>
        <Dropdown v-model="departamento.acuartelamientoN" :options="bases" placeholder="Seleccione"
          :class="{ 'p-invalid': submitted && !departamento.acuartelamiento && !departamento.id }"
          @change="actualizarAcuartelamiento" :disabled="departamento.id != null">
          <template #value="base">
            <div>
              <span v-if="!base.value" class="departamento-placeholder">Seleccione</span>
              <span v-else :class="'departamento-badge status-' + base.value">{{ base.value }}</span>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div id="mapModal">
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveDpto" />
    </template>
  </Dialog>

  <Dialog v-model:visible="deleteDptoDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="departamento"> ¿Está seguro que desea eliminar el departamento <b>{{ departamento.nombre
      }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDptoDialog = false" />
      <Button label="Si" icon="pi pi-check" class="p-button-text" @click="borrarDpto" />
    </template>
  </Dialog>
</template>

<style scoped>

.container {
  display: flex;
}

.left-section {
  flex: 1;
  padding-right: 1rem;
  width: 40vw;
}

.right-section {
  flex: 1;
  padding-left: 1rem;
  width: 40vw;
}

#map {
  width: 100%;
  height: 400px;
  margin-top: 4vw;
}

#mapModal {
  width: 100%;
  height: 400px;
}

.boton-nuevo {
  margin-bottom: 1vh;
  margin-right: 1vw;
}

.filtro {
  margin-top: 1vh;
  margin-bottom: 1vh;
}

.spacer {
  margin-right: 4vw;
}
</style>