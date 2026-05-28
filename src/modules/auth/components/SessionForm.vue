<script setup>
import { computed, reactive } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'

const sessionStore = useSessionStore()
const form = reactive({
  correo: 'admin@luisbarber.com',
  password: '12345',
})
const puedeIngresar = computed(() => form.correo.trim() && form.password.trim())

async function enviarFormulario() {
  if (!puedeIngresar.value) return
  await sessionStore.iniciarSesion({ correo: form.correo, password: form.password })
}
</script>

<template>
  <form class="login-form" @submit.prevent="enviarFormulario">
    <label for="correo">Correo</label>
    <input id="correo" v-model="form.correo" type="email" placeholder="admin@luisbarber.com" />

    <label for="password">Contraseña</label>
    <input id="password" v-model="form.password" type="password" placeholder="12345" />

    <button type="submit" :disabled="!puedeIngresar">Iniciar sesión</button>

    <p v-if="!puedeIngresar" class="warning">Correo y contraseña son obligatorios.</p>
    <p v-if="sessionStore.error" class="warning">{{ sessionStore.error }}</p>
    <p v-if="sessionStore.mensaje" class="success">{{ sessionStore.mensaje }}</p>
  </form>
</template>

<style scoped>
.login-form {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
  padding: 22px;
  max-width: 420px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
}

input,
button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  font: inherit;
}

input {
  border: 1px solid #cdbda5;
}

button {
  border: 0;
  background: #111111;
  color: #fffaf2;
  font-weight: 800;
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
}

.warning {
  color: #9c241d;
  font-weight: 700;
}

.success {
  color: #166534;
  font-weight: 700;
}
</style>
