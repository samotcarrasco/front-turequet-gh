<script>
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

import { departamentosStore } from '@/stores/departamentos';
import { mapState, mapWritableState, mapActions } from 'pinia'
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
      submitted: false,
      deleteDptoDialog: false,
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
        numMateriales: '',
        longitud: '', // Corregir el nombre de la propiedad aquí
        direccion: '',
      },
      isLoading: true,
      filtroAcuartelamiento: null,
      // departamentos: []
    };
  },

  computed: {
    ...mapWritableState(departamentosStore, ['departamentos']),
    ...mapState(departamentosStore, ['empleos']),
    ...mapState(departamentosStore, ['bases']),


    departamentosFiltrados() {

      if (this.filtroAcuartelamiento) {
        console.log("hay acuartelamiento", this.filtroAcuartelamiento);

        const departamentosCopy = this.departamentos;
        return departamentosCopy.filter(departamento => {
          return this.filtroAcuartelamiento === departamento.acuartelamientoN;
        });
        //console.log(this.departamentos);
      } else {
        return this.getDepartamentos();
      }
    },
  },



  mounted() {
    const toast = useToast();

    const modalCreate = () => {
      this.departamento = {}
      this.submitted = false
      this.dptoDialog = true
      this.cabecera = "Alta de nuevo departamento"
      //this.mostrarUbicacion("mapModal", this.latitude, this.longitude);
      this.mostrarYCentrarMapa("mapModal");
    };


    //prueba autocompletado dirección
    //  const autocomplete = new google.maps.places.Autocomplete(
    //    document.getElementById("direccion")
    //  );

    //  autocomplete.addListener("place_changed", () => {
    //    const place = autocomplete.getPlace();
    //    this.address = place.formatted_address;
    //    this.latLong = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
    //  });



    const hideDialog = () => {
      this.dptoDialog = false
      this.submitted = false
    };

    const saveDpto = () => {
      this.submitted = true;


      this.departamento.acuartelamiento = 'ACING';
      const [latitud, longitud] = this.latLong.split(",");
      this.departamento.latitud = latitud;
      this.departamento.longitud = longitud;
      this.departamento.direccion = this.address;
      // console.log(this.departamento.nombre);
      //console.log("id" + this.departamento.id + this.formularioRellenado(this.departamento))
      // console.log("entrando en la funcion saveDpto con el material", JSON.stringify(this.departamento))

      if (this.formularioRellenado(this.departamento)) {
        if (this.departamento.id) {
          console.log("1111111")
          this.putDepartamento(this.departamento).then(() => { this.getDepartamentos() })
          console.log("2222")
          toast.add({ severity: 'success', summary: 'Departamento actualizado', detail: this.departamento.nombre, life: 3000 })
          console.log("3333")
        } else {
          console.log("Entrando en saveDpto con dpto: ", JSON.stringify(this.departamento))
          this.postDepartamento(this.departamento).then(() => { this.getDepartamentos() })
          toast.add({ severity: 'success', summary: 'Departamento creado', detail: this.departamento.nombre + " se ha creado correctamente", life: 4000 })
        }
        this.dptoDialog = false;
        this.departamento = {};
      }
    };


    const editDpto = (editDpto) => {
      this.departamento = { ...editDpto };
      console.log(this.departamento);
      this.dptoDialog = true;
      this.cabecera = "Editar departamento"

    };

    const confirmDeleteDpto = (dpto) => {
      this.departamento = dpto;
      this.deleteDptoDialog = true;
    };

    const borrarDpto = () => {
      //this.categorias = this.categorias.filter((val) => val.id !== this.categoria.id);
      this.deleteDptoDialog = false;
      //console.log("antes de borrar");
      this.deleteDpto(this.departamento).then(() => { this.getDepartamentos() });
      toast.add({ severity: 'success', summary: 'Departamento eliminado', detail: this.departamento.nombre, life: 3000 });

    };
    this.modalCreate = modalCreate;
    this.hideDialog = hideDialog;
    this.saveDpto = saveDpto;
    //this.onModalShow = onModalShow;
    this.editDpto = editDpto;
    this.confirmDeleteDpto = confirmDeleteDpto;
    this.borrarDpto = borrarDpto;

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),
    ...mapActions(departamentosStore, ['postDepartamento']),
    ...mapActions(departamentosStore, ['putDepartamento']),
    ...mapActions(departamentosStore, ['deleteDpto']),
    ...mapActions(departamentosStore, ['getEmpleos']),
    ...mapActions(departamentosStore, ['getBases']),



    // filtrarDepartamentos() {

    //   this.getDepartamentos();

    //   console.log("Filtrando por acuartelamiento:-", this.filtroAcuartelamiento.trim(), "-");

    //   const kk = this.filtroAcuartelamiento.trim();
    //   console.log("-" + kk + "-")
    //   console.log("Departamentos sin foltrar:", this.departamentos);

    //   this.departamentos = this.departamentos.filter((dep) =>
    //     dep.acuartelamientoN === kk)
    //   console.log("Departamentos filtrados:", this.departamentos);
    // },

    filtrarDepartamentos() {
      // this.getDepartamentos();

      console.log("Filtrando por acuartelamiento:", this.filtroAcuartelamiento.trim());



      if (this.filtroAcuartelamiento) {
        console.log("-" + this.filtroAcuartelamiento + "-");
        this.departamentos = this.departamentos.filter(departamento => {
          return departamento.acuartelamientoN === this.filtroAcuartelamiento;
        });
      }

      this.getDepartamentos();
     // console.log("dptssssss filtrados:", this.departamentosCopy)
    },



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
      let map = new google.maps.Map(document.getElementById(idMapa), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      if (idMapa == "map") {
        // const dptos = this.departamentosFiltrados;        
        // console.log("ddddddddddppptttooosss",dptos)

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



    // onDialogShow() {
    //   console.log("modal abierto")

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

    //  },


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
    await this.getDepartamentos()

    this.mostrarYCentrarMapa("map");

    //this.isLoading = false

    await this.getEmpleos()

    await this.getBases()

    this.isLoading = false
    // console.log(this.departamentos)

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
            <AccordionTab v-for="departamento in departamentosFiltrados" :header="departamento.abreviatura"
              :key="departamento.id">
              <b>
                <p>

                  Email: {{ departamento.email }}<br>
                  <i class="fa-solid fa-coins"></i> {{ departamento.credito }} &mu;ilis<br>
                  Responsable: {{ departamento.responsableEmpleo }} {{ departamento.responsableNombre }}<br>
                  Dirección: {{ departamento.direccion }}<br>
                  Teléfono: {{ departamento.teléfono }} <br>
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
      <InputText id="direccion" v-model.trim="address" required="true" autofocus />
      <!-- <div>
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />
        <InputText id="LatLong" v-model.trim="latLong" disabled />
        <Button label="Posicionar unidades" click="obtenerCoordenadas" /> 
      </div> -->
      <section id="map" ref="mapContainer">
      </section>
    </section>
  </div>

  <Dialog v-model:visible="dptoDialog" :style="{ width: '70vw' }" :header="cabecera" :modal="true" class="p-fluid">
    <!-- @show="onDialogShow"> -->
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
        <!-- <InputText id="direccionModal" v-model.trim="address" required="true" autofocus/> -->
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />

      </div>
      <div class="field col custom-field">
        <label for="name">Coordenadas</label>
        <InputText id="LatLongModal" v-model.trim="latLong" disabled />
      </div>

      <div class="field col custom-field">
        <label for="empleo">Acuartelamiento: </label>
        <Dropdown v-model="departamento.acuartelamiento" :options="bases" placeholder="Seleccione"
          :class="{ 'p-invalid': submitted && !departamento.acuartelamiento }">
          <template #value="base">
            <div>
              <span v-if="!base.value" class="departamento-placeholder">Seleccione</span>
              <span v-else :class="'departamento-badge status-' + base.value">{{ base.value }}</span>
            </div>
          </template>
        </Dropdown>
      </div>

      <!-- <div class="field col custom-field">
        <Button class="boton-mostrar" label="Mostrar mapa" @click="mostrarYCentrarMapa('mapModal')" />
      </div> -->
    </div>
    <div id="mapModal" ref="mapModalRef">
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
  margin-right: 80px;
}

.filtro {
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


.field.d-flex {
  margin-bottom: 1rem;
}

.custom-field {
  margin-right: 1rem;
}
</style>