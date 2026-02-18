<template>
  <top-all-pages icon="mdi-bank-outline">
    <template #titulo>Contas Corrente</template>
    <template #acoes>
      <v-btn
          icon
          color="var(--text-color-laranja)"
          variant="outlined"
          size="small"
          :disabled="!podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA)"
          @click="modalExportacaoAberto = true"
      >
        <v-icon icon="mdi-printer"></v-icon>
        <v-tooltip activator="parent" location="top">
          {{ !podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA) ? 'Sem permissão' : 'Imprimir / Exportar' }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #section>
      <!-- Lista de Contas -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Nova Conta"
              texto-fechar="Cancelar"
              @toggle="toggleFormulario"
          />

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar Conta' : 'Nova Conta' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row dense>
                      <!-- Número da Conta (Obrigatório) -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.numero_ccorrente"
                            label="Número da Conta *"
                            :rules="[rules.required, rules.number]"
                            type="number"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-credit-card-outline"
                        ></v-text-field>
                      </v-col>

                      <!-- Dígito CC (Obrigatório) -->
                      <v-col cols="12" md="2">
                        <v-text-field
                            v-model="formData.digito_cc"
                            label="Dígito *"
                            :rules="[rules.required]"
                            maxlength="1"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-numeric"
                        ></v-text-field>
                      </v-col>

                      <!-- Titular (Obrigatório) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.titular"
                            label="Titular *"
                            :rules="[rules.required]"
                            maxlength="60"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-account"
                        ></v-text-field>
                      </v-col>

                      <!-- Banco (Obrigatório) -->
                      <v-col cols="12" md="4">
                        <v-autocomplete
                            v-model="bancoSelecionado"
                            :items="financeiroStore.bancos"
                            item-title="descbanco"
                            item-value="id"
                            label="Banco *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-bank"
                            :loading="financeiroStore.loading"
                            hide-no-data
                        >
                          <template v-slot:no-data>
                            <v-list-item>
                              <v-list-item-title>Nenhum banco encontrado</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="12" md="4" class="d-flex align-center">
                        <v-text-field
                            ref="agenciaRef"
                            v-model="descagencia"
                            label="Agência *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field flex-grow-1 required-left-border"
                            prepend-inner-icon="mdi-bank-transfer"
                            :loading="financeiroStore.loading"
                            :disabled="!formData.id_banco"
                        >
                          <template #append-inner>
                            <agenciacc-menu
                                :id-banco="formData.id_banco"
                                @selecionar="selecionarAgencia"
                                @criar-nova="abrirModalAgencia"
                            />
                          </template>
                        </v-text-field>
                      </v-col>

                      <!-- Plano de Conta (Obrigatório) -->
                      <v-col cols="12" md="4">
                        <v-autocomplete
                            v-model="formData.id_reduzido_ctb"
                            :items="financeiroStore.planosConta"
                            item-title="descconta"
                            item-value="id"
                            label="Plano de Conta *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-file-tree"
                            :loading="loadingPlanosConta"
                            hide-no-data
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon icon="mdi-file-tree" size="20" class="mr-2"></v-icon>
                              </template>
                              <template v-slot:title>
                                {{ item.raw.id_classificador }} - {{ item.raw.descconta }}
                              </template>
                              <template v-slot:subtitle>
                              <span class="text-caption opacity-70">
                                Tipo: {{ item.raw.tipo_conta }} | Natureza: {{ item.raw.natureza }} | Nível: {{ item.raw.nivel }}
                              </span>
                              </template>
                            </v-list-item>
                          </template>
                          <template v-slot:selection="{ item }">
                            {{ item.raw.id_classificador }} - {{ item.raw.descconta }}
                          </template>
                          <template v-slot:no-data>
                            <v-list-item>
                              <v-list-item-title>Nenhum plano de conta encontrado</v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>

                      <!-- Limite (Obrigatório) -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.limite"
                            label="Limite *"
                            :rules="[rules.required, rules.decimal]"
                            type="number"
                            step="0.01"
                            min="0"
                            variant="outlined"
                            density="compact"
                            prefix="R$"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-cash"
                        ></v-text-field>
                      </v-col>

                      <!-- Data Abertura (Obrigatório) -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.dtabertura"
                            label="Data Abertura *"
                            :rules="[rules.required]"
                            type="date"
                            variant="outlined"
                            density="compact"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-calendar-plus"
                        ></v-text-field>
                      </v-col>

                      <!-- Data Vencimento do Limite (Opcional) -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.dtvenctolimite"
                            label="Data Vencimento do Limite"
                            type="date"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            prepend-inner-icon="mdi-calendar-clock"
                        ></v-text-field>
                      </v-col>

                      <!-- Gerente (Opcional) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.gerente"
                            label="Gerente"
                            maxlength="60"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-account-tie"
                        ></v-text-field>
                      </v-col>

                      <!-- Telefone (Opcional) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.telefone"
                            label="Telefone"
                            maxlength="15"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-phone"
                            v-mask-phone.br
                        ></v-text-field>
                      </v-col>

                      <!-- Tipo de Chave PIX -->
                      <v-col cols="12" md="4">
                        <v-select
                            v-model="formData.tipochavepix"
                            :items="tiposChavePix"
                            label="Tipo de Chave PIX"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-qrcode"
                        >
                          <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-icon 
                                    :icon="item.value === 0 ? 'mdi-close' : 'mdi-qrcode'" 
                                    :color="item.value === 0 ? 'grey' : 'var(--text-color-laranja)'"
                                ></v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <!-- Chave PIX -->
                      <v-col cols="12" md="8">
                        <v-text-field
                            v-model="formData.chavepix"
                            label="Chave PIX"
                            :rules="[rules.chavePix]"
                            :disabled="formData.tipochavepix === 0"
                            :hint="formData.tipochavepix === 0 ? 'Selecione um tipo de chave PIX primeiro' : getHintChavePix()"
                            persistent-hint
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            :class="formData.tipochavepix > 0 ? 'required-left-border' : ''"
                            prepend-inner-icon="mdi-key"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn
                      color="grey"
                      variant="text"
                      @click="cancelarFormulario"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      :loading="financeiroStore.loading"
                      :disabled="!formValido"
                      @click="salvarConta"
                      variant="flat"
                      class="text-white"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Contas -->
          <!-- Substitua a TabelaPadrao atual por esta versão com slot customizado -->
        <TabelaPadrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="financeiroStore.contas"
            :loading="financeiroStore.loading"
            :search="financeiroStore.search"
            @update:search="(value) => financeiroStore.search = value"
            search-label="Pesquisar Conta"
            item-key="id"
            no-data-icon="mdi-bank-off"
            no-data-text="Nenhuma conta cadastrada"
            delete-dialog-message="Esta ação não pode ser desfeita."
            delete-item-display-field="titular"
            @confirm-delete="excluirConta"
        >
          <!-- Slot customizado para ações -->
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex gap-1">
              <!-- Editar -->
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                title="Editar"
                @click="editarConta(item)"
              ></v-btn>
            
              <!-- Gerenciar Usuários -->
              <v-btn
                icon="mdi-account-multiple"
                size="small"
                color="secondary"
                variant="text"
                title="Gerenciar Usuários"
                :loading="loadingUsuarios"
                :disabled="loadingUsuarios"
                @click="abrirModalUsuarios(item)"
              ></v-btn>
            
              <!-- NOVO: Gerenciar Chaves de API -->
              <v-btn
                icon="mdi-key-variant"
                size="small"
                color="warning"
                variant="text"
                title="Chaves de API do Banco"
                :loading="loadingChavesAPI"
                :disabled="loadingChavesAPI"
                @click="abrirModalChavesAPI(item)"
              ></v-btn>
            
              <!-- Excluir -->
              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                title="Excluir"
                @click="excluirConta(item)"
              ></v-btn>
            </div>
          </template>
        
          <!-- Manter os outros slots de formatação -->
          <template v-slot:[`item.descbanco`]="{ item }">
            {{ item.descbanco || getBancoNome(item.id_banco) }}
          </template>
        
          <template v-slot:[`item.limite`]="{ item }">
            {{ formatarMoeda(item.limite) }}
          </template>
        
          <template v-slot:[`item.dtvenctolimite`]="{ item }">
            {{ item.dtvenctolimite ? formatarData(item.dtvenctolimite) : '-' }}
          </template>
        
          <template v-slot:[`item.dhinc`]="{ item }">
            {{ item.dhinc ? formatarDataHora(item.dhinc) : '-' }}
          </template>
        </TabelaPadrao>
        </v-card-text>
      </v-card>



      <!-- Modal para cadastrar agência -->
      <v-dialog v-model="openAgenciaModal" persistent max-width="600px">
        <v-card class="background-secondary">
          <v-card-title class="text-h6 pa-4">
            Cadastrar Agência
          </v-card-title>

          <v-card-text class="pa-4">
            <v-form>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="agenciaForm.id"
                      label="Número da Agência *"
                      type="text"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="custom-text-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      v-model="agenciaForm.digito_ag"
                      label="Dígito"
                      maxlength="1"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="custom-text-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="agenciaForm.descagencia"
                      label="Descrição *"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="custom-text-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                      v-model="agenciaForm.id_uf"
                      :items="financeiroStore.ufs || []"
                      item-title="SIGLA"
                      item-value="SIGLA"
                      label="UF"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="custom-text-field"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="agenciaForm.contato"
                      label="Contato"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="custom-text-field"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="agenciaForm.telefone"
                      label="Telefone"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="custom-text-field"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="fecharModalAgencia">
              Cancelar
            </v-btn>
            <v-btn
                color="var(--text-color-laranja)"
                :loading="financeiroStore.loading"
                @click="salvarAgencia"
                variant="flat"
                class="text-white"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <!-- Modal de Gerenciamento de Usuários -->
      <v-dialog v-model="openUsuariosModal" persistent max-width="900px">
        <v-card class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-multiple" class="mr-3"></v-icon>
              Gerenciar Usuários - Conta {{ contaParaUsuarios?.numero_ccorrente || contaParaUsuarios?.id || contaParaUsuarios?.ID }}
            </div>
            <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="openUsuariosModal = false"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <!-- Loading interno enquanto carrega dados -->
            <div v-if="loadingUsuarios" class="text-center pa-8">
              <v-progress-circular
                  indeterminate
                  color="var(--text-color-laranja)"
                  size="48"
                  class="mb-4"
              ></v-progress-circular>
              <p class="text-body-1">Carregando usuários...</p>
            </div>

            <!-- Tabela de usuários -->
            <div v-else>
              <v-alert
                  v-if="usuariosList.length === 0"
                  type="info"
                  variant="tonal"
                  class="mb-4"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-information"></v-icon>
                </template>
                Nenhum usuário vinculado a esta conta encontrado.
              </v-alert>
              <v-data-table
                  v-else
                  :headers="headersUsuarios"
                  :items="usuariosList"
                  item-key="ID"
                  class="elevation-1 background-secondary"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
              >
                <template v-slot:[`item.nome`]="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="32" class="mr-3" :color="themeStore.darkMode ? 'grey-darken-3' : 'grey-lighten-2'">
                      <v-icon icon="mdi-account" :color="themeStore.darkMode ? 'grey-lighten-1' : 'grey-darken-2'"></v-icon>
                    </v-avatar>
                    <span>{{ item.nome || `Usuário ${item.ID}` }}</span>
                  </div>
                </template>

                <template v-slot:[`item.email`]="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-email" size="16" class="mr-2 opacity-60"></v-icon>
                    {{ item.email || '-' }}
                  </div>
                </template>

                <template v-slot:[`item.ativo`]="{ item }">
                  <v-chip
                      size="small"
                      :color="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'success' : 'default'"
                      :variant="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'flat' : 'outlined'"
                  >
                    <v-icon
                        :icon="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'mdi-check-circle' : 'mdi-close-circle'"
                        size="16"
                        class="mr-1"
                    ></v-icon>
                    {{ (item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'Ativo' : 'Inativo' }}
                  </v-chip>
                </template>

                <template v-slot:[`item.permissao`]="{ item }">
                  <v-checkbox
                      v-model="userAccessMap[String(item.ID)]"
                      density="compact"
                      hide-details
                      color="var(--text-color-laranja)"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  ></v-checkbox>
                </template>

                <template v-slot:no-data>
                  <div class="pa-8 text-center">
                    <v-icon icon="mdi-account-off" size="64" class="mb-4 opacity-60" :color="themeStore.darkMode ? '#fff' : '#666'"></v-icon>
                    <p class="text-body-1 mb-2">Nenhum usuário disponível</p>
                    <p class="text-body-2 opacity-60">Não há usuários vinculados a esta conta.</p>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
                color="grey"
                variant="text"
                @click="openUsuariosModal = false"
                :disabled="loadingUsuarios"
            >
              Cancelar
            </v-btn>
            <v-btn
                color="var(--text-color-laranja)"
                :loading="financeiroStore.loading"
                :disabled="loadingUsuarios || usuariosList.length === 0"
                @click="salvarUsuariosAcesso"
                variant="flat"
                class="text-white"
            >
              <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
              Salvar Permissões
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

            <!-- Modal de Chaves de API -->
      <v-dialog v-model="openChavesAPIModal" persistent max-width="800px">
        <v-card class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon icon="mdi-key-variant" class="mr-3"></v-icon>
              Chaves de API - Conta {{ contaParaChavesAPI?.numero_ccorrente }}
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="openChavesAPIModal = false"
            ></v-btn>
          </v-card-title>
        
          <v-divider></v-divider>
        
          <v-card-text class="pa-4">
            <v-form ref="formChavesAPIRef">
              <v-row dense>
                <!-- Ambiente -->
                <v-col cols="12">
                  <v-select
                    v-model="chavesAPIForm.tpambiente"
                    :items="[
                      { title: 'Produção', value: 'P' },
                      { title: 'Sandbox (Testes)', value: 'T' }
                    ]"
                    label="Ambiente *"
                    variant="outlined"
                    density="compact"
                    class="custom-text-field required-left-border"
                    prepend-inner-icon="mdi-server"
                  ></v-select>
                </v-col>

                <!-- Alerta de mudança de ambiente -->
                <v-col cols="12" v-if="chavesAPIForm.tpambiente !== previousTpambiente">
                  <v-alert
                    type="warning"
                    variant="tonal"
                    density="compact"
                    prominent
                  >
                    <template #prepend>
                      <v-icon icon="mdi-alert"></v-icon>
                    </template>
                    <div class="text-subtitle-2 font-weight-bold mb-1">Ambiente alterado!</div>
                    <div class="text-body-2">
                      As chaves de API são diferentes para cada ambiente (Produção e Sandbox).
                      Certifique-se de inserir as credenciais corretas para {{ chavesAPIForm.tpambiente === 'P' ? 'Produção' : 'Sandbox (Testes)' }}.
                    </div>
                  </v-alert>
                </v-col>

                <!-- Divider PIX -->
                <v-col cols="12" class="mt-2">
                  <v-divider></v-divider>
                  <div class="text-subtitle-1 font-weight-bold mt-3 mb-2">
                    <v-icon icon="mdi-qrcode" size="small" class="mr-2"></v-icon>
                    Credenciais API PIX
                  </div>
                </v-col>
              
                <!-- Client ID PIX -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="chavesAPIForm.clid_api_pix"
                    label="Client ID (PIX)"
                    variant="outlined"
                    density="compact"
                    class="custom-text-field"
                    prepend-inner-icon="mdi-identifier"
                    hint="ID do cliente para API PIX"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              
                <!-- Client Secret PIX -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="chavesAPIForm.clsecret_api_pix"
                    label="Client Secret (PIX)"
                    type="password"
                    variant="outlined"
                    density="compact"
                    class="custom-text-field"
                    prepend-inner-icon="mdi-lock"
                    hint="Senha secreta para API PIX"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <!-- Divider Cobrança -->
                <v-col cols="12" class="mt-4">
                  <v-divider></v-divider>
                  <div class="text-subtitle-1 font-weight-bold mt-3 mb-2">
                    <v-icon icon="mdi-cash-multiple" size="small" class="mr-2"></v-icon>
                    Credenciais API Cobrança
                  </div>
                </v-col>
              
                <!-- Client ID Cobrança -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="chavesAPIForm.clid_api_cob"
                    label="Client ID (Cobrança)"
                    variant="outlined"
                    density="compact"
                    class="custom-text-field"
                    prepend-inner-icon="mdi-identifier"
                    hint="ID do cliente para API Cobrança"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              
                <!-- Client Secret Cobrança -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="chavesAPIForm.clsecret_api_cob"
                    label="Client Secret (Cobrança)"
                    type="password"
                    variant="outlined"
                    density="compact"
                    class="custom-text-field"
                    prepend-inner-icon="mdi-lock"
                    hint="Senha secreta para API Cobrança"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <!-- Divider Webhook -->
                <v-col cols="12" class="mt-4">
                  <v-divider></v-divider>
                  <div class="text-subtitle-1 font-weight-bold mt-3 mb-2">
                    <v-icon icon="mdi-webhook" size="small" class="mr-2"></v-icon>
                    Configurações Gerais
                  </div>
                </v-col>
              
                <!-- Webhook URL -->
                <v-col cols="12">
                  <v-text-field
                    v-model="chavesAPIForm.webhook_url"
                    label="Webhook URL"
                    variant="outlined"
                    density="compact"
                    class="custom-text-field"
                    prepend-inner-icon="mdi-webhook"
                    hint="URL para receber notificações do banco (PIX e Cobrança)"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              
                <!-- Informações adicionais -->
                <v-col cols="12" class="mt-2">
                  <v-alert
                    type="info"
                    variant="tonal"
                    density="compact"
                  >
                    <template #prepend>
                      <v-icon icon="mdi-information"></v-icon>
                    </template>
                    As chaves são armazenadas de forma criptografada. Consulte a documentação do seu banco para obter as credenciais corretas.
                  </v-alert>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        
          <v-divider></v-divider>
        
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="text"
              @click="openChavesAPIModal = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="var(--text-color-laranja)"
              :loading="financeiroStore.loading"
              @click="salvarChavesAPI"
              variant="flat"
              class="text-white"
            >
              <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
              Salvar Chaves
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="3000"
      >
        {{ snackbar.message }}
      </v-snackbar>

      <!-- Modal de Exportação -->
      <ExportacaoModal
          v-model="modalExportacaoAberto"
          :dados="contas"
          :filtros="{}"
          nome-relatorio="Contas Corrente"
          @exportar-pdf="() => {}"
          @exportar-csv="() => {}"
          @exportar-excel="() => {}"
          @imprimir="() => {}"
      />

      <!-- Modal de Preview do PDF -->
      <PdfPreviewModal
          v-model="modalPreviewPDF"
          :html-content="previewHTMLContent"
          :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Contas_Corrente'"
      />

      <!-- Modal de Acesso Negado -->
      <AcessoNegadoModal
          v-model="acessoNegadoModal"
          :nome-programa="'Cadastro de Conta Corrente'"
          :tipo-acesso="tipoAcessoNegado"
      />
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useThemeStore } from '@/stores/config-temas/theme'
import { usePermissoes } from '@/utils/usePermissoes'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import AgenciaccMenu from "@/components/base/menu/financeiro/AgenciaccMenu.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ID do programa desta tela
const ID_PROGRAMA = 'FFIN001C'

