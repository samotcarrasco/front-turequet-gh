<script>

export default {
}

</script>

<template>
  <nav class="navbar navbar-expand-sm bg-dark fixed-top navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand">
        <router-link :to="{ name: 'home' }">
          <img class="logo" src="../assets/logo.png" alt="Logo Truequet">
        </router-link>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link"  :to="{ name: 'materiales' }">Ver material</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link"  :to="{ name: 'materiales' }">Aportar material</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'categorias' }">Categorías</router-link>
          </li>      
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'categorias' }">Unidades</router-link>
          </li>      
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'estadisticas' }">Estadísticas</router-link>
          </li>      
          <!-- prueba selector dpto -->
        </ul>
        <ul class="navbar-nav me-5">
          <li class="nav-item dropdown">
            <!-- en lugar de "login", ponemos un icono de awesome font para el LOGIN-->
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"> <!--Login-->
              <font-awesome-icon icon="fa-solid fa-user" />
            </a>
            <ul id="login-bar" class="dropdown-menu p-2 mb-0">
              <li>
                <div class="row">
                  <div class="containerL mb-0">
                    <form>
                      <div class="form-group">
                        <!--<label class="sr-only" -->
                        <label id="usuario">Usuario</label>
                        <input type="email" class="form-control obligatorioL" required>
                      </div>
                      <div class="form-group">
                        <label id="passwd">Contraseña</label>
                        <input type="password" class="form-control obligatorioL" required>
                      </div>
                      <div class="d-flex justify-content-center">
                        <button id="enviarLogin" class="btn btn-outline-success  fw-bold" disabled>Acceder</button>
                      </div>
                    </form>
                  </div>
                </div>
              </li>
            </ul>
          </li>
          <li class="nav-item registro">
            <!-- <a class="nav-link" href="altaUsuarios.html">Registro nuevo usuario</a> -->
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* .navbar-nav .nav-link {
  width: 100%;
} */

.fixed-top {
  position: relative
}

.textoDpto {
  color: white;
  align-self: center;
  margin-right: 2vw
}
</style>
