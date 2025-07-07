import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {

        const darkMode = ref(false);
        const tipoBtn = ref('tonal');

        return {
            darkMode,
            tipoBtn
        };
    },
    {
        persist: {
            key: 'temas',
            storage: localStorage,
        }
    }
);