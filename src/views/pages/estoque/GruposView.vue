<template>
  <top-all-pages icon="mdi-shape-plus">
    <template #titulo>Grupo de Produtos</template>
    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition :formulario-aberto="formularioAberto" :toggle-formulario="toggleFormulario">
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Novo Grupo' }}</template>
          </botao-expand-transition>
        </v-card-text>

        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px"/>
                {{ editando ? 'Editar Grupo' : 'Novo Grupo' }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef">
                  <v-row dense>
                    <v-col cols="12">
                      <v-switch hide-details label="Produto Ativo" v-model="form.ativo" color="var(--text-color-laranja)" />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Descrição Grupo"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="form.descgrupo"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-text"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-file-input
                          label="Foto do Grupo"
                          variant="outlined"
                          density="compact"
                          accept="image/png, image/jpeg, image/bmp"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="form.foto"
                          chips
                          prepend-inner-icon="mdi-image-outline"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-icon="mdi-"
                          @change="converterBase64"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario" size="small">Cancelar</v-btn>

                <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    @click="salvarGrupo"
                    variant="flat" size="small"
                    class="text-white">
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <v-expand-transition>
          <div v-if="!formularioAberto">
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                    class="ml-3"
                    width="480"
                    v-model="search"
                    label="Pesquisar"
                    append-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
                :headers="headers"
                :items="grupos"
                :loading="loading"
                item-key="id"
                class="background-secondary"
            >

              <template v-slot:[`item.foto`]="{ item }">
                <v-sheet class="bg-transparent" width="50px" height="50px">
                  <v-img
                      class="w-100 h-100" cover
                      :alt="`Imagem do produto - ${item.descgrupo}`"
                      :src="`data:image/*;base64,${item.foto}`"
                  />
                </v-sheet>
              </template>

              <template v-slot:[`item.acoes`]='{ item }'>
                <v-btn
                    icon="mdi-pencil" size="small"
                    color="primary" variant="text"
                    @click="editar(item)"
                />

                <v-btn
                    icon="mdi-delete" size="small"
                    color="error" variant="text"
                    @click="confirmarExclusao(item)"
                />
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon icon="mdi-shape-plus" size="64" class="mb-2 opacity-60"></v-icon>
                  <p class="text-body-1">Nenhum Grupo Encontrado!</p>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-expand-transition>
      </v-card>
    </template>
  </top-all-pages>

</template>

<script setup>
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import {ref, computed, watchEffect, reactive} from "vue";

const themeStore = useThemeStore();
const estoqueStore = useEstoqueStore();

const grupos = computed(() => estoqueStore.grupos);
const loading = computed(() => estoqueStore.loading);

watchEffect(() => {
  if (grupos.value.length === 0) {
    estoqueStore.buscarTodos();
  }
});

// HEADERS DA TABELA
const headers = ref([
  {title: "ID", key: "id", align: "center"},
  {title: "Foto", key: "foto", align: "start"},
  {title: "Descrição", key: "descgrupo", align: "start"},
  {title: "Ativo", key: "ativo", align: "start"},
  {title: "Ações", key: "acoes", align: "center", sortable: false},
]);

// ESTADO DO FORMULÁRIO
const formularioAberto = ref(false);
const editando = ref(false);

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
};

// CAMPOS DO FORMULÁRIO
const validacao = [(v) => !!v || "O campo é obrigatório"];
const search = ref("");
const base64 = ref("");
const formRef = ref(null);

const form = reactive({
  "descgrupo": "",
  "foto": "",
  "ativo": true
})

// FUNÇÕES AUXILIARES

function converterBase64(event) {
  const arquivo = event.target.files[0]
  if (!arquivo) return

  const leitor = new FileReader()
  leitor.onload = () => {
    base64.value = leitor.result // retorna algo como "data:image/png;base64,iVBORw0KG..."
    console.log('Imagem em base64:', base64.value)
  }
  leitor.readAsDataURL(arquivo)
}

const cancelarFormulario = () => {
  Object.assign(form, {
    descgrupo: "",
    foto: "",
    ativo: true
  });
  if (formRef.value) formRef.value.resetValidation()
};

/**
 * CADASTRANDO NOVO GRUPO
 * @param item
 */
const salvarGrupo = () => {
  form.foto = base64.value;
  form.ativo = form.ativo ? 'S' : 'N';

  estoqueStore.cadastrarGrupo({
    data: [
      {
        descgrupo: form.descgrupo,
        foto: form.foto,
        ativo: form.ativo
      }
    ]
  })
};

/**
 * EDITANDO GRUPO
 * @param item
 */
const editar = (item) => {
  editando.value = true
  item.ativo = item.ativo === 'S'
  Object.assign(form, item)
  formularioAberto.value = true
};

const confirmarExclusao = (item) => {
  // Lógica para confirmar exclusão do item
  console.log("Confirmar exclusão do item:", item);
};
</script>