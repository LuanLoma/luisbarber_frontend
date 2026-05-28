import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('luis-destacado', {
  mounted(el, binding) {
    if (binding.value) {
      el.setAttribute('aria-label', 'Servicio destacado de Luis Barber')
    }
  },
  updated(el, binding) {
    if (binding.value) {
      el.setAttribute('aria-label', 'Servicio destacado de Luis Barber')
    } else {
      el.removeAttribute('aria-label')
    }
  },
})

app.mount('#app')
