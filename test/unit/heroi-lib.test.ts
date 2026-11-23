import { describe, expect, it } from 'vitest'
import { copiarHeroi, migrarHeroi, nomeExibicao, novoHeroi } from 'src/libs/heroi-lib'
import { correspondeBusca, normalizarTexto } from 'src/libs/busca-lib'

describe('heroi-lib', () => {
  it('novoHeroi cria ids diferentes e PV/PM automáticos', () => {
    const a = novoHeroi()
    const b = novoHeroi()
    expect(a.id).not.toBe(b.id)
    expect(a.pv_pm_manual).toBe(false)
  })

  it('migrarHeroi completa heróis salvos em versões antigas', () => {
    const antigo = { id: 'h1', name: 'Thorin', pv: 10, caracteristicas: { F: 3 } } as never
    const migrado = migrarHeroi(antigo)
    expect(migrado.id).toBe('h1')
    expect(migrado.caracteristicas).toEqual({ F: 3, PdF: null, A: null, H: null, R: null })
    expect(migrado.vantagens_valores).toEqual([])
    expect(migrado.focus.fogo).toBeNull()
    expect(migrado.ajustes).toEqual({})
    // Heróis antigos já tinham PV digitado: mantém como manual
    expect(migrado.pv_pm_manual).toBe(true)
    expect(migrarHeroi({ id: 'h2' }).pv_pm_manual).toBe(false)
  })

  it('copiarHeroi gera uma cópia independente com id novo', () => {
    const original = { ...novoHeroi(), name: 'Lyra', vantagens_valores: ['aceleracao'] }
    const copia = copiarHeroi(original)
    expect(copia.id).not.toBe(original.id)
    expect(copia.name).toBe('Lyra')
    copia.vantagens_valores.push('arena')
    expect(original.vantagens_valores).toEqual(['aceleracao'])
  })

  it('nomeExibicao usa um texto padrão para heróis sem nome', () => {
    expect(nomeExibicao({ ...novoHeroi(), name: '  ' })).toBe('Herói sem nome')
  })
})

describe('busca-lib', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(normalizarTexto('Bênção de AÇÃO')).toBe('bencao de acao')
    expect(correspondeBusca('acao', 'Aceleração', 'Ação extra')).toBe(true)
    expect(correspondeBusca('dragao', 'Bola de Fogo')).toBe(false)
  })

  it('busca vazia corresponde a tudo', () => {
    expect(correspondeBusca('', 'qualquer')).toBe(true)
    expect(correspondeBusca(null, 'qualquer')).toBe(true)
  })
})
