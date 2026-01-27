<template>
  <top-all-pages icon="mdi-certificate">
    <template #titulo>Certificados</template>
    <template #section>
      <v-container class="pa-6 max-w-[80%] background-card rounded-md shadow">
        <!-- Botão de extrair -->
        <div class="flex justify-between mt-2 mb-6">
          <h2 class="text-xl font-semibold mb-6">Importar Certificado</h2>
          <v-btn color="var(--text-color-laranja)" size="small" class="text-white" variant="flat" @click="extrairCertificado">
            Extrair Chave/Certificado
          </v-btn>
        </div>

        <v-row class="align-end">
          <v-col cols="12" sm="8">
            <!-- Código do certificado -->
            <v-text-field
                v-model="codigoCertificado"
                label="Código do certificado *"
                variant="outlined"
                density="compact"
                class="required-left-border mb-4"
                hide-details
                readonly
            />
          </v-col>

          <v-col cols="6" sm="2">
            <v-radio-group v-model="modelo" inline label="Modelo" hide-details>
              <v-radio label="A1" value="A1"/>
              <v-radio label="A3" value="A3"/>
            </v-radio-group>
          </v-col>

          <v-col cols="6" sm="2">
            <v-radio-group v-model="situacao" inline label="Situação" hide-details>
              <v-radio label="Ativo" value="ativo"/>
              <v-radio label="Inativo" value="inativo"/>
            </v-radio-group>
          </v-col>

          <v-col cols="12" sm="8">
            <!-- Arquivo PFX -->
            <v-file-input
                v-model="arquivoPfx"
                label="Arquivo PFX"
                accept=".pfx"
                variant="outlined"
                class="required-left-border"
                prepend-icon="mdi-file-certificate"
            />

          </v-col>

          <v-col cols="12" sm="4">
            <!-- Senha -->
            <v-text-field
                v-model="senha"
                label="Senha *"
                type="password"
                class="required-left-border"
                variant="outlined"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
                v-model="validoApos"
                label="Válido a partir de *"
                type="date"
                variant="outlined"
                class="required-left-border"
                density="compact"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
                v-model="validoAte"
                label="Válido até *"
                type="date"
                class="required-left-border"
                variant="outlined"
                density="compact"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
                v-model="alertaDias"
                type="number"
                variant="outlined"
                class="required-left-border"
                density="compact"
                label="Alerta de expiração (dias) *"
            />
          </v-col>
        </v-row>

        <!-- PREVIEW DO ARQUIVO -->
        <div v-if="arquivoPfx" class="pa-4 border rounded bg-gray-50 mb-6">
          <p><strong>Nome:</strong> {{ filePreview.name }}</p>
          <p><strong>Tamanho:</strong> {{ filePreview.size }}</p>
          <p v-if="filePreview.subject"><strong>Subject:</strong> {{ filePreview.subject }}</p>
          <p v-if="filePreview.issuer"><strong>Issuer:</strong> {{ filePreview.issuer }}</p>
          <p v-if="filePreview.serialNumber"><strong>Serial:</strong> {{ filePreview.serialNumber }}</p>
          <p v-if="filePreview.validadeInicio"><strong>Validade início:</strong> {{ filePreview.validadeInicio }}</p>
          <p v-if="filePreview.validadeFim"><strong>Validade fim:</strong> {{ filePreview.validadeFim }}</p>
        </div>

        <!-- Chave Privada -->
        <v-textarea
            v-model="chavePrivada"
            label="Arquivo Chave Privada (*.key)"
            auto-grow
            variant="outlined"
            rows="6"
        />

        <!-- Certificado PEM -->
        <v-textarea
            v-model="certificadoPem"
            label="Arquivo Certificado (*.pem)"
            auto-grow
            variant="outlined"
            rows="6"
        />
      </v-container>
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import {ref, watch} from "vue"
import forge from "node-forge"

const arquivoPfx = ref(null)
const senha = ref("")

// Preview do arquivo
const filePreview = ref({
  name: "",
  size: "",
  subject: "",
  issuer: "",
  serialNumber: "",
  validadeInicio: "",
  validadeFim: "",
})

const codigoCertificado = ref("");
const validoApos = ref("");
const validoAte = ref("");
const modelo = ref("A1");
const situacao = ref("ativo");
const alertaDias = ref(30);

// Resultados da extração
const chavePrivada = ref("")
const certificadoPem = ref("")

// ---------------------------
// LER ARQUIVO .PFX
// ---------------------------

watch(arquivoPfx, (val) => {
  if (!val || val.length === 0) return

  const file = val  // ← AQUI está seu .pfx real

  filePreview.value = {
    name: file.name,
    size: (file.size / 1024).toFixed(2) + " KB"
  }

  console.log("📁 Arquivo selecionado:", file)
})



// ---------------------------
// EXTRAIR CERTIFICADO E CHAVE
// ---------------------------
const extrairCertificado = async () => {
  if (!arquivoPfx.value) {
    alert("Selecione um arquivo PFX")
    return
  }
  if (!senha.value) {
    alert("Digite a senha do arquivo PFX")
    return
  }

  const arrayBuffer = await arquivoPfx.value.arrayBuffer()
  const binary = String.fromCharCode(...new Uint8Array(arrayBuffer))

  let p12
  try {
    p12 = forge.pkcs12.pkcs12FromAsn1(
        forge.asn1.fromDer(binary),
        false,
        senha.value
    )
  } catch (err) {
    alert("Senha incorreta ou arquivo inválido")
    return
  }

  // Buscar key e cert
  const bagsCert = p12.getBags({ bagType: forge.pki.oids.certBag })
  const bagsKey = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })

  const certificado = bagsCert[forge.pki.oids.certBag][0].cert
  const privateKey = bagsKey[forge.pki.oids.pkcs8ShroudedKeyBag][0].key

  // Converter para PEM
  certificadoPem.value = forge.pki.certificateToPem(certificado)
  chavePrivada.value = forge.pki.privateKeyToPem(privateKey)

  console.log(certificado);

  // Preencher dados para preview
  filePreview.value.subject = certificado.subject.attributes
      .map((a) => `${a.shortName}=${a.value}`)
      .join(", ")

  filePreview.value.issuer = certificado.issuer.attributes
      .map((a) => `${a.shortName}=${a.value}`)
      .join(", ")

  filePreview.value.serialNumber = certificado.serialNumber
  filePreview.value.validadeInicio = certificado.validity.notBefore
  filePreview.value.validadeFim = certificado.validity.notAfter

  codigoCertificado.value = certificado.subject.hash;
  validoAte.value = paraInputDate(certificado.validity.notAfter);
  validoApos.value = paraInputDate(certificado.validity.notBefore);
}

const paraInputDate = (date) => {
  if (!date) return ""

  const d = new Date(date)
  const dia = String(d.getDate()).padStart(2, "0")
  const mes = String(d.getMonth() + 1).padStart(2, "0")
  const ano = d.getFullYear()

  return `${ano}-${mes}-${dia}`
}

</script>