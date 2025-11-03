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
      <v-btn variant="flat" color="var(--text-color-laranja)" size="small" class="text-white" @click="enviarParfin" :disabled="!canSave">
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

// enable/disable Save padrao-paginas
const canSave = computed(() => {
  // Disabled while the store is loading. You can add further validation here.
  return !useConfig.loading;
});

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
  const p = parfin.value;

  // Detect the common "empty" shapes:
  // - initial state: [] (array with length === 0)
  // - API response: { data: [], records: 0 }
  const isEmptyArray = Array.isArray(p) && p.length === 0;
  const isEmptyApiResponse = p && (
    (typeof p.records === 'number' && p.records === 0) ||
    (Array.isArray(p.data) && p.data.length === 0)
  );

  // If we have no value yet (initial state) or the store was initialized as an empty array,
  // fetch the config. But if the API already returned an empty response object
  // (isEmptyApiResponse), that means the GET succeeded but there's no data —
  // treat that as "no existing data" and don't re-fetch repeatedly.
  if (!p || isEmptyArray) {
    useConfig.buscarparfin();
    dadosExistem.value = false;
    return;
  }

  if (isEmptyApiResponse) {
    // API returned {data: [], records: 0} — there's nothing to load, so we stay in "create" mode.
    dadosExistem.value = false;
    return;
  }

  // Normalize the source item: either response.data[0] or the first element
  const sourceItem = p.data ? p.data[0] : (Array.isArray(p) ? p[0] : null);

  if (sourceItem) {
    parfinData.value = {
      ccusto_nivel1: sourceItem.CCUSTO_NIVEL1 ?? parfinData.value.ccusto_nivel1,
      ccusto_nivel2: sourceItem.CCUSTO_NIVEL2 ?? parfinData.value.ccusto_nivel2,
      ccusto_nivel3: sourceItem.CCUSTO_NIVEL3 ?? parfinData.value.ccusto_nivel3
    };
    dadosExistem.value = true;
  } else {
    dadosExistem.value = false;
  }
});

</script>
