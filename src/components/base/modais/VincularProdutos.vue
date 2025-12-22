<template>
  <v-dialog v-model="modalItemAbertoLocal" max-width="750px">
    <v-card width="750px" color="var(--bg-card)">

      <!-- Cabeçalho -->
      <v-card-title class="pa-0">
        <div class="flex items-center justify-between bg-orange-500 text-white pa-3">
          <p class="ml-2 text-lg font-semibold">
            {{tabs === 'vincular' ? 'Produto Similar' : 'Novo Produto'}}
          </p>
          <v-btn variant="text" icon="mdi-close" @click="fecharModal" />
        </div>
      </v-card-title>

      <!-- Tabs -->
      <v-tabs v-model="tabs" class="ml-2">
        <v-tab value="vincular"><p class="text-none text-sm">Vincular Produto</p></v-tab>
        <v-tab value="adicionar"><p class="text-none text-sm">Adicionar Produto</p></v-tab>
      </v-tabs>

      <!-- Cabeçalho de informações -->
      <div class="background-primary pa-4 mt-4">
        <p v-if="tabs === 'vincular'" class="text-sm">Deseja vincular esse item como um produto similar?</p>
        <p v-else class="text-sm">Deseja cadastrar esse item como produto?</p>
        <p class="mt-2">
          <v-icon icon="mdi-tag-multiple" class="mr-2" />
          <strong>Produto: </strong> {{ props.itemSelecionado.descproduto }}
        </p>
      </div>

      <v-tabs-window v-model="tabs">

        <!-- ============================ -->
        <!-- 👉 ABA VINCULAR PRODUTO -->
        <!-- ============================ -->
        <v-tabs-window-item value="vincular">
          <v-card-item class="mt-2">

            <!-- Botão Confirmar Vinculação -->
            <div v-if="produtoSelecionadoTemp" class="flex justify-end position-absolute right-0 mt-3 mr-4">
              <v-btn color="green" variant="flat" size="small" prepend-icon="mdi-check" @click="confirmarVinculo">
                Vincular neste produto
              </v-btn>
            </div>

            <v-data-table
                :items="props.todosProdutos"
                item-key="id"
                items-per-page="3"
                class="elevation-1 background-secondary cursor-pointer"
                return-object
                select-strategy="single"
                show-select
                v-model="selecionado"
            />
          </v-card-item>
        </v-tabs-window-item>

        <!-- ============================ -->
        <!-- 👉 ABA ADICIONAR PRODUTO -->
        <!-- ============================ -->
        <v-tabs-window-item value="adicionar">

          <v-card-item class="p-4">

            <v-form ref="formRef">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Descrição do Produto"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.descproduto"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Aplicação"
                      item-title="title"
                      item-value="value"
                      :items="[
                        { title: 'Produto para comercialização - venda', value: 'V' },
                        { title: 'Produto para consumo', value: 'C' },
                        { title: 'Matéria-Prima', value: 'M' },
                        { title: 'Imobilizado', value: 'I' },
                      ]"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.aplicacao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Tipo"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.tipo"
                      item-title="title"
                      item-value="value"
                      :items="[
                        { title: 'Produto', value: 'P' },
                        { title: 'Serviço', value: 'S' },
                      ]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código GTIN"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.codigo_gtin"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código SKU"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.codigo_sku"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código Fabricação"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.codigo_fab"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código Referência"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.codigo_ref"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Grupo"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descgrupo"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione o Grupo"
                  >
                    <template #append-inner>
                      <grupos-menu @selecionar="selecionarGrupo" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      density="compact"
                      variant="outlined"
                      :label="`Subgrupo ${novoProduto.id_grupo ? '' : '(Selecione o Grupo primeiro)'}`"
                      item-title="descsubgrupo"
                      item-value="id"
                      :items="subgrupos"
                      hide-details="auto"
                      v-model="novoProduto.id_subgrupo"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      :readonly="!novoProduto.id_grupo"
                  >
                    <template #no-data><p class="pa-3">Nenhum Subgrupo cadastrado!</p></template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Classe"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descclasse"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a classe"
                  >
                    <template #append-inner>
                      <classes-menu @selecionar="selecionarClasse" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="NCM"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.id_ncm"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione o NCM"
                  >
                    <template #append-inner>
                      <ncm-menu @selecionar="selecionarNcm" />
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Marca"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descmarca"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a marca"
                  >
                    <template #append-inner>
                      <marcas-menu @selecionar="selecionarMarca" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Garantia"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descgarantia"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a garantia"
                  >
                    <template #append-inner>
                      <garantia-menu @selecionar="selecionarGarantia" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Medida"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descmedida"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a medida"
                  >
                    <template #append-inner>
                      <medidas-menu @selecionar="selecionarMedida" />
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                      density="compact"
                      variant="outlined"
                      label="Descrição do Produto"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="novoProduto.observacao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      rows="2"
                  />
                </v-col>

                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Balança? ${novoProduto.utiliza_balanca ? 'Sim' : 'Não'}`"
                      v-model="novoProduto.utiliza_balanca"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Grade? ${novoProduto.utiliza_grade ? 'Sim' : 'Não'}`"
                      v-model="novoProduto.utiliza_grade"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza N. Série? ${novoProduto.utiliza_nrserie ? 'Sim' : 'Não'}`"
                      v-model="novoProduto.utiliza_nrserie"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Lote? ${novoProduto.utiliza_lote ? 'Sim' : 'Não'}`"
                      v-model="novoProduto.utiliza_lote"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Em Promoção? ${novoProduto.em_promocao ? 'Sim' : 'Não'}`"
                      v-model="novoProduto.em_promocao"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
              </v-row>
            </v-form>

            <div class="flex justify-end mt-4">
              <v-btn color="var(--text-color-laranja)" size="small" class="text-white" @click="adicionarProduto">
                Adicionar Produto
              </v-btn>
            </div>

          </v-card-item>
        </v-tabs-window-item>
      </v-tabs-window>

    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref, computed, defineProps, defineEmits, watch, reactive} from "vue"
import MarcasMenu from "@/components/base/menu/MarcasMenu.vue";
import GarantiaMenu from "@/components/base/menu/GarantiaMenu.vue";
import ClassesMenu from "@/components/base/menu/ClassesMenu.vue";
import MedidasMenu from "@/components/base/menu/MedidasMenu.vue";
import GruposMenu from "@/components/base/menu/GruposMenu.vue";
import NcmMenu from "@/components/base/menu/NcmMenu.vue";
import {useThemeStore} from "@/stores/config-temas/theme";

const themeStore = useThemeStore();

const props = defineProps({
  modalItemAberto: Boolean,
  itemSelecionado: { type: Object, default: () => ({}) },
  todosProdutos: { type: Array, default: () => [] },
})

const emit = defineEmits(["update:modalItemAberto", "vincular", "adicionar"])

const tabs = ref("vincular")
const produtoSelecionadoTemp = ref(null)

const novoProduto = reactive({
  "descproduto": "",
  "aplicacao": "",
  "tipo": "",
  "codigo_gtin": "",
  "codigo_sku": "",
  "codigo_fab": "",
  "codigo_ref": "",
  "id_grupo": null,
  "id_subgrupo": null,
  "id_marca": null,
  "id_medida": null,
  "id_classe": null,
  "id_garantia": null,
  "utiliza_balanca": "",
  "utiliza_grade": "",
  "utiliza_nrserie": "",
  "utiliza_lote": "",
  "id_ncm": "",
  "em_promocao": "",
  "observacao": "",
  "ativo": "S"
})

// Mirror do modal (v-model)
const modalItemAbertoLocal = computed({
  get: () => props.modalItemAberto,
  set: (v) => emit("update:modalItemAberto", v)
})

const fecharModal = () => emit("update:modalItemAberto", false)

const selecionado = ref(null);

watch(selecionado, (val) => {
  produtoSelecionadoTemp.value = val?.[0] ?? null
  console.log("Produto Selecionado Temporariamente:", produtoSelecionadoTemp.value)
})


const confirmarVinculo = () => {
  if (!produtoSelecionadoTemp.value) return

  emit("vincular", {
    item: props.itemSelecionado,
    produto: produtoSelecionadoTemp.value
  })

  produtoSelecionadoTemp.value = null
  fecharModal()
}

const adicionarProduto = () => {
  emit("adicionar", { ...novoProduto })

}
</script>

<style scoped>
.bg-secondary {
  background-color: var(--text-color-laranja);
}

/* Linha selecionada */
.linha-selecionada {
  background-color: rgba(255, 165, 0, 0.25) !important; /* Laranja suave */
  font-weight: 600;
}
</style>