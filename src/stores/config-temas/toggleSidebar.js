import { defineStore } from 'pinia'

export const useToggleSidebarStore = defineStore('toggle-sidebar', {
    state: () => ({
        sidebarTemasAberto: false
    }),
    actions: {
        abrirSidebarTemas() {
            console.log('abrindo')
            this.sidebarTemasAberto = true
        },
        fecharSidebarTemas() {
            this.sidebarTemasAberto = false
        },
        alternarSidebarTemas() {
            this.sidebarTemasAberto = !this.sidebarTemasAberto
        }
    }
})
