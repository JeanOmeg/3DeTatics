// Gera versões otimizadas (WebP) das imagens originais.
//
// Uso: npm run imagens
//
// Originais ficam em /assets-originais (fora do build).
// As versões otimizadas são gravadas em /src/assets com o mesmo nome e extensão .webp.
// Para trocar uma imagem: substitua o original e rode o script de novo.

import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ORIGEM = 'assets-originais'
const DESTINO = path.join('src', 'assets')
const EXTENSOES = new Set(['.jpg', '.jpeg', '.png'])

// Largura máxima por imagem (px). As imagens das regras são exibidas com no
// máximo ~600px; 1200px cobre telas de alta densidade.
const LARGURA_PADRAO = 1200
const LARGURA_POR_ARQUIVO = {
  '3detatics.png': 900,
  'codex.png': 900
}
const QUALIDADE = 75

function kb (bytes) {
  return `${Math.round(bytes / 1024)} KB`
}

await mkdir(DESTINO, { recursive: true })

const arquivos = (await readdir(ORIGEM)).filter(nome => EXTENSOES.has(path.extname(nome).toLowerCase()))
let totalAntes = 0
let totalDepois = 0

for (const nome of arquivos) {
  const entrada = path.join(ORIGEM, nome)
  const saida = path.join(DESTINO, `${path.parse(nome).name}.webp`)
  const largura = LARGURA_POR_ARQUIVO[nome] ?? LARGURA_PADRAO

  await sharp(entrada)
    .rotate()
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toFile(saida)

  const antes = (await stat(entrada)).size
  const depois = (await stat(saida)).size
  totalAntes += antes
  totalDepois += depois
  console.log(`${nome.padEnd(18)} ${kb(antes).padStart(9)} -> ${kb(depois).padStart(7)}`)
}

console.log(`\nTotal: ${kb(totalAntes)} -> ${kb(totalDepois)}`)
