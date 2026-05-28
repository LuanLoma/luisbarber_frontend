<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ destacado: Boolean })
const emit = defineEmits(['eliminar'])
const expandido = ref(false)
const textoBoton = computed(() => (expandido.value ? 'Ver menos' : 'Ver detalles'))
</script>

<template>
  <article :class="['tarjeta', { destacado: props.destacado }]" v-luis-destacado="props.destacado">
    <div class="encabezado">
      <div>
        <slot name="titulo">
          <h2>Servicio de barbería</h2>
        </slot>
      </div>
      <div class="acciones">
        <button type="button" class="alternar" @click="expandido = !expandido">{{ textoBoton }}</button>
        <button type="button" class="eliminar" @click="emit('eliminar')">Desactivar</button>
      </div>
    </div>

    <p v-if="props.destacado" class="marca">Servicio recomendado</p>
    <p v-else class="marca normal">Disponible en Luis Barber</p>

    <div v-if="expandido" class="contenido">
      <slot>
        <p>No se proporcionó información.</p>
      </slot>
    </div>
    <p v-else class="compacto">Abre los detalles para consultar descripción, duración y precio.</p>
  </article>
</template>

<style scoped>
.tarjeta {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 8px 20px rgba(42, 31, 20, 0.08);
}

.destacado {
  border-color: #d6a354;
  box-shadow: 0 10px 24px rgba(148, 99, 35, 0.14);
}

.encabezado {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.encabezado h2 {
  margin: 0;
}

.acciones {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
}

.alternar {
  background: #27221d;
  color: #fffaf2;
}

.eliminar {
  background: #8f2c24;
  color: #fffaf2;
}

.marca {
  color: #9b6420;
  font-weight: 700;
}

.normal,
.compacto {
  color: #766a5a;
}

.contenido {
  border-top: 1px solid #dfd3c0;
  margin-top: 12px;
  padding-top: 12px;
}

@media (max-width: 620px) {
  .encabezado {
    flex-direction: column;
  }
}
</style>
