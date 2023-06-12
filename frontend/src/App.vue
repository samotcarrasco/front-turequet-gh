<script>
import Menu from '@/components/MenuNav.vue';

export default {
  components: {
    Menu
  },
}

</script>

<template>
  <header class="menu">
  <Menu />
  </header>
  <div class="container">
    <router-view />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100vh;
  margin: 0 auto;
  margin-top: 6vw;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  margin-bottom: 2vw;
}


</style> 