const themeStore = useThemeStore();

// Store
const financeiroStore = useFinanceiroStore()
// eslint-disable-next-line no-unused-vars
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
const acessoNegadoModal = ref(false)
const tipoAcessoNegado = ref('')

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
// refs for agency modal/select
const agenciaRef = ref(null)
const openAgenciaModal = ref(false)
// banco selecionado (objeto) to improve typing UX
const bancoSelecionado = ref(null)
const loadingPlanosConta = ref(false)

// Modais de exportação
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// form for creating agency in modal
const agenciaForm = reactive({
  id: '',
  digito_ag: '',
  descagencia: '',
  id_banco: '',
  id_uf: '',
  contato: '',
  telefone: ''
})

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Headers da tabela (usar chaves retornadas pela API THorse)
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Número da Conta', key: 'numero_ccorrente', sortable: true },
  { title: 'Dígito', key: 'digito_cc', sortable: true },
  { title: 'Titular', key: 'titular', sortable: true },
  { title: 'Banco', key: 'descbanco', sortable: true },
  { title: 'Limite', key: 'limite', sortable: true },
  { title: 'Venc. Limite', key: 'dtvenctolimite', sortable: true },
  { title: 'Abertura', key: 'dtabertura', sortable: true },
  { title: 'Cadastro', key: 'dhinc', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Headers do modal de usuários
const headersUsuarios = [
  { title: 'ID', key: 'ID', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Permissão', key: 'permissao', sortable: false }
]

// Dados do formulário
const formData = reactive({
  id_empresa: 1, // Será obtido do contexto/auth futuramente
  numero_ccorrente: '',
  digito_cc: '',
  titular: '', // Nome correto do campo titular
  id_banco: '',
  id_agencia: '',
  id_reduzido_ctb: null, // Plano de Conta
  limite: '0',
  dtabertura: '',
  dtvenctolimite: '', // Nome correto do campo vencimento do limite
  gerente: '',
  telefone: '',
  tipochavepix: 0, // 0=Nenhuma, 1=Aleatoria, 2=Celular, 3=CNPJ, 4=CPF, 5=Email
  chavepix: ''
})

// Opções de tipo de chave PIX
const tiposChavePix = [
  { title: 'Nenhuma', value: 0 },
  { title: 'Aleatória', value: 1 },
  { title: 'Celular', value: 2 },
  { title: 'CNPJ', value: 3 },
  { title: 'CPF', value: 4 },
  { title: 'Email', value: 5 }
]

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  number: (value) => /^\d+$/.test(value) || 'Deve ser um número válido',
  decimal: (value) => /^\d+(\.\d{1,2})?$/.test(value) || 'Deve ser um valor decimal válido',
  chavePix: (value) => {
    // Se o tipo de chave PIX não for "Nenhuma" (0), a chave é obrigatória
    if (formData.tipochavepix > 0) {
      return !!value || 'Chave PIX obrigatória quando tipo está selecionado'
    }
    return true
  }
}

// Função para cadastrar chaves de API do banco
const openChavesAPIModal = ref(false)
const contaParaChavesAPI = ref(null)
const loadingChavesAPI = ref(false)

const chavesAPIForm = reactive({
  clid_api_pix: '',
  clsecret_api_pix: '',
  clid_api_cob: '',
  clsecret_api_cob: '',
  tpambiente: 'P',
  webhook_url: ''
})

const previousTpambiente = ref('P')

// Função para abrir modal
const abrirModalChavesAPI = async (conta) => {
  try {
    loadingChavesAPI.value = true
    contaParaChavesAPI.value = conta
    const contaId = conta?.id ?? conta?.ID

    // Buscar chaves existentes via GET /ccorrenteapi/:idccorrente
    const chaves = await financeiroStore.buscarChavesAPI(contaId)
    
    console.log('Resposta do GET chaves:', chaves)
    
    if (chaves) {
      Object.assign(chavesAPIForm, {
        clid_api_pix: chaves.clid_api_pix || '',
        clsecret_api_pix: chaves.clsecret_api_pix || '',
        clid_api_cob: chaves.clid_api_cob || '',
        clsecret_api_cob: chaves.clsecret_api_cob || '',
        tpambiente: chaves.tpambiente || 'P',
        webhook_url: chaves.webhook_url || ''
      })
      previousTpambiente.value = chaves.tpambiente || 'P'
    } else {
      // Resetar form se não houver chaves
      Object.assign(chavesAPIForm, {
        clid_api_pix: '',
        clsecret_api_pix: '',
        clid_api_cob: '',
        clsecret_api_cob: '',
        tpambiente: 'P',
        webhook_url: ''
      })
      previousTpambiente.value = 'P'
    }

    loadingChavesAPI.value = false
    openChavesAPIModal.value = true
    
  } catch (error) {
    loadingChavesAPI.value = false
    mostrarSnackbar('Erro ao carregar chaves de API: ' + error.message, 'error')
  }
}

// Função para salvar chaves
const salvarChavesAPI = async () => {
  try {
    const contaId = contaParaChavesAPI.value?.id ?? contaParaChavesAPI.value?.ID
    
    if (!contaId) {
      mostrarSnackbar('ID da conta não encontrado', 'error')
      return
    }
    
    console.log('chavesAPIForm:', chavesAPIForm)
    console.log('tpambiente:', chavesAPIForm.tpambiente)
    
    const payload = {
      data: [{
        id_ccorrente: contaId,
        clid_api_pix: chavesAPIForm.clid_api_pix,
        clsecret_api_pix: chavesAPIForm.clsecret_api_pix,
        clid_api_cob: chavesAPIForm.clid_api_cob,
        clsecret_api_cob: chavesAPIForm.clsecret_api_cob,
        tpambiente: chavesAPIForm.tpambiente
      }]
    }
    
    console.log('PAYLOAD FINAL:', JSON.stringify(payload, null, 2))

    await financeiroStore.salvarChavesAPI(contaId, payload)
    
    mostrarSnackbar('Chaves de API salvas com sucesso!', 'success')
    openChavesAPIModal.value = false
    contaParaChavesAPI.value = null
    
  } catch (error) {
    mostrarSnackbar('Erro ao salvar chaves de API: ' + error.message, 'error')
  }
}

// Métodos
const toggleFormulario = () => {
  // Verificar permissão para incluir
  if (!formularioAberto.value && !podeIncluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'incluir'
    acessoNegadoModal.value = true
    return
  }

  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    abrirFormulario()
  }
}

