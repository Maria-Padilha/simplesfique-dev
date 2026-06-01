/**
 * Serviço para comunicação direta com Cloudflare R2
 * Usa AWS SDK (S3-compatible) para gerar presigned URLs no front-end
 * e faz upload/download/delete diretamente no R2
 */

import { S3Client, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

// ── Configurações ──────────────────────────────────────────────────────────────
const ACCOUNT_ID     = process.env.VUE_APP_CLOUDFLARE_ACCOUNT_ID   || ''
const ACCESS_KEY_ID  = process.env.VUE_APP_CLOUDFLARE_ACCESS_KEY_ID || ''
const SECRET_ACCESS  = process.env.VUE_APP_CLOUDFLARE_SECRET_ACCESS_KEY || ''
const BUCKET_NAME    = process.env.VUE_APP_CLOUDFLARE_BUCKET_NAME  || 'simplesfique'
const PUBLIC_URL     = process.env.VUE_APP_CLOUDFLARE_PUBLIC_URL   || ''

// Endpoint S3-compatible do R2
const ENDPOINT = ACCOUNT_ID
  ? `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`
  : (process.env.VUE_APP_CLOUDFLARE_ENDPOINT_URL || '')

// ── Cliente S3 (R2 compatible) ────────────────────────────────────────────────
const criarClienteR2 = () => {
  return new S3Client({
    region: 'auto',
    endpoint: ENDPOINT,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS
    }
  })
}

// ── Helpers de localStorage ────────────────────────────────────────────────────

/**
 * Obtém o ID do SaaS do localStorage (parfinpag → data[0].id_saas)
 * @returns {string}
 */
const obterIdSaas = () => {
  try {
    const raw = localStorage.getItem('parfinpag')
    if (!raw) return 'default'
    const parsed = JSON.parse(raw)
    return parsed?.data?.[0]?.id_saas || 'default'
  } catch {
    return 'default'
  }
}

/**
 * Obtém o ID da Empresa do localStorage (empresaSelecionada → id)
 * @returns {string}
 */
const obterIdEmpresa = () => {
  try {
    const raw = localStorage.getItem('empresaSelecionada')
    if (!raw) return 'default'
    const parsed = JSON.parse(raw)
    return parsed?.id || 'default'
  } catch {
    return 'default'
  }
}

/**
 * Gera o caminho do arquivo no bucket
 * Estrutura: {id_saas}/{id_empresa}/{entidade}/{timestamp}-{nomeArquivo}
 */
const gerarCaminho = (entidade, nomeArquivo) => {
  const timestamp = Date.now()
  const idSaas    = obterIdSaas()
  const idEmpresa = obterIdEmpresa()
  const nomeSeguro = nomeArquivo.replace(/\s+/g, '_')
  return `${idSaas}/${idEmpresa}/${entidade}/${timestamp}-${nomeSeguro}`
}

// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Gera presigned URL de upload direto no R2 (válida 15 min)
 */
export const gerarPresignedUpload = async (entidade, nomeArquivo, mimeType) => {
  const client  = criarClienteR2()
  const caminho = gerarCaminho(entidade, nomeArquivo)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: caminho,
    ContentType: mimeType
  })

  const url = await getSignedUrl(client, command, { expiresIn: 900 })
  return { url, caminho }
}

/**
 * Faz upload de arquivo direto no R2 via presigned URL
 * @param {File} arquivo
 * @param {string} entidade - produto | boleto | outro
 * @returns {Promise<{sucesso: boolean, url: string, caminho: string}>}
 */
export const uploadArquivoR2 = async (arquivo, entidade = 'outro') => {
  try {
        if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS) {
      return { sucesso: false, erro: 'Credenciais R2 não configuradas. Verifique o .env' }
    }

    // 1. Gera presigned URL no front com AWS SDK
    const { url, caminho } = await gerarPresignedUpload(entidade, arquivo.name, arquivo.type)
    // 2. PUT direto no R2
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': arquivo.type || 'application/octet-stream' },
      body: arquivo
    })

    if (!response.ok) {
      const txt = await response.text()
      return { sucesso: false, erro: `Upload falhou: ${response.status} - ${txt}` }
    }

    // 3. Monta URL pública
    const urlPublica = PUBLIC_URL
      ? `${PUBLIC_URL}/${caminho}`
      : `${ENDPOINT}/${BUCKET_NAME}/${caminho}`

    return {
      sucesso: true,
      url: urlPublica,
      caminho,
      nomeArquivo: arquivo.name,
      tamanho: arquivo.size,
      tipo: arquivo.type
    }
  } catch (error) {
    return { sucesso: false, erro: error.message }
  }
}

// ── Download ───────────────────────────────────────────────────────────────────

/**
 * Gera presigned URL de download (válida 1 hora)
 * @param {string} caminho - Caminho do arquivo no bucket
 */
export const gerarPresignedDownload = async (caminho) => {
  const client  = criarClienteR2()
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: caminho })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}

/**
 * Abre download via presigned URL
 * @param {string} caminho - Caminho do arquivo no bucket
 */
export const downloadArquivoR2 = async (caminho) => {
  try {
    const url  = await gerarPresignedDownload(caminho)
    const link = document.createElement('a')
    link.href  = url
    link.download = caminho.split('/').pop()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return { sucesso: true }
  } catch (error) {
    return { sucesso: false, erro: error.message }
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────

/**
 * Deleta arquivo do R2
 * @param {string} caminho - Caminho do arquivo no bucket
 */
export const deletarArquivoR2 = async (caminho) => {
  try {
    const client  = criarClienteR2()
    const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: caminho })
    await client.send(command)
    return true
  } catch (error) {
    console.error('[R2] deletarArquivoR2 erro:', error)
    throw error
  }
}

// ── List ───────────────────────────────────────────────────────────────────────

/**
 * Lista arquivos de uma entidade no bucket
 * @param {string} entidade
 */
export const listarArquivosR2 = async (entidade) => {
  try {
    const client  = criarClienteR2()
    const idSaas  = obterIdSaas()
    const idEmpresa = obterIdEmpresa()
    const prefix  = `${idSaas}/${idEmpresa}/${entidade}/`

    const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix })
    const result  = await client.send(command)
    return result.Contents || []
  } catch (error) {
    return []
  }
}

// ── Config ─────────────────────────────────────────────────────────────────────

/**
 * Retorna estado das configurações R2
 */
export const obterConfiguracoesR2 = () => ({
  configurado: !!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS),
  bucketName: BUCKET_NAME,
  endpoint: ENDPOINT,
  publicUrl: PUBLIC_URL,
  idSaas: obterIdSaas(),
  idEmpresa: obterIdEmpresa()
})

export { obterIdSaas, obterIdEmpresa, gerarCaminho as gerarCaminhoArquivo }

