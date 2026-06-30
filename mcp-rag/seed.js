#!/usr/bin/env node

/**
 * Migra dados do memories.json antigo para o Prisma + SQLite.
 * Rode apenas uma vez.
 */

import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()
const oldFile = join(__dirname, 'memories.json')

async function embed(text) {
  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text.slice(0, 8000) }),
  })
  const data = await res.json()
  return data.embedding
}

async function main() {
  // Check if data already exists
  const count = await prisma.memoria.count()
  if (count > 0) {
    console.error(`✅ ${count} memórias já existem no banco. Pulando seed.`)
    await prisma.$disconnect()
    return
  }

  if (!existsSync(oldFile)) {
    console.error('Nenhum memories.json antigo encontrado.')
    await prisma.$disconnect()
    return
  }

  const old = JSON.parse(readFileSync(oldFile, 'utf-8'))
  let imported = 0

  for (const m of old) {
    const text = `${m.title}\n${m.problema || ''}\n${m.solucao}\n${(m.tags || []).join(' ')}`
    console.error(`Importando: ${m.title}...`)
    const embedding = m._embedding || await embed(text)

    await prisma.memoria.create({
      data: {
        title: m.title,
        type: m.type || 'implementacao',
        problema: m.problema || '',
        solucao: m.solucao,
        arquivos: JSON.stringify(m.arquivos || []),
        tags: JSON.stringify(m.tags || []),
        embedding: JSON.stringify(embedding),
        createdAt: new Date(m.created_at || Date.now()),
      },
    })
    imported++
  }

  console.error(`✅ ${imported} memórias importadas para Prisma + SQLite.`)
  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