// Quando o banco for alterado, resetar agência e focar no select de agência
const onBancoChange = async (val) => {
  // val vem como primitivo (ID) porque item-value="id" no autocomplete
  // Se for um objeto (por algum motivo), extrai o ID
  const id = normalizeId(val)

  // Garantir que id_banco receba apenas o valor primitivo
  formData.id_banco = id
  agenciaForm.id_banco = id
  formData.id_agencia = ''

  console.log('Banco selecionado - ID:', id, 'Valor original:', val) // Debug

  // Buscar agências do banco selecionado
  if (id) {
    try {
      await financeiroStore.buscarAgencias()
    } catch (error) {
      console.error('Erro ao buscar agências:', error)
      mostrarSnackbar('Erro ao carregar agências', 'error')
    }
  }
  
  // abrir/ativar o select de agencias e focar
  await nextTick()
  if (id) {
    agenciaRef.value?.focus && agenciaRef.value.focus()
  }
}

// watch bancoSelecionado (autocomplete) to react to user selection/typing
watch(bancoSelecionado, (val) => {
  onBancoChange(val)
})

const abrirModalAgencia = () => {
  // Debug
  console.log('Abrindo modal - formData.id_banco:', formData.id_banco)
  console.log('Abrindo modal - bancoSelecionado:', bancoSelecionado.value)

  // Normalizar id_banco para garantir que é um valor primitivo
  const idBanco = normalizeId(formData.id_banco)

  console.log('ID normalizado:', idBanco)

  if (!idBanco) {
    mostrarSnackbar('Selecione um banco primeiro', 'warning')
    return
  }

  agenciaForm.id_banco = idBanco
  console.log('Modal aberto com id_banco:', agenciaForm.id_banco)
  openAgenciaModal.value = true
}

