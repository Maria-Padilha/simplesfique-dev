<template>
  <div>
    <h2 class="text-2xl font-bold mb-8">Parâmetro Financeiro</h2>
    <p class="text-sm opacity-70 mb-12">Centro de Custo</p>


    <!-- SEÇÃO: CENTRO DE CUSTO -->
    <div class="mt-10 pt-8 border-t border-opacity-20 ">
      <!-- GRID COM 3 INPUTS -->
      <v-row dense class="flex justify-center w-100 gap-12">
        <v-col cols="12" md="2">
          <v-text-field
              label="Nível 1"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              min="1"
              max="1"
              v-model="parfinData.ccusto_nivel1"
              v-mask-number
              :loading="useConfig.loading"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
              label="Nível 2"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              min="1"
              max="2"
              v-model="parfinData.ccusto_nivel2"
              v-mask-number
              :loading="useConfig.loading"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
              label="Nível 3"
              placeholder="0"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              min="1"
              max="4"
              v-model="parfinData.ccusto_nivel3"
              v-mask-number
              :loading="useConfig.loading"
          />
        </v-col>
      </v-row>
    </div>

    <div class="pt-4 flex justify-end w-100">
      <v-btn variant="flat" color="var(--text-color-laranja)" size="small" class="text-white" @click="enviarParfin">
        Salvar
      </v-btn>
    </div>

  </div>
</template>

<script setup>
import {useConfigParfinStore} from "@/stores/APIs/config";
import {watchEffect, computed, ref} from "vue";
const useConfig = useConfigParfinStore();
const parfin = computed(() => useConfig.config);
const parfinData = ref({ccusto_nivel1: 1, ccusto_nivel2: 1, ccusto_nivel3: 1});
const dadosExistem = ref(false);

const enviarParfin = async () => {
  if (dadosExistem.value) {
    await useConfig.alterarParfin({
      data: [parfinData.value]
    });
  } else {
    await useConfig.cadastrarParfin({
      data: [parfinData.value]
    });
  }
};

watchEffect(() => {
  if (parfin.value.length === 0) {
    useConfig.buscarparfin();
    dadosExistem.value = false;
  } else {
    parfinData.value = {
      ccusto_nivel1: parfin.value?.data[0]?.CCUSTO_NIVEL1,
      ccusto_nivel2: parfin.value?.data[0]?.CCUSTO_NIVEL2,
      ccusto_nivel3: parfin.value?.data[0]?.CCUSTO_NIVEL3
    };
    dadosExistem.value = true;
  }
});

</script>
