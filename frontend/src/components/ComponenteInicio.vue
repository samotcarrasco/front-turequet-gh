<script>
import Fieldset from 'primevue/fieldset';

export default {
  components: { Fieldset }
}

</script>
<template>
  <div>

    <h1>Bienvenido al proyecto Truequet</h1>
    <p>En esta plataforma, se permite realizar el <b>intercambio de materiales entre dieferentes Unidades del E.T. </b></p>
    <p>Para comenzar, <b>seleccione on Rol, </b> eligiendo el correspondiente en el desplegable que aparece en la parte superior
      derecha </p>
    <Fieldset legend="Rol gestor" :toggleable="true">
      <p>
        El rol <b>GESTOR</b> le permitirá <b>gestionar Unidades de nivel Base/Acuartelamiento</b>, donde estarán encuadrados
      <b>Departamentos</b>, que serán realmente los encargados de la gestión de los <b>materiales. </b>
        También podrá <b>gestionar las categorías</b> donde se podrán encuandrar los materiales, y finalmente, podrá visualizar
        diferentes <b>estadísticas. </b>
        <img src="@/assets/img/inicio/gestor.png" height="50">
      </p>
    </Fieldset>

    <Fieldset legend="Rol departamento" :toggleable="true">
      <p>
        Como <b>responsable de un DEPARTAMENTO</b>, podrá <b>ofertar materiales</b> para que puedan ser <b>adquiridos por otros
        departamentos </b>que los soliciten. También podrá adquirir materiales.
        En la parte superior de la imagen podrá ver el <b>crédido (&mu;ilis)</b> del que dispone.
        <br>
        <img src="@/assets/img/inicio/dpto.png" height="50">
      </p>
    </Fieldset>
    <Fieldset legend="INFO" :toggleable="true">
      <p>
        Los materiales podrán estar en uno de los siguientes estados:
      <ul>
        <li>  <img src="@/assets/img/inicio/disponible.png" height="30"> Material <b>disponible para ser solicitado </b></li>
        <li>  <img src="@/assets/img/inicio/pendiente_entrega.png" height="30"> Material <b>ofertado por mi departamento </b>y que está pendiente de ser entregado</li>
        <li>  <img src="@/assets/img/inicio/pendiente_recepcion.png" height="30"> Material <b>solicitado por mi departamento </b>y que está pendiente de ser recibido</li>
        <li>  <img src="@/assets/img/inicio/entregado.png" height="30"> Material que fue ofertado por mi departamento y ya <b>se ha entregado físicamente </b></li>
        <li>  <img src="@/assets/img/inicio/recepcionado.png" height="30"> Material que fue solicitado por mi departamento y ya <b>se ha recibido físicamente </b></li>
      </ul>
      </p>
    </Fieldset>
  </div>
</template>

<style scoped>
.p-fieldset {
  border: 1px solid #4b5320;
  padding: 10px;
  background: rgb(185, 201, 149);
}

.p-fieldset-toggleable {
  margin-bottom: 20px;
}

.p-fieldset-legend {
  background-color: rgb(136, 158, 89);
  align-items: left;
  padding: 10px;
}

.p-fieldset-content {
  margin-top: 10px;
  background: rgb(136, 158, 89);
}
</style>