const fecharModalAgencia = () => {
  openAgenciaModal.value = false
  // Limpar formulário da agência
  Object.assign(agenciaForm, {
    id: '',
    digito_ag: '',
    descagencia: '',
    id_banco: '',
    id_uf: '',
    contato: '',
    telefone: ''
  })
}

// === Modal de Controle de Usuários (Acesso a Contas) ===
const openUsuariosModal = ref(false)
const contaParaUsuarios = ref(null)
const usuariosList = ref([]) // será carregado se houver endpoint
const userAccessMap = reactive({}) // { [userId]: boolean }
const loadingUsuarios = ref(false) // Loading state para o modal

// Nota: não usamos mais o endpoint /usuario para listar usuários do gerenciador.
// A lista agora vem exclusivamente de /ccorrenteusu/:id via `buscarUsuariosPorConta`.

const abrirModalUsuarios = async (conta) => {
  try {
    // Iniciar loading
    loadingUsuarios.value = true
    contaParaUsuarios.value = conta
    const contaId = conta?.id ?? conta?.ID

    // Limpar dados anteriores
    usuariosList.value = []
    Object.keys(userAccessMap).forEach(key => delete userAccessMap[key])

    // Buscar usuários vinculados ANTES de abrir o modal
    const vinculados = await financeiroStore.buscarUsuariosPorConta(contaId)
    
    // Se os dados vêm em uma estrutura diferente, vamos normalizar
    let dadosNormalizados = vinculados
    if (vinculados && vinculados.data && Array.isArray(vinculados.data)) {
      dadosNormalizados = vinculados.data
    } else if (vinculados && !Array.isArray(vinculados) && typeof vinculados === 'object') {
      dadosNormalizados = [vinculados]
    }
    
    if (Array.isArray(dadosNormalizados) && dadosNormalizados.length > 0) {
      usuariosList.value = dadosNormalizados.map(v => ({
        ID: v.data.id ?? v.ID ?? v.id_usuario ?? '',
        nome: v.data.nome ?? v.NOME ?? '',
        email: v.data.email ?? v.EMAIL ?? '',
        ativo: v.data.ativo ?? v.ATIVO ?? 'S'
      }))

      // Inicializar permissões
      usuariosList.value.forEach(usuario => {
        if (usuario.ID) {
          const isActive = usuario.ativo === 'S' || usuario.ativo === 's' || usuario.ativo === true
          userAccessMap[String(usuario.ID)] = isActive
        }
      })
    } else {
      usuariosList.value = []
    }

    // Finalizar loading e abrir modal APENAS após carregar os dados
    loadingUsuarios.value = false
    openUsuariosModal.value = true
    
  } catch (error) {
    loadingUsuarios.value = false
    mostrarSnackbar('Erro ao carregar usuários: ' + error.message, 'error')
  }
}

