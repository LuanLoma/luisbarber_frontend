<script setup>
  import { provide, computed, onMounted } from 'vue';
  import { useSessionStore } from '@/modules/auth/stores/sessionStore';
  import MainNavbar from '@/modules/public/components/MainNavbar.vue';

  const sessionStore = useSessionStore();
  const nombreUsuarioGlobal = computed(() => sessionStore.nombreBienvenida);
  const tipoPlanGlobal = computed(() => sessionStore.tipoPlan)

  provide('nombreUsuarioGlobal', nombreUsuarioGlobal)
  provide('tipoPlanGlobal', tipoPlanGlobal)

  onMounted(() => {
    sessionStore.consultarSesion()
  })
</script>


<template>
  <div class="app-shell">
    <MainNavbar />
    <main class="contenedor-pagina"> 
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell{
  min-height: 100vh;
  background: #f5f1ea;
}

.contenedor-pagina {
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 20px 40px;
}
</style>
