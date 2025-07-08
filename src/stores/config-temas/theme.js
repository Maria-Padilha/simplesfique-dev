import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {

        const darkMode = ref(false);
        const tipoBtn = ref(true);
        const brightness = ref(1);

        return {
            darkMode,
            tipoBtn,
            brightness
        };
    },
    {
        persist: {
            key: 'temas',
            storage: localStorage,
        }
    }
);