import { describe, expect, it } from 'vitest'
import { ajustarGrupoAoTamanho, aplicarDiferencaDeBonus, bonusDaFicha, calcularHeroi, heroiVazio } from 'src/libs/ficha-lib'
import { novoHeroi } from 'src/libs/heroi-lib'
import type { IHeroi } from 'src/interfaces/heroi-interface'
import { heroi } from './ajudantes'

// Simula o que a carta faz ao trocar de raça/kit: aplica a diferença de bônus.
function trocar (h: IHeroi, mudancas: Partial<IHeroi>) {
  const antes = bonusDaFicha(h)
  Object.assign(h, mudancas)
  aplicarDiferencaDeBonus(h, antes, bonusDaFicha(h))
}

describe('bônus automáticos de raça, kit e Arcano', () => {
  it('escolher Elfo em uma carta vazia preenche H1', () => {
    const h = heroi()
    trocar(h, { raca_valor: 'elfo' })
    expect(h.caracteristicas.H).toBe(1)
    expect(h.caracteristicas.F).toBeNull()
  })

  it('soma o bônus ao valor já digitado, sem custo extra', () => {
    const h = heroi({ ph: 5, caracteristicas: { F: 1, H: 2, R: 1, A: 1, PdF: 0 } })
    expect(calcularHeroi(h).pontos).toBe(5)

    trocar(h, { raca_valor: 'elfo' })
    expect(h.caracteristicas.H).toBe(3)
    // H3 com bônus +1 = 2 comprados; mais o custo da raça (2)
    expect(calcularHeroi(h).pontos).toBe(5 + 2)
  })

  it('trocar de raça tira o bônus antigo e aplica o novo', () => {
    const h = heroi({ caracteristicas: { F: 1, H: 1, R: 1, A: 1, PdF: 1 } })
    trocar(h, { raca_valor: 'elfo' })
    expect(h.caracteristicas.H).toBe(2)

    trocar(h, { raca_valor: 'ogre' })
    expect(h.caracteristicas).toMatchObject({ H: 1, F: 4, R: 4 })

    trocar(h, { raca_valor: '' })
    expect(h.caracteristicas).toMatchObject({ H: 1, F: 1, R: 1 })
  })

  it('em carta vazia, trocar Elfo por Humano deixa o H vazio de novo', () => {
    const h = heroi()
    trocar(h, { raca_valor: 'elfo' })
    trocar(h, { raca_valor: 'humano' })
    expect(h.caracteristicas.H).toBeNull()
  })

  it('nunca passa de 5', () => {
    const h = heroi({ caracteristicas: { F: 4 } })
    trocar(h, { raca_valor: 'ogre' })
    expect(h.caracteristicas.F).toBe(5)
  })

  it('aplica bônus de kit (Arqueiro PdF+1) junto com o da raça (Halfling PdF+1)', () => {
    const h = heroi()
    trocar(h, { raca_valor: 'halfling' })
    trocar(h, { kit_valor: 'arqueiro' })
    expect(h.caracteristicas).toMatchObject({ H: 1, PdF: 2 })
  })

  it('aplica bônus de Focus da raça e do Arcano', () => {
    const h = heroi()
    trocar(h, { raca_valor: 'elfo_negro' })
    expect(h.focus).toMatchObject({ luz: 1, trevas: 1, fogo: null })

    trocar(h, { vantagens_valores: ['arcano'] })
    expect(h.focus).toMatchObject({ luz: 2, trevas: 2, fogo: 1, agua: 1 })
  })
})

describe('montagem automática do grupo pelo tamanho', () => {
  const comPh = (ph: number | null, extra: Partial<IHeroi> = {}) => heroi({ ph, ...extra })
  const phs = (herois: IHeroi[]) => herois.map(h => h.ph)

  it('Novato cria 3 cartas de 5 pts e 2 de 7 pts, aproveitando a carta sem PH', () => {
    const inicial = [comPh(null)]
    const ajuste = ajustarGrupoAoTamanho(inicial, 'novato', novoHeroi)
    expect(phs(ajuste.herois)).toEqual([5, 5, 5, 7, 7])
    expect(ajuste.adicionados).toBe(4)
    expect(ajuste.herois[0]).toBe(inicial[0])
  })

  it('de Novato para Lutador acrescenta só as 2 cartas de 10 pts', () => {
    const novato = ajustarGrupoAoTamanho([], 'novato', novoHeroi).herois
    const lutador = ajustarGrupoAoTamanho(novato, 'lutador', novoHeroi)
    expect(phs(lutador.herois)).toEqual([5, 5, 5, 7, 7, 10, 10])
    expect(lutador.adicionados).toBe(2)
  })

  it('Lenda tem 12 heróis', () => {
    expect(ajustarGrupoAoTamanho([], 'lenda', novoHeroi).herois).toHaveLength(12)
  })

  it('ao reduzir, remove só cartas vazias e nunca apaga heróis preenchidos', () => {
    const lenda = ajustarGrupoAoTamanho([], 'lenda', novoHeroi).herois
    const preenchido = lenda.find(h => h.ph === 12)
    if (preenchido) preenchido.name = 'Dragão Ancião'

    const novato = ajustarGrupoAoTamanho(lenda, 'novato', novoHeroi)
    expect(phs(novato.herois)).toEqual([5, 5, 5, 7, 7, 12])
    expect(novato.herois.map(h => h.name)).toContain('Dragão Ancião')
    expect(novato.removidos).toBe(6)
  })

  it('Livre não muda nada', () => {
    const lista = [comPh(5)]
    expect(ajustarGrupoAoTamanho(lista, 'livre', novoHeroi)).toEqual({ herois: lista, adicionados: 0, removidos: 0 })
  })

  it('heroiVazio reconhece cartas não preenchidas', () => {
    expect(heroiVazio(heroi({ ph: 5 }))).toBe(true)
    expect(heroiVazio(heroi({ name: 'Arwen' }))).toBe(false)
    expect(heroiVazio(heroi({ caracteristicas: { F: 1 } }))).toBe(false)
  })
})