const salvarUsuariosAcesso = async () => {
  try {
    const contaId = contaParaUsuarios.value?.id ?? contaParaUsuarios.value?.ID
    
    if (!contaId) {
      mostrarSnackbar('ID da conta não encontrado', 'error')
      return
    }

    const usersPayload = usuariosList.value
      .filter(u => u.ID)
      .map(u => ({
        id: u.ID,
        acesso: !!userAccessMap[String(u.ID)]
      }))

    const payload = {
      contaId,
      users: usersPayload
    }

    await financeiroStore.atualizarAcessoConta(payload)
    
    mostrarSnackbar('Permissões atualizadas com sucesso!', 'success')
    openUsuariosModal.value = false
    
    // Limpar dados do modal
    usuariosList.value = []
    Object.keys(userAccessMap).forEach(key => delete userAccessMap[key])
    contaParaUsuarios.value = null
    
  } catch (error) {
    mostrarSnackbar('Erro ao salvar permissões: ' + error.message, 'error')
  }
}

const salvarAgencia = async () => {
  if (!agenciaForm.id || !agenciaForm.descagencia || !agenciaForm.id_banco) {
    mostrarSnackbar('Preencha ID, descrição e o banco da agência', 'error')
    return
  }
  
  try {
    const payload = {
      id: agenciaForm.id,
      digito_ag: agenciaForm.digito_ag,
      descagencia: agenciaForm.descagencia,
      id_banco: agenciaForm.id_banco,
      id_uf: agenciaForm.id_uf,
      contato: agenciaForm.contato,
      telefone: agenciaForm.telefone
    }
    
    await financeiroStore.criarAgencia(payload)
    await financeiroStore.buscarAgencias()
    
    formData.id_agencia = agenciaForm.id
    mostrarSnackbar('Agência criada com sucesso', 'success')
    fecharModalAgencia()
  } catch (error) {
    mostrarSnackbar('Erro ao criar agência: ' + error.message, 'error')
  }
}

