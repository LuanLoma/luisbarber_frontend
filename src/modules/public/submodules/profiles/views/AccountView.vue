<script setup>
import { computed, reactive, ref } from 'vue'

const URL_BACKEND = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
const enviando = ref(false)
const mensaje = ref('')
const error = ref('')
const contacto = reactive({ nombre: '', correo: '', mensaje: '' })
const contactoValido = computed(() => contacto.nombre.trim() && contacto.correo.includes('@') && contacto.mensaje.trim())

async function enviarContacto() {
  if (!contactoValido.value) return
  enviando.value = true
  mensaje.value = ''
  error.value = ''
  try {
    const respuesta = await fetch(`${URL_BACKEND}/contacto`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacto),
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      throw new Error(datos.errores ? datos.errores.join(', ') : datos.mensaje)
    }
    mensaje.value = datos.mensaje
    contacto.nombre = ''
    contacto.correo = ''
    contacto.mensaje = ''
  } catch (err) {
    error.value = err.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="contacto">
    <div>
      <p class="eyebrow">Contacto</p>
      <h2>Habla con Luis Barber</h2>
      <p>Contactanos.</p>
      <div class="datos">
        <p><strong>Horario:</strong> Lunes a sábado, 10:00 a 20:00</p>
        <p><strong>Ubicación:</strong> Centro, Culiacan</p>
        <p><strong>Teléfono:</strong> 614 000 0000</p>
      </div>
    </div>

    <form @submit.prevent="enviarContacto">
      <label>
        Nombre
        <input v-model="contacto.nombre" type="text" />
      </label>
      <label>
        Correo
        <input v-model="contacto.correo" type="email" />
      </label>
      <label>
        Mensaje
        <textarea v-model="contacto.mensaje"></textarea>
      </label>
      <button type="submit" :disabled="!contactoValido || enviando">{{ enviando ? 'Enviando...' : 'Enviar mensaje' }}</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="mensaje" class="ok">{{ mensaje }}</p>
    </form>
  </section>
</template>

<style scoped>
.contacto {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.eyebrow {
  color: #9b6420;
  font-weight: 800;
  text-transform: uppercase;
}

.datos,
form {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
  padding: 20px;
}

label {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  font-weight: 700;
}

input,
textarea {
  border: 1px solid #cdbda5;
  border-radius: 8px;
  padding: 11px;
  font: inherit;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

button {
  border: 0;
  border-radius: 8px;
  background: #111111;
  color: #fffaf2;
  padding: 12px 16px;
  font-weight: 800;
}

button:disabled {
  opacity: 0.55;
}

.error {
  color: #9c241d;
  font-weight: 700;
}

.ok {
  color: #166534;
  font-weight: 700;
}

@media (max-width: 760px) {
  .contacto {
    grid-template-columns: 1fr;
  }
}
</style>
