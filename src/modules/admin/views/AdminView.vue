<script setup>
import { computed, onMounted } from 'vue'
import { useSessionStore } from '@/modules/auth/stores/sessionStore'
import { useRecordsStore } from '@/modules/public/stores/recordsStore'


const API_URL = "https://luis-barber.onrender.com"

const sessionStore = useSessionStore()
const recordsStore = useRecordsStore()
const citasPendientes = computed(() => recordsStore.citas.filter((cita) => cita.estado === 'pendiente').length)

// Función para conectar el click del botón con la ruta DELETE de Flask
const eliminarCita = async (idCita) => {
  if (!confirm('¿Realmente deseas eliminar esta cita de forma permanente?')) return

  try {
    const respuesta = await fetch(`${API_URL}/citas/${idCita}`, {
      method: 'DELETE'
    })

    if (respuesta.ok) {
      alert('Cita eliminada correctamente.')
      // Pinia vuelve a solicitar las citas a MariaDB y actualiza la interfaz al tiro
      recordsStore.cargarCitas() 
    } else {
      const errorData = await respuesta.json()
      alert(`Error: ${errorData.mensaje || 'No se pudo eliminar'}`)
    }
  } catch (error) {
    console.error('Error al conectar con el backend:', error)
    alert('No se pudo establecer conexión con el servidor.')
  }
}

onMounted(() => {
  recordsStore.cargarCitas()
})
</script>

<template>
  <section>
    <div class="encabezado">
      <div>
        <p class="eyebrow">Panel administrativo</p>
        <h2>Citas registradas</h2>
      </div>
      <div class="resumen">
        <span>{{ recordsStore.citas.length }} citas</span>
        <span>{{ citasPendientes }} pendientes</span>
        <span>{{ sessionStore.autenticado ? 'Sesión activa' : 'Sin sesión' }}</span>
      </div>
    </div>

    <div v-if="recordsStore.error" class="panel error">{{ recordsStore.error }}</div>
    <div v-else-if="recordsStore.citas.length" class="tabla">
      <article v-for="cita in recordsStore.citas" :key="cita.id">
        <div>
          <h3>{{ cita.cliente }}</h3>
          <p>{{ cita.servicio }} - ${{ cita.precio }}</p>
        </div>
        <div>
          <strong>{{ cita.fecha }} {{ cita.hora }}</strong>
          <p>{{ cita.telefono }} · {{ cita.correo }}</p>
        </div>
        
        <div class="acciones">
          <span>{{ cita.estado }}</span>
          <button @click="eliminarCita(cita.id)" class="btn-eliminar">Eliminar</button>
        </div>
      </article>
    </div>
    <div v-else class="panel">No hay citas registradas.</div>
  </section>
</template>

<style scoped>
.encabezado {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.eyebrow {
  color: #9b6420;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
}

.resumen {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.resumen span,
.panel,
.tabla article {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
}

.resumen span {
  padding: 10px 12px;
  font-weight: 700;
}

.tabla {
  display: grid;
  gap: 12px;
}

.tabla article {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 16px;
}

.tabla h3,
.tabla p {
  margin: 0;
}

/* Alineación para la etiqueta de estado y el botón de borrado */
.acciones {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tabla span {
  background: #d6a354;
  color: #111111;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 800;
}

/* Estilos para el botón rojo de eliminar */
.btn-eliminar {
  background: #9c241d;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-eliminar:hover {
  background: #bd322a;
}

.panel {
  padding: 20px;
}

.error {
  color: #9c241d;
  font-weight: 700;
}

@media (max-width: 760px) {
  .encabezado,
  .tabla article {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
  .acciones {
    width: 100%;
    justify-content: space-between;
  }
}
</style>