const descagencia = ref('');

const selecionarAgencia = (agencia) => {
  formData.id_agencia = agencia.ID
  descagencia.value = agencia.DISPLAY_NAME || agencia.DESCRICAO || ''
}

const getHintChavePix = () => {
  const hints = {
    1: 'Chave aleatória gerada pelo banco (36 caracteres)',
    2: 'Formato: (11) 91234-5678',
    3: 'Formato: 12.345.678/0001-90',
    4: 'Formato: 123.456.789-00',
    5: 'Formato: exemplo@email.com'
  }
  return hints[formData.tipochavepix] || ''
}

const abrirFormulario = () => {
  editando.value = false
  resetarForm()
  formularioAberto.value = true
}

const editarConta = async (conta) => {
  // Verificar permissão para alterar
  if (!podeAlterar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'alterar'
    acessoNegadoModal.value = true
    return
  }

  editando.value = true
  
  try {
    // Buscar dados completos da conta via API
    const contaId = conta?.id ?? conta?.ID
    const contaCompleta = await financeiroStore.buscarContaPorId(contaId)
    
    // Se retornou dados, usar eles; senão, usar os dados da tabela
    const dadosConta = contaCompleta?.data?.[0] ?? contaCompleta?.[0] ?? contaCompleta ?? conta
    
    // Copiar os campos do registro para o formData
    Object.assign(formData, dadosConta)
  } catch (error) {
    console.warn('[ContaCorrente] Erro ao buscar conta específica, usando dados da tabela:', error)
    // Em caso de erro, usar os dados que já temos da tabela
    Object.assign(formData, conta)
  }

  // Formatar data para input datetime-local
  if (formData.dtabertura) {
    formData.dtabertura = new Date(formData.dtabertura).toISOString().slice(0, 16)
  }

  // Normalizar possíveis objetos de id que venham no objeto 'conta'
  formData.id_banco = normalizeId(formData.id_banco)
  formData.id_agencia = normalizeId(formData.id_agencia)

  // Buscar dados completos do banco e agência pelo ID para preencher lacunas
  try {
    // Buscar banco por ID e popular bancoSelecionado
    if (formData.id_banco) {
      const bancoResp = await financeiroStore.buscarBancoPorId(formData.id_banco)
      // Normalizar possíveis formatos retornados pelo store
      const bancoObj = bancoResp && bancoResp.data && Array.isArray(bancoResp.data) ? bancoResp.data[0] : (Array.isArray(bancoResp) ? bancoResp[0] : bancoResp)

      // Preferir o item já presente no cache (tem os campos usados pelo autocomplete)
      let bancoCached = null
      const bancoIdStr = String(bancoObj?.ID ?? bancoObj?.id ?? bancoObj?.ID_BANCO ?? bancoObj?.id_banco ?? formData.id_banco)
      if (Array.isArray(financeiroStore.bancos)) {
        bancoCached = financeiroStore.bancos.find(b => String(b.ID) === bancoIdStr || String(b.id) === bancoIdStr)
      }

      if (bancoCached) {
        bancoSelecionado.value = bancoCached
      } else if (bancoObj) {
        // Normalizar para a shape esperada pelo v-autocomplete (ID, DESCBANCO)
        const normalized = {
          ID: bancoObj.ID ?? bancoObj.id ?? bancoObj.ID_BANCO ?? bancoObj.id_banco,
          DESCBANCO: bancoObj.DESCBANCO ?? bancoObj.descbanco ?? bancoObj.DESCRICAO ?? bancoObj.DESCR
        }
        bancoSelecionado.value = normalized
      } else {
        bancoSelecionado.value = financeiroStore.bancos.find(b => String(b.ID) === String(formData.id_banco)) || null
      }
    }

    // Buscar agência por ID (rota agora exige id_banco) e garantir que esteja na lista de agencias para o combobox
    if (formData.id_agencia) {
      const agenciaResp = await financeiroStore.buscarAgenciaPorId(formData.id_banco, formData.id_agencia)
      const agenciaObj = agenciaResp && agenciaResp.data && Array.isArray(agenciaResp.data) ? agenciaResp.data[0] : (Array.isArray(agenciaResp) ? agenciaResp[0] : agenciaResp)
      if (agenciaObj) {
        // Se a agência não estiver no store.agencias, adicioná-la ao cache local
        const exists = Array.isArray(financeiroStore.agencias) && financeiroStore.agencias.some(a => String(a.ID ?? a.id ?? a.id_agencia) === String(agenciaObj.ID ?? agenciaObj.id ?? agenciaObj.id_agencia))
        if (!exists) {
          // Evita recarregar toda a lista via /agencia — inserimos o item específico no cache
          financeiroStore.agencias = Array.isArray(financeiroStore.agencias)
            ? [...financeiroStore.agencias, agenciaObj]
            : [agenciaObj]
        }
        // Garantir que o formData tenha apenas o id primitivo
        formData.id_agencia = agenciaObj.ID ?? agenciaObj.id ?? agenciaObj.id_agencia ?? formData.id_agencia
      }
    }
  } catch (e) {
    // Não bloquear edição se as buscas falharem — usar o que já temos
  }

  formularioAberto.value = true
}

