<template>
  <section class="about">
    <h2>Acerca de la plantilla</h2>
    <p>
      Esta plantilla base permite adaptar una aplicación Vue 3 a distintos giros de negocio, conservando una arquitectura modular, router y stores con Pinia.
    </p>

    <div class="grid">
      <div class="box">
        <h3>Módulo public</h3>
        <p>Contiene las vistas públicas, componentes reutilizables y la store de registros.</p>
      </div>
      <div class="box">
        <h3>Módulo auth</h3>
        <p>Prepara la autenticación y el manejo de sesión con su propia store.</p>
      </div>
      <div class="box">
        <h3>Módulo admin</h3>
        <p>Deja lista una posible zona administrativa para crecer en el futuro.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about h2 {
  margin-top: 0;
  color: #0f172a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.box {
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}
</style>