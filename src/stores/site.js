import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSiteStore = defineStore('site', () => {

        const manutencao = ref(false);

        return {
            manutencao,
    }
}
);