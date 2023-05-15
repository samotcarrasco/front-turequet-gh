<script>
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
    InputText, Button, Accordion, AccordionTab, Dialog, Dropdown, ProgressSpinner
  },

  data() {
    return {
      dptoDialog: false,
      address: "",
      latLong: "",
      direccionModal: "",
      LatLongModal: "",
      error: "",
      latitude: "",
      longitude: "",
      dptoDialog: null,
      modalCreate: null,
      departamento: {
        nombre: '',
        abreviatura: '',
        acuartelamiento: '',
        email: '',
        responsableEmpleo: '',
        responsableNombre: '',
        telefono: '',
        latitud: '',
        longigud: '',
        direccion: '',
        isLoading: true,

      }
    };
  },

  computed: {
    ...mapState(departamentosStore, ['departamentos']),
    ...mapState(departamentosStore, ['empleos']),
  },

  beforeUnmount() {
    const map = new google.maps.Map(document.getElementById("map"));
    map.removeListener('click', this.handleMapClick);

    const mapModal = new google.maps.Map(document.getElementById("mapModal"));
    //const mapModal = new google.maps.Map(this.$refs.mapModalRef);
    mapModal.removeListener('click', this.handleMapClick);
  },

  mounted() {
    //   window.addEventListener('load', () => {
    //     this.showUserLocationOnTheMap(this.latitude, this.longitude);
    //   });

    const modalCreate = () => {
      this.departamento = {}
      this.submitted = false
      this.dptoDialog = true
      this.cabecera = "Alta de nuevo departamento"
      this.showUserLocationOnTheMapModal(this.latitude, this.longitude);
    };

    const onModalShow = () => {
      this.showUserLocationOnTheMap(this.latitude, this.longitude);
      this.showUserLocationOnTheMapModal(this.latitude, this.longitude);
    };

    const hideDialog = () => {
      this.dptoDialog = false
      this.submitted = false
    };

    const saveDpto = () => {
      console.log("entrando en la funcion saveMaterial con el material", JSON.stringify(this.departamento))

      this.submitted = true;

      if (this.formularioRellenado(this.departamento)) {
        //if (this.deparamento.id) {
        //     console.log("punto 2");
        //     //  this.categoria.inventoryStatus = this.categoria.inventoryStatus.value ? this.categoria.inventoryStatus.value : this.categoria.inventoryStatus;
        //     // this.categorias[this.findIndexById(this.categoria.id)] = this.categoria;
        //     //llamad a metodo putcategoria(pendiente de desarrollo)
        //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Categoria actualizada', life: 3000 });
        // } else {
        //   console.log("punto 3");


        //this.postDepartamento(this.departamento).then(() => { this.getDepartamentos() });
        toast.add({ severity: 'success', summary: 'Deparamento creado', detail: this.departamento.nombre + " se ha creado correctamente", life: 4000 });
        //}
        this.dptoDialog = false;
        this.departamento = {};
      }
    };


    new google.maps.places.Autocomplete(
      document.getElementById("direccionModal")
    )

    this.modalCreate = modalCreate;
    this.hideDialog = hideDialog;
    this.saveDpto = saveDpto;
    this.onModalShow = onModalShow;
    // this.editDpto = editDpto;

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),
    ...mapActions(departamentosStore, ['getEmpleos']),

    // mostrarMapaModal(){
    //   this.showUserLocationOnTheMapModal(latitude, longitude);
    // },

    obtenerCoordenadas() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          this.getAddressFrom(latitude, longitude);

          this.showUserLocationOnTheMap("map", latitude, longitude);
          this.showUserLocationOnTheMap("mapModal", latitude, longitude);

          // const markerOptions = {
          //   position: { lat: latitude, lng: longitude },
          //   map: mapa, // Reemplaza "mapa" con la variable que contiene tu mapa
          //   title: "Mi ubicación"
          // };
          // const marker = new google.maps.Marker(markerOptions);


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
            this.address = response.data.results[0].formatted_address;
            this.latLong = `${lat}, ${long}`;
            this.laitude = lat;
            this.longitude = long;
          }
        })
        .catch(error => {
          this.error = error.message;
          console.log(error.message);
        });
    },

    showUserLocationOnTheMap(idMapa, lat, long) {
      let map = new google.maps.Map(document.getElementById(idMapa), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      map.addListener('click', this.handleMapClick);
    },


    async showUnidadesOnTheMap(idMapa) {
      const map = new google.maps.Map(document.getElementById(idMapa), {
        zoom: 10,
        center: new google.maps.LatLng(40.4165, -3.70256),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

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
    },


    handleMapClick(event) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`Maps clickeado:   ${lat}, ${lng}`);
      // Actualizar los datos correspondientes en tu componente
      this.latLong = `${lat}, ${lng}`;
      //this.address = ''; // Limpiar la dirección ya que las coordenadas pueden no tener una dirección asociada

      this.address = this.getAddressFrom(`${lat}, ${lng}`);
      // Llamar a cualquier otra función o método que necesites
      // ...
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
    this.isLoading = true
    await this.getDepartamentos()

    this.obtenerCoordenadas();
    this.isLoading = false

    await this.showUnidadesOnTheMap("map")
    //await this.showUnidadesOnTheMap("mapModal")
    //await this.showUserLocationOnTheMapModal()
    // this.mostrarMapaModal()
    await this.getEmpleos()
    // this.empleos.forEach(element => {
    //   console.log("leyendo empleoss" + element)
    // });
  }
}
</script>

<template>
  <div class="container">
    <section class="left-section">
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
      <div>
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />
        <InputText id="LatLong" v-model.trim="latLong" disabled />
        <!-- <Button label="Posicionar unidades" @click="obtenerCoordenadas" /> -->
      </div>
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
        <Button label="Mostrar mapa" @click="obtenerCoordenadas" />
      </div>
    </div>
    <div id="mapModal" ref="mapModalRef">

    </div>


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