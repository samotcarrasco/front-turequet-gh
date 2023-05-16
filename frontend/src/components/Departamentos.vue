<script>
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

import { departamentosStore } from '@/stores/departamentos';
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
      dptoDialog: false,
      address: "",
      latLong: "",
      direccionModal: "",
      error: "",
      dptoDialog: null,
      modalCreate: null,
      departamento: {
        id: undefined,
        nombre: '',
        abreviatura: '',
        acuartelamiento: '',
        email: '',
        responsableEmpleo: '',
        responsableNombre: '',
        telefono: '',
        latitud: '',
        longitud: '', // Corregir el nombre de la propiedad aquí
        direccion: '',
      },
      isLoading: true,
    };
  },

  computed: {
    ...mapState(departamentosStore, ['departamentos']),
    ...mapState(departamentosStore, ['empleos']),
  },

  // beforeUnmount() {
  //   // const map = new google.maps.Map(document.getElementById("map"));
  //   // map.removeListener('click', this.handleMapClick);

  //   const mapModal = new google.maps.Map(document.getElementById("mapModal"));
  //   //const mapModal = new google.maps.Map(this.$refs.mapModalRef);
  //   mapModal.removeListener('click', this.handleMapClick);
  // },

  mounted() {
    //   window.addEventListener('load', () => {
    //     this.mostrarUbicacion("map",this.latitude, this.longitude);
    //   });

    const toast = useToast();

    const modalCreate = () => {
      this.departamento = {}
      this.submitted = false
      this.dptoDialog = true
      this.cabecera = "Alta de nuevo departamento"
      //this.mostrarUbicacion("map", this.latitude, this.longitude);
      //this.mostrarUbicacion("mapModal", this.latitude, this.longitude);
      this.mostrarYCentrarMapa("mapModal");
    };




    // const onModalShow = () => {
    //   const autocomplete = new google.maps.places.Autocomplete(
    //     document.getElementById("direccionModal")
    //   );

    //   autocomplete.addListener("place_changed", () => {
    //     const place = autocomplete.getPlace();
    //     this.address = place.formatted_address;
    //     this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
    //   });
    //   //this.mostrarYCentrarMapa("mapModal");
    // };

    const hideDialog = () => {
      this.dptoDialog = false
      this.submitted = false
    };

    const saveDpto = () => {
      this.departamento.acuartelamiento = 'ACING';
      const [latitud, longitud] = this.latLong.split(",");
      this.departamento.latitud = latitud;
      this.departamento.longitud = longitud;
      this.departamento.direccion = this.address;
      console.log("entrando en la funcion saveDpto con el material", JSON.stringify(this.departamento))

      this.submitted = true;

      if (this.formularioRellenado(this.departamento)) {
        if (this.departamento.id) {
          //     console.log("punto 2");
          //  this.categoria.inventoryStatus = this.categoria.inventoryStatus.value ? this.categoria.inventoryStatus.value : this.categoria.inventoryStatus;
          // this.categorias[this.findIndexById(this.categoria.id)] = this.categoria;
          //llamad a metodo putcategoria(pendiente de desarrollo)
          //   toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria actualizada', life: 3000 });
        } else {
          console.log("Entrando en saveDpto con dpto: ", JSON.stringify(this.departamento));


         // this.postDepartamento(this.departamento).then(() => { this.getDepartamentos() });
          toast.add({ severity: 'success', summary: 'Departamento creado', detail: this.departamento.nombre + " se ha creado correctamente", life: 4000 });
        }
        this.dptoDialog = false;
        this.departamento = {};
      }
    };


    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("direccion")
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      this.address = place.formatted_address;
      this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
    });


    this.modalCreate = modalCreate;
    this.hideDialog = hideDialog;
    this.saveDpto = saveDpto;
    //this.onModalShow = onModalShow;
    // this.editDpto = editDpto;

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),
    ...mapActions(departamentosStore, ['postDepartamento']),
    ...mapActions(departamentosStore, ['getEmpleos']),



    mostrarYCentrarMapa(idMapa) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          this.getAddressFrom(latitude, longitude);

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
            //this.address = response.data.results[0].formatted_address;
            //this.latLong = `${lat}, ${long}`;
          }
        })
        .catch(error => {
          this.error = error.message;
          console.log(error.message);
        });
    },

    mostrarUbicacion(idMapa, lat, long) {
      let map = new google.maps.Map(document.getElementById(idMapa), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      if (idMapa == "map") {
        this.departamentos.forEach(dpto => {
          console.log("obteniendo coordenadas........." + dpto.latitud, dpto.longitud)
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(dpto.latitud, dpto.longitud),
            map: map
          });

          const infoWindow = new google.maps.InfoWindow({
            //content: `Departamento: ${dpto.abreviatura} - ${dpto.credito} μ`
            content: `${dpto.abreviatura} (${dpto.acuartelamiento}) - ${dpto.credito} μ`
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      }


      if (idMapa == "mapModal") {
        map.addListener('click', this.handleMapClick);

        const autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("direccionModal")
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          this.address = place.formatted_address;
          this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
        });
      }
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
          this.address = formattedAddress;
        } else {
          console.log('No se pudo obtener la dirección correspondiente a las coordenadas.');
        }
      });

      this.latLong = `${lat}, ${lng}`;

    },

    formularioRellenado(dep) {
      return (dep.nombre
        // dep.descripcion &&
        // mat.milis >= this.minMilis &&
        // mat.milis <= this.maxMilis
        // && mat.milis > 0
      )
    },
  },
  async created() {
    this.isLoading = false

    await this.getDepartamentos()

    this.mostrarYCentrarMapa("map");

    //this.isLoading = false


    await this.getEmpleos()

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
            <AccordionTab v-for="departamento in departamentos" :header="departamento.abreviatura" :key="departamento.id">
              <p>
                Email: {{ departamento.email }}<br>
                Crédito: {{ departamento.credito }}
                Coordenadas: {{ departamento.latitud }},{{ departamento.longitud }}
              </p>
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

  <Dialog v-model:visible="dptoDialog" :style="{ width: '70vw' }" :header="cabecera" :modal="true" class="p-fluid">
    <div class="field d-flex mt-2">
      <div class="field col custom-field">
        <label for="name">Nombre:</label>
        <InputText id="name" v-model.trim="departamento.nombre" required="true" autofocus
          :class="{ 'p-invalid': submitted && !departamento.nombre }" />
      </div>
      <div class="field col custom-field">
        <label for="name">Abreviatura:</label>
        <InputText id="name" v-model.trim="departamento.abreviatura" required="true" autofocus=""
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
        <Dropdown v-model="departamento.empleo" :options="empleos" placeholder="Seleccione una categoría"
          :class="{ 'p-invalid': submitted && !departamento.empleo }" />
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
        <InputText id="direccionModal" v-model.trim="address" required="true" autofocus />
      </div>
      <div class="field col custom-field">
        <label for="name">Coordenadas</label>
        <InputText id="LatLongModal" v-model.trim="latLong" disabled />
      </div>
      <div class="field col custom-field">
        <Button label="Mostrar mapa" @click="mostrarYCentrarMapa('mapModal')" />
      </div>
    </div>
    <div id="mapModal" ref="mapModalRef">

    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveDpto" />
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
  /* Adjust the value as needed */
}
</style>