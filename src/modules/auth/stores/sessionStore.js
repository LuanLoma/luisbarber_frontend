import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const URL_BACKEND = import.meta.env.VITE_API_URL || 'https://luis-barber.onrender.com'


export const useSessionStore = defineStore('session', () => {
  const nombreUsuario = ref('Invitado')
  const correo = ref(null)
  const rol = ref('cliente')
  const autenticado = ref(false)
  const mensaje = ref('')
  const error = ref('')

  const nombreBienvenida = computed(() => nombreUsuario.value)
  const tipoPlan = computed(() => (rol.value === 'admin' ? 'Administrador' : 'Cliente'))
  const esPremium = computed(() => rol.value === 'admin')

  function aplicarSesion(sesion) {
    nombreUsuario.value = sesion.nombreUsuario || 'Invitado'
    correo.value = sesion.correo || null
    rol.value = sesion.rol || 'cliente'
    autenticado.value = Boolean(sesion.autenticado)
  }

  async function consultarSesion() {
    const respuesta = await fetch(`${'https://luis-barber.onrender.com'}/sesion`, { credentials: 'include' })
    aplicarSesion(await respuesta.json())
  }

  async function iniciarSesion(credenciales) {
    mensaje.value = ''
    error.value = ''
    try {
      const respuesta = await fetch(`${'https://luis-barber.onrender.com'}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales),
      })
      const datos = await respuesta.json()
      if (!respuesta.ok) {
        throw new Error(datos.errores ? datos.errores.join(', ') : datos.mensaje)
      }
      aplicarSesion(datos.sesion)
      mensaje.value = datos.mensaje
    } catch (err) {
      error.value = err.message
    }
  }

  async function cerrarSesion() {
    await fetch(`${'https://luis-barber.onrender.com'}/logout`, { method: 'POST', credentials: 'include' })
    aplicarSesion({ nombreUsuario: 'Invitado', correo: null, rol: 'cliente', autenticado: false })
    mensaje.value = 'Sesión cerrada correctamente'
  }

  function cambiarPlan() {
    rol.value = rol.value === 'admin' ? 'cliente' : 'admin'
  }

  return {
    nombreUsuario,
    correo,
    rol,
    autenticado,
    tipoPlan,
    nombreBienvenida,
    esPremium,
    mensaje,
    error,
    consultarSesion,
    iniciarSesion,
    cerrarSesion,
    cambiarPlan,
  }
})
