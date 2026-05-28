<script setup>
import { inject } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'
import SessionForm from '@/modules/auth/components/SessionForm.vue'

const sessionStore = useSessionStore()
const tipoPlanGlobal = inject('tipoPlanGlobal')
</script>

<template>
  <section class="sesion">
    <div>
      <p class="eyebrow">Manejo básico de sesión</p>
      <h2>Acceso administrativo</h2>
      <p>Inicia sesión contra Flask para entrar al panel y gestionar tus servicios.</p>
      <SessionForm />
    </div>

    <aside class="estado-box">
      <h3>Sesión actual</h3>
      <p><strong>Usuario:</strong> {{ sessionStore.nombreUsuario }}</p>
      <p><strong>Correo:</strong> {{ sessionStore.correo || 'Sin sesión' }}</p>
      <p><strong>Rol:</strong> {{ tipoPlanGlobal }}</p>
      <p><strong>Autenticado:</strong> {{ sessionStore.autenticado ? 'Sí' : 'No' }}</p>
      
      <button class="secundario" @click="sessionStore.cerrarSesion">Cerrar sesión</button>
    </aside>
  </section>
</template>

<style scoped>
.sesion {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 22px;
}

.eyebrow {
  color: #9b6420;
  font-weight: 800;
  text-transform: uppercase;
}

.estado-box {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
  padding: 20px;
}

button {
  width: 100%;
  border: 0;
  border-radius: 8px;
  background: #111111;
  color: #fffaf2;
  padding: 11px;
  margin-top: 8px;
  font-weight: 800;
  cursor: pointer;
}

.secundario {
  background: #8f2c24;
}

@media (max-width: 760px) {
  .sesion {
    grid-template-columns: 1fr;
  }
}
</style>