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
    try {
      const respuesta = await fetch(`${URL_BACKEND}/sesion`, { credentials: 'include' })
      const datos = await respuesta.json()
      
      // CONFIGURACIÓN DE SEGURIDAD: Si Flask responde con un error (como el 401), limpiamos el estado
      if (!respuesta.ok) {
        aplicarSesion({ nombreUsuario: 'Invitado', correo: null, rol: 'cliente', autenticado: false })
        throw new Error(datos.mensaje || 'Error al consultar la sesión')
      }
      
      aplicarSesion(datos)
    } catch (err) {
      console.warn(' [Pinia Auth] Estado de sesión:', err.message)
      // Guardamos el error en el ref por si tu vista lo ocupa mostrar de forma sutil
      error.value = err.message 
    }
  }

  async function iniciarSesion(credenciales) {
    mensaje.value = ''
    error.value = ''
    try {
      const respuesta = await fetch(`${URL_BACKEND}/login`, {
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
    try {
      await fetch(`${URL_BACKEND}/logout`, { method: 'POST', credentials: 'include' })
    } catch (err) {
      console.error('Error al cerrar sesión en servidor:', err)
    }
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