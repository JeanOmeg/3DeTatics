import { describe, expect, it } from 'vitest'
import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'
import { VantagensEDesvantagensLib } from 'src/libs/vantagens-lib'
import { RacasLib } from 'src/libs/racas-lib'
import { KitsLib } from 'src/libs/kits-lib'
import { MagiasLib } from 'src/libs/magias-lib'
import { CAMINHOS } from 'src/types/caminho-type'

// Integridade dos dados do jogo: toda referência entre listas aponta para algo que existe.

const valoresVantagens = new Set(VantagensEDesvantagensLib.listarVantagensEDesvantagens().filter(v => v.tipo === TipoVantagemEnum.vantagem).map(v => v.value))
const valoresDesvantagens = new Set(VantagensEDesvantagensLib.listarVantagensEDesvantagens().filter(v => v.tipo === TipoVantagemEnum.desvantagem).map(v => v.value))
const valoresRacas = new Set(RacasLib.listarRacas().map(r => r.value as string))
const valoresKits = new Set(KitsLib.listarKits().map(k => k.value))
const caminhos = new Set(CAMINHOS.map(c => c.key as string))

describe('Vantagens e Desvantagens', () => {
  const todas = VantagensEDesvantagensLib.listarVantagensEDesvantagens()

  it('têm value único e custo numérico coerente com o texto', () => {
    expect(new Set(todas.map(v => v.value)).size).toBe(todas.length)
    for (const item of todas) {
      expect(Number.isInteger(item.pontos), item.nome).toBe(true)
      if (item.tipo === TipoVantagemEnum.desvantagem) expect(item.pontos, item.nome).toBeLessThan(0)
      expect(item.custo, item.nome).toContain(String(Math.abs(item.pontos)))
    }
  })

  it('pré-requisitos apontam para vantagens existentes', () => {
    for (const item of todas) {
      for (const requisito of item.requer ?? []) expect(valoresVantagens.has(requisito), `${item.nome} -> ${requisito}`).toBe(true)
    }
  })

  it('Focus não aparece no seletor de vantagens (tem campos próprios)', () => {
    const combo = VantagensEDesvantagensLib.listarVantagensEDesvantagensCombo(TipoVantagemEnum.vantagem).map(v => v.value)
    expect(combo).not.toContain('focus')
  })
})

describe('Raças', () => {
  it('referências de vantagens, desvantagens e Focus existem', () => {
    for (const raca of RacasLib.listarRacas()) {
      for (const v of raca.vantagensGratis ?? []) expect(valoresVantagens.has(v), `${raca.nome} -> ${v}`).toBe(true)
      for (const v of raca.vantagensProibidas ?? []) expect(valoresVantagens.has(v), `${raca.nome} -> ${v}`).toBe(true)
      for (const d of raca.desvantagensRaciais ?? []) expect(valoresDesvantagens.has(d), `${raca.nome} -> ${d}`).toBe(true)
      for (const c of Object.keys(raca.bonusFocus ?? {})) expect(caminhos.has(c), `${raca.nome} -> ${c}`).toBe(true)
    }
  })
})

describe('Kits', () => {
  it('têm multiplicadores de PV e PM válidos', () => {
    for (const kit of KitsLib.listarKits()) {
      expect(kit.multiplicadorPv, kit.nome).toBeGreaterThan(0)
      expect(kit.multiplicadorPm, kit.nome).toBeGreaterThan(0)
      expect(kit.pv).toContain(String(kit.multiplicadorPv))
    }
  })

  it('referências de raças, vantagens e desvantagens existem', () => {
    for (const kit of KitsLib.listarKits()) {
      for (const r of [...(kit.racasProibidas ?? []), ...Object.keys(kit.custoPorRaca ?? {})]) expect(valoresRacas.has(r), `${kit.nome} -> ${r}`).toBe(true)
      for (const v of [...(kit.vantagensGratis ?? []), ...(kit.exigeVantagens ?? []), ...(kit.vantagensProibidas ?? []), ...Object.keys(kit.descontos ?? {})]) {
        expect(valoresVantagens.has(v), `${kit.nome} -> ${v}`).toBe(true)
      }
      for (const d of [...(kit.desvantagensDoKit ?? []), ...(kit.exigeDesvantagens ?? [])]) expect(valoresDesvantagens.has(d), `${kit.nome} -> ${d}`).toBe(true)
    }
  })
})

describe('Magias', () => {
  it('toda magia tem requisito estruturado com Caminhos e kits válidos', () => {
    for (const magia of MagiasLib.listarMagias()) {
      const requisito = MagiasLib.requisitos(magia.value)
      expect(requisito.alternativas.length, magia.nome).toBeGreaterThan(0)
      for (const alternativa of requisito.alternativas) {
        for (const [caminho, focus] of Object.entries(alternativa)) {
          expect(caminhos.has(caminho), `${magia.nome} -> ${caminho}`).toBe(true)
          expect(focus).toBeGreaterThan(0)
          // O texto exibido menciona o Focus exigido (exceto requisitos relativos,
          // como o de Cancelamento de Magia, que dependem da magia cancelada)
          if (/\d/.test(magia.requisito)) {
            expect(magia.requisito, magia.nome).toContain(String(focus))
          }
        }
      }
      for (const v of requisito.vantagens ?? []) expect(valoresVantagens.has(v), `${magia.nome} -> ${v}`).toBe(true)
      for (const k of requisito.kits ?? []) expect(valoresKits.has(k), `${magia.nome} -> ${k}`).toBe(true)
    }
  })
})
