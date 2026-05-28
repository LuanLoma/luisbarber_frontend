<script setup>
// Se eliminó la lógica de estado del formulario para mantener el archivo limpio
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
  </section>
</template>

<style scoped>
.contacto {
  display: grid;
  /* Ahora usamos un solo bloque centrado o a lo ancho */
  grid-template-columns: 1fr;
  max-width: 600px;
  margin: 0 auto;
  gap: 22px;
}

.eyebrow {
  color: #9b6420;
  font-weight: 800;
  text-transform: uppercase;
}

.datos {
  background: #fffaf2;
  border: 1px solid #dfd3c0;
  border-radius: 8px;
  padding: 20px;
}
</style>