import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
export const useControlStore = defineStore('control', () => {
    const notificaciones = ref(3)
    return {
        notificaciones
    }
})