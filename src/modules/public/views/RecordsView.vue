<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRecordsStore } from '@/modules/public/stores/recordsStore'
import ItemCard from '@/modules/public/components/ItemCard.vue'

const recordsStore = useRecordsStore()
const guardando = ref(false)
const form = reactive({
  nombre: '',
  categoria: '',
  descripcion: '',
  precio: 180,
  duracion_minutos: 30,
  destacado: false,
})

const formularioValido = computed(() => form.nombre.trim() && form.categoria.trim() && form.descripcion.trim() && Number(form.precio) > 0 && Number(form.duracion_minutos) >= 15)

async function agregarRegistro() {
  if (!formularioValido.value) return
  guardando.value = true
  await recordsStore.agregarRegistro({
    nombre: form.nombre,
    categoria: form.categoria,
    descripcion: form.descripcion,
    precio: Number(form.precio),
    duracion_minutos: Number(form.duracion_minutos),
    activo: true,
    destacado: form.destacado,
  })
  if (!recordsStore.error) {
    form.nombre = ''
    form.categoria = ''
    form.descripcion = ''
    form.precio = 180
    form.duracion_minutos = 30
    form.destacado = false
  }
  guardando.value = false
}

async function confirmarDesactivacion(item) {
  if (!window.confirm(`¿Desactivar el servicio "${item.nombre}"?`)) return
  await recordsStore.desactivarRegistro(item.id)
}

onMounted(() => {
  recordsStore.cargarRegistros()
})
</script>

<template>
  <section>
    <div class="encabezado">
      <div>
        <p class="eyebrow">Catálogo principal</p>
        <h2>Servicios de Luis Barber</h2>
      </div>
      <div class="metricas">
        <span>{{ recordsStore.totalElementos }} activos</span>
        <span>{{ recordsStore.totalDestacados }} destacados</span>
        <span>Promedio ${{ recordsStore.promedioValor }}</span>
      </div>
    </div>

    <form class="formulario" @submit.prevent="agregarRegistro">
      <h3>Agregar servicio</h3>
      <div class="campos">
        <label>
          Nombre
          <input v-model="form.nombre" type="text" placeholder="Ej. Corte clásico" />
        </label>
        <label>
          Categoría
          <select v-model="form.categoria">
            <option value="">Selecciona una categoría</option>
            <option v-for="item in recordsStore.categorias" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <label>
          Precio
          <input v-model.number="form.precio" type="number" min="1" />
        </label>
        <label>
          Duración en minutos
          <input v-model.number="form.duracion_minutos" type="number" min="15" step="5" />
        </label>
      </div>
      <label>
        Descripción
        <textarea v-model="form.descripcion" placeholder="Describe lo que incluye el servicio"></textarea>
      </label>
      <label class="check">
        <input v-model="form.destacado" type="checkbox" />
        Marcar como recomendado
      </label>
      <button type="submit" :disabled="!formularioValido || guardando">{{ guardando ? 'Guardando...' : 'Agregar servicio' }}</button>
      <p v-if="!formularioValido" class="aviso">Completa nombre, categoría, descripción, precio y duración.</p>
      <p v-if="recordsStore.error" class="aviso">{{ recordsStore.error }}</p>
      <p v-if="recordsStore.mensaje" class="correcto">{{ recordsStore.mensaje }}</p>
    </form>

    <div v-if="recordsStore.cargando" class="panel">Cargando servicios...</div>
    <div v-else-if="recordsStore.serviciosActivos.length" class="lista">
      <ItemCard
        v-for="item in recordsStore.serviciosActivos"
        :key="item.id"
        :destacado="item.destacado === 1 || item.destacado === true"
        @eliminar="confirmarDesactivacion(item)"
      >
        <template #titulo>
          <h2>{{ item.nombre }}</h2>
        </template>
        <p><strong>Categoría:</strong> {{ item.categoria }}</p>
        <p><strong>Descripción:</strong> {{ item.descripcion }}</p>
        <p><strong>Precio:</strong> ${{ item.precio }}</p>
        <p><strong>Duración:</strong> {{ item.duracion_minutos }} minutos</p>
        <p v-if="Number(item.precio) >= 250">Paquete de alto valor.</p>
        <p v-else-if="Number(item.precio) >= 150">Servicio estándar de barbería.</p>
        <p v-else>Servicio rápido.</p>
      </ItemCard>
    </div>
    <div v-else class="panel">No hay servicios activos para mostrar.</div>
  </section>
</template>

<style scoped>
.encabezado {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 4px;
  color: #9b6420;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
}

.metricas {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.metricas span,
.panel,
.formulario {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
}

.metricas span {
  padding: 10px 12px;
  font-weight: 700;
}

.formulario {
  padding: 20px;
  margin-bottom: 18px;
}

.campos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 700;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cdbda5;
  border-radius: 8px;
  padding: 11px;
  font: inherit;
}

textarea {
  margin-top: 12px;
  min-height: 90px;
  resize: vertical;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

.check input {
  width: auto;
}

button {
  border: 0;
  border-radius: 8px;
  background: #111111;
  color: #fffaf2;
  padding: 12px 16px;
  font-weight: 800;
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.lista {
  display: grid;
  gap: 14px;
}

.panel {
  padding: 20px;
}

.aviso {
  color: #9c241d;
  font-weight: 700;
}

.correcto {
  color: #166534;
  font-weight: 700;
}

@media (max-width: 900px) {
  .encabezado {
    align-items: start;
    flex-direction: column;
  }

  .campos {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .campos {
    grid-template-columns: 1fr;
  }
}
</style>
