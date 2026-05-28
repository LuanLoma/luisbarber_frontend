<script setup>
import { computed } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'

const sessionStore = useSessionStore()
const nombreUsuario = computed(() => sessionStore.nombreBienvenida)
const tipoPlan = computed(() => sessionStore.tipoPlan)
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">
      <span class="logo">LB</span>
      <div>
        <h1>Luis Barber</h1>
        <p>Barbería y cuidado masculino</p>
      </div>
    </RouterLink>

    <nav class="links">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/registros">Servicios</RouterLink>
      <RouterLink to="/perfil">Contacto</RouterLink>
      <RouterLink to="/login">Sesión</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>

    <div class="user-box">
      <span>{{ nombreUsuario }}</span>
      <small>{{ tipoPlan }}</small>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1.1fr 1.6fr auto;
  gap: 20px;
  align-items: center;
  padding: 16px 24px;
  background: #111111;
  color: #fffaf2;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.logo {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 2px solid #d6a354;
  color: #d6a354;
  font-weight: 800;
}

.brand h1 {
  margin: 0;
  font-size: 24px;
}

.brand p {
  margin: 2px 0 0;
  color: #d8c7ad;
  font-size: 13px;
}

.links {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.links a {
  color: #fffaf2;
  text-decoration: none;
  padding: 9px 12px;
  border-radius: 8px;
}

.links a:hover,
.links a.router-link-active {
  background: #d6a354;
  color: #111111;
}

.user-box {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 2px;
}

.user-box span {
  font-weight: 700;
}

.user-box small {
  color: #d8c7ad;
}

@media (max-width: 900px) {
  .navbar {
    grid-template-columns: 1fr;
  }

  .brand,
  .links,
  .user-box {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>