// Normaliza possíveis objetos de id para primitives (ID, id, etc.)
const normalizeId = (val) => {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'object') {
    // Tenta extrair ID de um objeto
    const id = val.ID ?? val.id ?? val.id_banco ?? val.ID_BANCO ?? val.id_agencia ?? val.ID_AGENCIA ?? null
    return id
  }
  // Se já é primitivo (string/number), retornar como está
  return val
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(formData, {
    id_empresa: 1,
    id: '',
    numero_ccorrente: '',
    digito_cc: '',
    titular: '', // Nome correto
    id_banco: '',
    id_agencia: '',
    id_reduzido_ctb: null,
    limite: '0',
    dtabertura: '',
    dtvenctolimite: '', // Nome correto
    gerente: '',
    telefone: '',
    tipochavepix: 0,
    chavepix: ''
  })
  bancoSelecionado.value = null
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarConta = async () => {
  try {
    // Criar uma cópia para normalizar IDs antes de enviar
    const payload = { ...formData }
    // Normalizar id_banco e id_agencia caso estejam como objetos
    payload.id_banco = normalizeId(payload.id_banco)
    payload.id_agencia = normalizeId(payload.id_agencia)

    if (editando.value) {
      const recordId = payload.id ?? payload.id_ccorrente ?? payload.numero_ccorrente
      await financeiroStore.atualizarConta(recordId, payload)
      mostrarSnackbar('Conta atualizada com sucesso!', 'success')
    } else {
      await financeiroStore.criarConta(payload)
      mostrarSnackbar('Conta criada com sucesso!', 'success')
    }
    cancelarFormulario()
  } catch (error) {
    mostrarSnackbar('Erro ao salvar conta: ' + error.message, 'error')
  }
}

