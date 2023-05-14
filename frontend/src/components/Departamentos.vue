<script>
import { departamentosStore } from '@/stores/departamentos';
import { mapState, mapActions } from 'pinia'
import InputText from 'primevue/inputtext';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import axios from 'axios';

export default {
  components: {
    InputText, Button, Accordion, AccordionTab
  },

  data() {
    return {
      address: "",
      latLong: "",
      error: "",
      latitude: "",
      longitude: "",
      modalEditCreate: null,
    };
  },

  computed: {
    ...mapState(departamentosStore, ['departamentos']),
  },

  beforeUnmount() {
     const map = new google.maps.Map(document.getElementById("map"));
     map.removeListener('click', this.handleMapClick);
  },

  mounted() {
    //   window.addEventListener('load', () => {
    //     this.showUserLocationOnTheMap(this.latitude, this.longitude);
    //   });

    new google.maps.places.Autocomplete(
      document.getElementById("direccion")
      // {
      //   bounds: new google.maps.LatLngBounds(
      //     new google.maps.LatLng(40.4165,-3.70256)
      //   )
      // }
    )

    this.showUnidadesOnTheMap();

  },
  methods: {
    ...mapActions(departamentosStore, ['getDepartamentos']),

    obtenerCoordenadas() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          this.getAddressFrom(latitude, longitude);

          this.showUserLocationOnTheMap(latitude, longitude);

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

     showUserLocationOnTheMap(lat, long) {
       let map = new google.maps.Map(document.getElementById("map"), {
         zoom: 15,
         center: new google.maps.LatLng(lat, long),
         mapTypeId: google.maps.MapTypeId.ROADMAP
       });

       map.addListener('click', this.handleMapClick);
     },

    
    showUnidadesOnTheMap() {
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: new google.maps.LatLng(40.4165, -3.70256),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.departamentos.forEach(dpto => {
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
      this.address = ''; // Limpiar la dirección ya que las coordenadas pueden no tener una dirección asociada

      // Llamar a cualquier otra función o método que necesites
      // ...
    }
  },
  async created() {
    await this.getDepartamentos() 
  }
}
</script>

<template>
  <div class="container">
    <section class="left-section">
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
    </section>
    <section class="right-section">
      <div v-show="error">{{ error }}</div>
      <div>
        <InputText id="direccion" v-model.trim="address" required="true" autofocus />
        <InputText id="LatLong" v-model.trim="latLong" disabled />
        <Button label="Mi localizacion" @click="obtenerCoordenadas" />
      </div>
      <section id="map">
     </section>
    </section>
  </div>
</template>

<style>
.container {
  display: flex;
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
</style>