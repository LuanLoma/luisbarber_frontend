import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const URL_BACKEND = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

async function leerRespuesta(respuesta) {
  const datos = await respuesta.json()
  if (!respuesta.ok) {
    const detalle = datos.errores ? datos.errores.join(', ') : datos.mensaje
    throw new Error(detalle || 'No se pudo completar la solicitud')
  }
  return datos
}

export const useRecordsStore = defineStore('servicios', () => {

  const categorias = ref(['Cabello', 'Barba', 'Paquete', 'Tratamiento'])
  

  const servicios = ref([])
  

  const citas = ref([])
  
  const mensaje = ref('')
  const error = ref('')
  const cargando = ref(false)

 
  const serviciosActivos = computed(() => servicios.value.filter((item) => item.activo === 1 || item.activo === true))
  const totalElementos = computed(() => serviciosActivos.value.length)
  const totalDestacados = computed(() => serviciosActivos.value.filter((item) => item.destacado === 1 || item.destacado === true).length)
  const promedioValor = computed(() => {
    if (serviciosActivos.value.length === 0) return '0.00'
    const suma = serviciosActivos.value.reduce((total, item) => total + Number(item.precio), 0)
    return (suma / serviciosActivos.value.length).toFixed(2)
  })

 
  
 
  async function cargarRegistros() {
    cargando.value = true
    error.value = ''
    try {
      servicios.value = await leerRespuesta(await fetch(`${URL_BACKEND}/servicios`, { credentials: 'include' }))
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

 
  async function agregarRegistro(nuevoServicio) {
    mensaje.value = ''
    error.value = ''
    try {
      const resultado = await leerRespuesta(await fetch(`${URL_BACKEND}/servicios`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoServicio),
      }))
      mensaje.value = resultado.mensaje
      await cargarRegistros() 
    } catch (err) {
      error.value = err.message
    }
  }

  
  async function desactivarRegistro(id) {
    mensaje.value = ''
    error.value = ''
    try {
      const resultado = await leerRespuesta(await fetch(`${URL_BACKEND}/servicios/${id}/desactivar`, {
        method: 'PUT',
        credentials: 'include',
      }))
      mensaje.value = resultado.mensaje
      await cargarRegistros()
    } catch (err) {
      error.value = err.message
    }
  }



 
  async function cargarCitas() {
    error.value = ''
    try {
      citas.value = await leerRespuesta(await fetch(`${URL_BACKEND}/citas`, { credentials: 'include' }))
    } catch (err) {
      error.value = err.message
    }
  }

  
  async function crearCita(nuevaCita) {
    mensaje.value = ''
    error.value = ''
    try {
      const resultado = await leerRespuesta(await fetch(`${URL_BACKEND}/citas`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCita),
      }))
      mensaje.value = resultado.mensaje
      await cargarCitas()
    } catch (err) {
      error.value = err.message
    }
  }

  
  async function eliminarCita(id) {
    mensaje.value = ''
    error.value = ''
    try {
      const resultado = await leerRespuesta(await fetch(`${URL_BACKEND}/citas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      }))
      mensaje.value = resultado.mensaje
      await cargarCitas() 
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    categorias,
    servicios,
    registros: servicios,
    citas,
    totalElementos,
    totalDestacados,
    promedioValor,
    serviciosActivos,
    registrosActivos: serviciosActivos,
    mensaje,
    error,
    cargando,
    cargarRegistros,
    agregarRegistro,
    desactivarRegistro,
    crearCita,
    cargarCitas,
    eliminarCita,
  }
})