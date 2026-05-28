<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useRecordsStore } from '@/modules/public/stores/recordsStore'

const nombreUsuarioGlobal = inject('nombreUsuarioGlobal')
const recordsStore = useRecordsStore()
const enviando = ref(false)
const cita = reactive({
  cliente: '',
  telefono: '',
  correo: '',
  servicio_id: '',
  fecha: '',
  hora: '',
  comentarios: '',
})

const serviciosDestacados = computed(() => recordsStore.serviciosActivos.filter((servicio) => servicio.destacado === 1 || servicio.destacado === true))
const citaValida = computed(() => cita.cliente.trim() && cita.telefono.trim() && cita.correo.includes('@') && cita.servicio_id && cita.fecha && cita.hora)

async function agendarCita() {
  if (!citaValida.value) return
  enviando.value = true
  await recordsStore.crearCita({ ...cita })
  if (!recordsStore.error) {
    cita.cliente = ''
    cita.telefono = ''
    cita.correo = ''
    cita.servicio_id = ''
    cita.fecha = ''
    cita.hora = ''
    cita.comentarios = ''
  }
  enviando.value = false
}

onMounted(() => {
  recordsStore.cargarRegistros()
})
</script>

<template>
  <section class="hero">
    <div class="hero-text">
      <p class="bienvenida">Bienvenido, {{ nombreUsuarioGlobal }}</p>
      <h2>Luis Barber</h2>
      <p>Agenda cortes, barba y paquetes de barbería con confirmación.</p>
      <RouterLink to="/registros" class="hero-btn">Ver servicios</RouterLink>
    </div>

    <form class="agenda" @submit.prevent="agendarCita">
      <h3>Agenda tu cita</h3>
      <input v-model="cita.cliente" type="text" placeholder="Nombre completo" />
      <input v-model="cita.telefono" type="tel" placeholder="Teléfono" />
      <input v-model="cita.correo" type="email" placeholder="Correo" />
      <select v-model="cita.servicio_id">
        <option value="">Selecciona un servicio</option>
        <option v-for="servicio in recordsStore.serviciosActivos" :key="servicio.id" :value="servicio.id">
          {{ servicio.nombre }} - ${{ servicio.precio }}
        </option>
      </select>
      <div class="dos-columnas">
        <input v-model="cita.fecha" type="date" />
        <input v-model="cita.hora" type="time" />
      </div>
      <textarea v-model="cita.comentarios" placeholder="Comentarios para el barbero"></textarea>
      <button type="submit" :disabled="!citaValida || enviando">{{ enviando ? 'Agendando...' : 'Confirmar cita' }}</button>
      <p v-if="recordsStore.error" class="error">{{ recordsStore.error }}</p>
      <p v-if="recordsStore.mensaje" class="ok">{{ recordsStore.mensaje }}</p>
    </form>
  </section>

  <section class="destacados">
    <h3>Servicios recomendados</h3>
    <div class="grid">
      <article v-for="servicio in serviciosDestacados" :key="servicio.id">
        <span>{{ servicio.categoria }}</span>
        <h4>{{ servicio.nombre }}</h4>
        <p>{{ servicio.descripcion }}</p>
        <strong>${{ servicio.precio }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  align-items: start;
}

.hero-text {
  min-height: 420px;
  padding: 54px 34px;
  background: linear-gradient(rgba(17, 17, 17, 0.72), rgba(17, 17, 17, 0.72)), url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  color: #fffaf2;
  border-radius: 8px;
}

.bienvenida {
  color: #d6a354;
  font-weight: 800;
  text-transform: uppercase;
}

.hero h2 {
  font-size: 56px;
  margin: 12px 0;
}

.hero-btn,
button {
  display: inline-block;
  border: 0;
  background: #d6a354;
  color: #111111;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.agenda,
.destacados article {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
  padding: 22px;
}

.agenda {
  display: grid;
  gap: 12px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cdbda5;
  border-radius: 8px;
  padding: 12px;
  font: inherit;
  background: white;
}

textarea {
  min-height: 90px;
  resize: vertical;
}

.dos-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.destacados {
  margin-top: 28px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.grid span {
  color: #9b6420;
  font-weight: 700;
}

.grid h4 {
  margin: 8px 0;
}

.error {
  color: #9c241d;
  font-weight: 700;
}

.ok {
  color: #166534;
  font-weight: 700;
}

@media (max-width: 840px) {
  .hero,
  .dos-columnas {
    grid-template-columns: 1fr;
  }

  .hero h2 {
    font-size: 42px;
  }
}
</style>
