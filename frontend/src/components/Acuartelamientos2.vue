<script>
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

import { acuartelamientosStore } from '@/stores/acuartelamientos';
import { mapState, mapActions } from 'pinia'
import InputText from 'primevue/inputtext';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dialog from 'primevue/dialog'
import Button from 'primevue/button';
import axios from 'axios';
import Dropdown from 'primevue/dropdown';
import ProgressSpinner from 'primevue/progressspinner';


export default {
  components: {
    Toast, InputText, Button, Accordion, AccordionTab, Dialog, Dropdown, ProgressSpinner
  },

  data() {
    return {
      acuartDialog: false,
      address: "",
      latLong: "",
      direccionModal: "",
      error: "",
      acuartDialog: null,
      modalCreate: null,
      submitted: false,
      deleteAcuartDialog: false,
      acuartelamiento: {
        // id: undefined,
        // nombre: '',
        // abreviatura: '',
        // acuartelamiento: '',
        // email: '',
        // responsableEmpleo: '',
        // responsableNombre: '',
        // telefono: '',
        // latitud: '',
        // numMateriales: '',
        // longitud: '', // Corregir el nombre de la propiedad aquí
        // direccion: '',
      },
      isLoading: true,
    };
  },

  computed: {
    ...mapState(acuartelamientosStore, ['acuartelamientos']),
    ...mapState(acuartelamientosStore, ['empleos']),
  },


  mounted() {
    const toast = useToast();



    const modalCreate = () => {
      this.acuartelamiento = {}
      this.submitted = false
      this.acuartDialog = true
      this.cabecera = "Alta de nuevo acuartelamiento"
      //this.mostrarUbicacion("mapModal", this.latitude, this.longitude);
      this.mostrarYCentrarMapa("mapModal");
    };


    // const autocomplete = new google.maps.places.Autocomplete(
    //   document.getElementById("direccion")
    // );

    // autocomplete.addListener("place_changed", () => {
    //   const place = autocomplete.getPlace();
    //   this.address = place.formatted_address;
    //   this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
    // });



    const hideDialog = () => {
      this.acuartDialog = false
      this.submitted = false
    };

    const saveAcuart = () => {
      this.submitted = true;


      const [latitud, longitud] = this.latLong.split(",");
      this.acuartelamiento.latitud = latitud;
      this.acuartelamiento.longitud = longitud;
      this.acuartelamiento.direccion = this.address;
      // console.log(this.acuartelamiento.nombre);
      //console.log("id" + this.acuartelamiento.id + this.formularioRellenado(this.acuartelamiento))
      // console.log("entrando en la funcion saveAcuart con el material", JSON.stringify(this.acuartelamiento))

      if (this.formularioRellenado(this.acuartelamiento)) {
        if (this.acuartelamiento.id) {
          console.log("1111111")
          this.putAcuartelamiento(this.acuartelamiento).then(() => { this.getAcuartelamientos() })
          console.log("2222")
          toast.add({ severity: 'success', summary: 'Acuartelamiento actualizado', detail: this.acuartelamiento.nombre, life: 3000 })
          console.log("3333")
        } else {
          console.log("Entrando en saveAcuart con acuart: ", JSON.stringify(this.acuartelamiento))
          this.postAcuartelamiento(this.acuartelamiento).then(() => { this.getAcuartelamientos() })
          toast.add({ severity: 'success', summary: 'Acuartelamiento creado', detail: this.acuartelamiento.nombre + " se ha creado correctamente", life: 4000 })
        }
        this.acuartDialog = false;
        this.acuartelamiento = {};
      }
    };


    const editAcuart = (editAcuart) => {
      this.acuartelamiento = { ...editAcuart };
      console.log("entrando en editar acuartelamento", this.acuartelamiento);
      this.acuartDialog = true;
      this.cabecera = "Editar acuartelamiento"

    };

    const confirmDeleteAcuart = (acuart) => {
      this.acuartelamiento = acuart;
      this.deleteAcuartDialog = true;
    };

    const borrarAcuart = () => {
      //this.categorias = this.categorias.filter((val) => val.id !== this.categoria.id);
      this.deleteAcuartDialog = false;
      console.log("antes de borrar", this.acuartelamiento);
      this.deleteAcuartelamiento(this.acuartelamiento).then(() => { this.getAcuartelamientos() });
      toast.add({ severity: 'success', summary: 'Acuartelamiento eliminado', detail: this.acuartelamiento.nombre, life: 3000 });

    };
    this.modalCreate = modalCreate;
    this.hideDialog = hideDialog;
    this.saveAcuart = saveAcuart;
    //this.onModalShow = onModalShow;
    this.editAcuart = editAcuart;
    this.confirmDeleteAcuart = confirmDeleteAcuart;
    this.borrarAcuart = borrarAcuart;

  },
  methods: {
    ...mapActions(acuartelamientosStore, ['getAcuartelamientos']),
    ...mapActions(acuartelamientosStore, ['postAcuartelamiento']),
    ...mapActions(acuartelamientosStore, ['putAcuartelamiento']),
    ...mapActions(acuartelamientosStore, ['deleteAcuartelamiento']),
    ...mapActions(acuartelamientosStore, ['getEmpleos']),




    mostrarYCentrarMapa(idMapa) {
      console.log("entrando en mostrar y centrar mapa");
      if (navigator.geolocation) {
        console.log("el navegaror soporta geolocal");
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          this.getAddressFrom(latitude, longitude);
          console.log("llamando a motrarUbicacion con", idMapa, latitude, longitude)
          this.mostrarUbicacion(idMapa, latitude, longitude);

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
            console.log(response.data.error_message);
          } else {
            //inicialmente dejamos estos datos vación (hasta pulsar en mostrar mapa)
            // this.address = response.data.results[0].formatted_address;
            // this.latLong = `${lat}, ${long}`;
          }
        })
        .catch(error => {
          this.error = error.message;
          console.log(error.message);
        });
    },

    mostrarUbicacion(idMapa, lat, long) {
      console.log("entrando en mostrarUbicacion")
      let map = new google.maps.Map(document.getElementById(idMapa), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      if (idMapa == "map") {
        this.acuartelamientos.forEach(acuart => {
          console.log("obteniendo coordenadas........." + acuart.latitud, acuart.longitud)
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(acuart.latitud, acuart.longitud),
            map: map
          });

          const infoWindow = new google.maps.InfoWindow({
            //content: `Acuartelamiento: ${acuart.abreviatura} - ${acuart.credito} μ`
            content: `${acuart.abreviatura}`
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      }


      if (idMapa == "mapModal") {
        map.addListener('click', this.handleMapClick);

        // const autocomplete = new google.maps.places.Autocomplete(
        //   document.getElementById("direccionModal")
        // );

        // autocomplete.addListener("place_changed", () => {
        //   const place = autocomplete.getPlace();
        //   this.address = place.formatted_address;
        //   this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
        // });
      }
    },



    onDialogShow() {
      console.log("modal abierto")

      // navigator.geolocation.getCurrentPosition(position => {
      //   const { latitude, longitude } = position.coords;
      //   this.getAddressFrom(latitude, longitude);

      //   this.mostrarUbicacion("mapModal", latitude, longitude);

      // }, error => {
      //   this.error = error;
      // });


      // const direccionModalElement = document.getElementById("direccionModal");
      // if (direccionModalElement) {
      //   console.log("modal abierto");

      //   const autocomplete = new google.maps.places.Autocomplete(direccionModalElement);
      //   console.log(autocomplete);
      //   console.log(direccionModalElement);
      //   console.log(document.getElementById("direccion"));
      //   autocomplete.addListener("place_changed", () => {
      //     console.log("Lugar seleccionado");
      //     const place = autocomplete.getPlace();
      //     this.address = place.formatted_address;
      //     this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
      //   });

      //   console.log("ID encontrado correctamente");
      // } else {
      //   console.log("No se encontró ningún elemento con el ID 'direccionModal'");
      // }

      // Asociar el mapa al autocompletado

    },


    handleMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`Maps clickeado:   ${lat}, ${lng}`);

      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const formattedAddress = results[0].formatted_address;
          this.latLong = latlng.toString().replace(/\(|\)/g, "");
          this.address = formattedAddress;
        } else {
          console.log('No se pudo obtener la dirección correspondiente a las coordenadas.');
        }
      });

    },

    formularioRellenado(dep) {
      console.log(dep.abreviatura && dep.nombre);
      //lo hacemos así porque no entiendo por qué no lo evalua como booleano
      //por ejemplo, comos e hace en Categrias.vue
      if (dep.nombre == '' || dep.abreviatura == '' ||
        dep.email == '' || dep.responsableNombre == '' ||
        dep.responsableEmpleo == '' || dep.telefono == '') {
        return false
      } else {
        return true
      }
    },
  },

  async created() {
    this.isLoading = true
    await this.getAcuartelamientos()
    //this.isLoading = false

    await this.getEmpleos()
    console.log("cargando mapa...........")
    this.mostrarYCentrarMapa("map");

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
            <AccordionTab v-for="acuartelamiento in acuartelamientos" :header="acuartelamiento.abreviatura" :key="acuartelamiento.id">
              <b><p>

                Email: {{ acuartelamiento.email }}<br>
                Responsable: {{ acuartelamiento.responsableEmpleo }} {{ acuartelamiento.responsableNombre }}

                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                  @click="editAcuart(acuartelamiento)" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" :disabled="acuartelamiento.numMateriales > 0"
                   @click="confirmDeleteAcuart(acuartelamiento)" />
              </p></b>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </section>
    <section class="right-section">
      <InputText id="direccion" v-model.trim="address" required="true" autofocus />
      <!-- <div>
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />
        <InputText id="LatLong" v-model.trim="latLong" disabled />
        <Button label="Posicionar unidades" click="obtenerCoordenadas" /> 
      </div> -->
      <section id="map">
      </section>
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
        <!-- <InputText id="direccionModal" v-model.trim="address" required="true" autofocus/> -->
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />

      </div>
      <div class="field col custom-field">
        <label for="name">Coordenadas</label>
        <InputText id="LatLongModal" v-model.trim="latLong" disabled />
      </div>
      <!-- <label for="empleo">Acuartelamiento: </label>
        <Dropdown v-model="acuartelamiento.responsableEmpleo" :options="empleos" placeholder="Seleccione un empleo"
          :class="{ 'p-invalid': submitted && !acuartelamiento.responsableEmpleo }">
          <template #value="empleo">
            <div>
              <span v-if="!empleo.value" class="acuartelamiento-placeholder">Seleccione</span>
              <span v-else :class="'acuartelamiento-badge status-' + empleo.value">{{ empleo.value }}</span>
            </div>
          </template>
        </Dropdown> -->
              <!-- <div class="field col custom-field">
        <Button class="boton-mostrar" label="Mostrar mapa" @click="mostrarYCentrarMapa('mapModal')" />
      </div> -->
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
  margin-top: 20px !important;
  padding-top: 0;
}

.left-section {
  flex: 1;
  padding-right: 1rem;
}

.right-section {
  flex: 1;
  padding-left: 1rem;
}

#map {
  width: 100%;
  height: 400px;
  margin-top: 4vw;
  /* Ajusta la altura según tus necesidades */
}

#mapModal {
  width: 100%;
  height: 400px;
  /* Ajusta la altura según tus necesidades */
}

.boton-nuevo {
  margin-bottom: 20px;
}

.boton-mostrar {
  margin-top: 25px;
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
</style>