const excluirConta = async (conta) => {
  // Verificar permissão para excluir
  if (!podeExcluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'excluir'
    acessoNegadoModal.value = true
    return
  }

  try {
    const contaId = conta?.id
    await financeiroStore.deletarConta(contaId)
    mostrarSnackbar('Conta excluída com sucesso!', 'success')
  } catch (error) {
    mostrarSnackbar('Erro ao excluir conta: ' + error.message, 'error')
  }
}

const carregarPlanosConta = async () => {
  loadingPlanosConta.value = true
  try {
    await financeiroStore.buscarPlanosConta()
  } catch (error) {
    console.error('Erro ao carregar planos de conta:', error)
  } finally {
    loadingPlanosConta.value = false
  }
}

const mostrarSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Formatadores
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0)
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const formatarDataHora = (data) => {
  return new Date(data).toLocaleString('pt-BR')
}

// Métodos para obter nomes do banco e agência
const getBancoNome = (idBanco) => {
  const banco = financeiroStore.bancos.find(b => String(b.ID) === String(idBanco) || String(b.id) === String(idBanco))
  if (!banco) return `ID: ${idBanco}`
  return banco.DESCBANCO ?? banco.descbanco ?? banco.DESCRICAO ?? banco.DESCR ?? `ID: ${idBanco}`
}

// Lifecycle
onMounted(async () => {
  // Verificar se o usuário tem permissão para visualizar este programa
  if (!podeVisualizar(ID_PROGRAMA)) {
    console.warn('[ContaCorrenteView] Usuário sem permissão para visualizar')
    tipoAcessoNegado.value = 'visualizar'
    acessoNegadoModal.value = true
    return
  }

  try {
    // Carregar dados em paralelo para melhor performance
    await Promise.all([
      financeiroStore.buscarContas(),
      financeiroStore.buscarBancos(),
      financeiroStore.buscarAgencias(),
      financeiroStore.buscarUFs(),
      carregarPlanosConta()
    ])
  } catch (error) {
    mostrarSnackbar('Erro ao carregar dados: ' + error.message, 'error')
  }
})
</script>


