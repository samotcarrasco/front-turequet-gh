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

    <div class="main">
   </div>
  </div>
</template>



<style>
.container {
  display: grid;
  margin-top: 100px;
  margin-left: 0;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
}

.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}
</style>
