#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── Helpers ──────────────────────────────────────────────

async function embed(text) {
  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text.slice(0, 8000) }),
  })
  const data = await res.json()
  return data.embedding
}

function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function parseJsonArray(str) {
  try { return JSON.parse(str || '[]') } catch { return [] }
}

function formatDate(d) {
  return d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10)
}

// ── Server ───────────────────────────────────────────────

const server = new Server(
  { name: 'simplesfique-memoria', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
)

// ── Tools ────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'store_memory',
      description: 'Armazena uma memória sobre implementação, correção ou decisão do projeto',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título curto da memória' },
          type: {
            type: 'string',
            enum: ['implementacao', 'correcao', 'decisao', 'melhoria', 'arquitetura'],
            description: 'Tipo da memória',
          },
          problema: { type: 'string', description: 'O problema ou contexto' },
          solucao: { type: 'string', description: 'O que foi feito para resolver' },
          arquivos: {
            type: 'array', items: { type: 'string' },
            description: 'Arquivos afetados (caminhos relativos)',
          },
          tags: {
            type: 'array', items: { type: 'string' },
            description: 'Tags para categorização (ex: financeiro, pdv, ui, store)',
          },
        },
        required: ['title', 'type', 'solucao'],
      },
    },
    {
      name: 'search_memories',
      description: 'Busca memórias por similaridade semântica',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Pergunta ou termo para buscar' },
          limit: { type: 'number', description: 'Máximo de resultados (padrão: 5)' },
          tipo: {
            type: 'string',
            enum: ['implementacao', 'correcao', 'decisao', 'melhoria', 'arquitetura'],
            description: 'Filtrar por tipo',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'list_memories',
      description: 'Lista memórias recentes',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Máximo (padrão: 10)' },
          tipo: { type: 'string', description: 'Filtrar por tipo' },
        },
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  // ── store_memory ────────────────────────────────────
  if (name === 'store_memory') {
    const textForEmbed = `${args.title}\n${args.problema || ''}\n${args.solucao}\n${(args.tags || []).join(' ')}`
    const embedding = await embed(textForEmbed)

    const memoria = await prisma.memoria.create({
      data: {
        title: args.title,
        type: args.type || 'implementacao',
        problema: args.problema || '',
        solucao: args.solucao,
        arquivos: JSON.stringify(args.arquivos || []),
        tags: JSON.stringify(args.tags || []),
        embedding: JSON.stringify(embedding),
      },
    })

    return {
      content: [{ type: 'text', text: JSON.stringify({ id: memoria.id, title: memoria.title }, null, 2) }],
    }
  }

  // ── search_memories ─────────────────────────────────
  if (name === 'search_memories') {
    const queryEmb = await embed(args.query)
    const limit = args.limit || 5

    const where = args.tipo ? { type: args.tipo } : {}
    const all = await prisma.memoria.findMany({ where })

    if (all.length === 0) {
      return { content: [{ type: 'text', text: 'Nenhuma memória encontrada.' }] }
    }

    const scored = all
      .map((m) => ({
        ...m,
        score: m.embedding ? cosineSimilarity(queryEmb, JSON.parse(m.embedding)) : 0,
      }))
      .filter((m) => m.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return {
      content: scored.length
        ? [{
            type: 'text',
            text: scored.map(
              (m) =>
                `[${m.score.toFixed(2)}] **${m.title}** (${m.type}, ${formatDate(m.createdAt)})\nProblema: ${m.problema}\nSolução: ${m.solucao}\nArquivos: ${parseJsonArray(m.arquivos).join(', ')}\nTags: ${parseJsonArray(m.tags).join(', ')}`
            ).join('\n---\n'),
          }]
        : [{ type: 'text', text: 'Nenhuma memória similar encontrada.' }],
    }
  }

  // ── list_memories ───────────────────────────────────
  if (name === 'list_memories') {
    const where = args?.tipo ? { type: args.tipo } : {}
    const memories = await prisma.memoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: args?.limit || 10,
    })

    return {
      content: [{
        type: 'text',
        text: memories.length
          ? memories.map(
              (m) =>
                `**${m.title}** (${m.type}) — ${formatDate(m.createdAt)}\n${m.problema ? 'Problema: ' + m.problema + '\n' : ''}Arquivos: ${parseJsonArray(m.arquivos).join(', ')}\nTags: ${parseJsonArray(m.tags).join(', ')}`
            ).join('\n---\n')
          : 'Nenhuma memória registrada.',
      }],
    }
  }

  throw new Error(`Tool desconhecida: ${name}`)
})

// ── Resources ─────────────────────────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'memoria://recentes',
      name: 'Memórias Recentes',
      description: 'Lista das memórias mais recentes do projeto',
      mimeType: 'application/json',
    },
    {
      uri: 'memoria://stats',
      name: 'Estatísticas de Memórias',
      description: 'Contagem de memórias por tipo',
      mimeType: 'application/json',
    },
  ],
}))

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri

  if (uri === 'memoria://recentes') {
    const memories = await prisma.memoria.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(
          memories.map((m) => ({
            id: m.id,
            title: m.title,
            type: m.type,
            problema: m.problema,
            solucao: m.solucao,
            arquivos: parseJsonArray(m.arquivos),
            tags: parseJsonArray(m.tags),
            createdAt: m.createdAt,
          })),
          null,
          2
        ),
      }],
    }
  }

  if (uri === 'memoria://stats') {
    const all = await prisma.memoria.findMany()
    const stats = {}
    for (const m of all) {
      stats[m.type] = (stats[m.type] || 0) + 1
    }
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({ total: all.length, porTipo: stats }, null, 2),
      }],
    }
  }

  throw new Error(`Resource não encontrado: ${uri}`)
})

// ── Shutdown ──────────────────────────────────────────────

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

// ── Start ────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('🧠 MCP RAG SimplesFique rodando (Prisma + SQLite)')
}

main().catch(async (err) => {
  console.error('Erro no MCP server:', err)
  await prisma.$disconnect()
  process.exit(1)
})
