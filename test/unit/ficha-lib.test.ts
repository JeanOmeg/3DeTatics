import { describe, expect, it } from 'vitest'
import { calcularHeroi, calcularPvPm, gerarTextos, magiaDisponivel, validarGrupo } from 'src/libs/ficha-lib'
import { heroi, heroiBasico, mensagens } from './ajudantes'

const erros = (h: ReturnType<typeof heroi>) => calcularHeroi(h).problemas.filter(p => p.nivel === 'erro')

describe('calcularHeroi: pontos', () => {
  it('soma as Características compradas', () => {
    const calculo = calcularHeroi(heroiBasico())
    expect(calculo.pontos).toBe(5)
    expect(calculo.problemas).toEqual([])
  })

  it('bônus de raça não custa pontos (Elfo: H+1)', () => {
    const calculo = calcularHeroi(heroiBasico({ raca_valor: 'elfo', caracteristicas: { F: 0, H: 2, R: 1, A: 0, PdF: 0 } }))
    // H2 com bônus +1 = 1 comprado; F0 R1 A0 PdF0 = 1; raça Elfo custa 2 → 1 + 1 + 2 = 4
    expect(calculo.pontos).toBe(4)
  })

  it('bônus de kit não custa pontos (Arqueiro: PdF+1) e Arqueiro custa 0 para Elfo', () => {
    const humano = calcularHeroi(heroiBasico({ raca_valor: 'humano', kit_valor: 'arqueiro', caracteristicas: { F: 0, H: 1, R: 1, A: 0, PdF: 3 } }))
    // PdF3 - 1 de bônus = 2; H1 R1 = 2; kit 1 → 5
    expect(humano.pontos).toBe(5)

    const elfo = calcularHeroi(heroiBasico({ raca_valor: 'elfo', kit_valor: 'arqueiro', caracteristicas: { F: 0, H: 1, R: 1, A: 0, PdF: 3 } }))
    // H1 - 1 (raça) = 0; R1; PdF 2; raça 2; kit 0 → 5
    expect(elfo.pontos).toBe(5)
  })

  it('vantagens e desvantagens entram na conta', () => {
    const calculo = calcularHeroi(heroiBasico({ vantagens_valores: ['aceleracao'], desvantagens_valores: ['ma_fama'] }))
    expect(calculo.pontos).toBe(5 + 1 - 1)
  })

  it('vantagens repetíveis multiplicam o custo', () => {
    const calculo = calcularHeroi(heroiBasico({ ph: 10, vantagens_valores: ['pontos_de_vida_extras'], ajustes: { pontos_de_vida_extras: 3 } }))
    expect(calculo.pontos).toBe(5 + 3)
  })

  it('vantagens com opções de custo usam o valor escolhido', () => {
    const semEscolha = calcularHeroi(heroiBasico({ ph: 7, vantagens_valores: ['energia_extra'] }))
    expect(semEscolha.pontos).toBe(6)
    expect(mensagens(semEscolha.problemas)).toContain('Escolha o custo de Energia Extra')

    const comEscolha = calcularHeroi(heroiBasico({ ph: 7, vantagens_valores: ['energia_extra'], ajustes: { energia_extra: 2 } }))
    expect(comEscolha.pontos).toBe(7)
  })

  it('descontos de kit (Mago: AE - Área por 2) e vantagem grátis (Mago: Ataque Especial)', () => {
    const calculo = calcularHeroi(heroiBasico({ ph: 7, kit_valor: 'mago', vantagens_valores: ['ataque_especial', 'ae_area'] }))
    // 5 (características) + 0 (kit) + 0 (AE grátis) + 2 (AE - Área com desconto)
    expect(calculo.pontos).toBe(7)
    expect(mensagens(calculo.problemas)).not.toContain('exige Ataque Especial')
  })

  it('desvantagens da raça e do kit não dão pontos', () => {
    const calculo = calcularHeroi(heroiBasico({ raca_valor: 'meio_orc', desvantagens_valores: ['ma_fama'] }))
    // raça -1, Má Fama racial = 0, F com bônus +1: F1 vira 0 comprado
    expect(calculo.pontos).toBe(4 - 1)
  })

  it('Focus custa 1 por nível; Arcano e Clericato dão níveis grátis', () => {
    expect(calcularHeroi(heroiBasico({ ph: 7, focus: { fogo: 2 } })).pontos).toBe(7)
    // Arcano (4 pontos) dá +1 em todos os Focus: Fogo 2 custa só 1
    expect(calcularHeroi(heroiBasico({ ph: 10, vantagens_valores: ['arcano'], focus: { fogo: 2 } })).pontos).toBe(5 + 4 + 1)
    // Clericato (2 pontos) dá 1 nível grátis
    expect(calcularHeroi(heroiBasico({ ph: 10, vantagens_valores: ['clericato'], focus: { luz: 2 } })).pontos).toBe(5 + 2 + 1)
  })
})

describe('calcularHeroi: validações', () => {
  it('avisa quando sobram pontos e dá erro quando passa do PH', () => {
    expect(mensagens(calcularHeroi(heroiBasico({ ph: 7 })).problemas)).toContain('Sobram 2 pontos')
    expect(mensagens(erros(heroiBasico({ ph: 5, caracteristicas: { F: 3 } })))).toContain('a mais que o PH')
  })

  it('pede PH quando está vazio', () => {
    expect(mensagens(calcularHeroi(heroi()).problemas)).toContain('Defina o PH')
  })

  it('respeita o limite comprado por faixa e o máximo de 5', () => {
    expect(mensagens(erros(heroiBasico({ caracteristicas: { F: 4 } })))).toContain('passa do limite de 3')
    expect(mensagens(erros(heroiBasico({ ph: 12, caracteristicas: { F: 6 } })))).toContain('máximo de 5')
  })

  it('limita Desvantagens a 3 e a -6 pontos', () => {
    const quatro = heroiBasico({ desvantagens_valores: ['ma_fama', 'fetiche', 'ponto_fraco', 'monstruoso'] })
    expect(mensagens(erros(quatro))).toContain('No máximo 3 Desvantagens')

    const muitosPontos = heroiBasico({ desvantagens_valores: ['assombrado', 'devocao', 'vulnerabilidade'], ajustes: { vulnerabilidade: -3 } })
    expect(mensagens(erros(muitosPontos))).toContain('no máximo -6 pontos')
  })

  it('exige os pré-requisitos das vantagens', () => {
    expect(mensagens(erros(heroiBasico({ vantagens_valores: ['am_vorpal'] })))).toContain('AM - Vorpal exige Arma Mágica')
    expect(mensagens(erros(heroiBasico({ ph: 7, vantagens_valores: ['arma_magica', 'am_vorpal'] })))).not.toContain('exige Arma Mágica')
  })

  it('aplica restrições de raça e kit', () => {
    expect(mensagens(erros(heroiBasico({ raca_valor: 'minotauro', kit_valor: 'arqueiro' })))).toContain('proibido para Minotauro')
    expect(mensagens(erros(heroiBasico({ raca_valor: 'esqueleto', kit_valor: 'barbaro' })))).toContain('proibido para Esqueleto')
    expect(mensagens(erros(heroiBasico({ kit_valor: 'clerigo' })))).toContain('exige Clericato')
    expect(mensagens(erros(heroiBasico({ kit_valor: 'paladino' })))).toContain('exige a desvantagem Código de Honra')
    expect(mensagens(erros(heroiBasico({ raca_valor: 'ogre', vantagens_valores: ['genialidade'] })))).toContain('não pode comprar Genialidade')
    expect(mensagens(erros(heroiBasico({ kit_valor: 'fera', caracteristicas: { PdF: 2 } })))).toContain('PdF no máximo 1')
  })

  it('aplica restrições de magia da raça', () => {
    expect(mensagens(erros(heroiBasico({ raca_valor: 'construto', focus: { fogo: 1 } })))).toContain('não pode usar magia')
    expect(mensagens(erros(heroiBasico({ raca_valor: 'goblin', focus: { fogo: 3 } })))).toContain('Focus máximo 2')
    expect(mensagens(erros(heroiBasico({ raca_valor: 'goblin', focus: { fogo: 1 } })))).toContain('só pode usar magia com Clericato')
  })

  it('não deixa combinar Aparência Inofensiva com Monstruoso (nem o racial)', () => {
    expect(mensagens(erros(heroiBasico({ raca_valor: 'ogre', vantagens_valores: ['aparencia_inofensiva'] })))).toContain('Aparência Inofensiva')
  })

  it('valida magias avançadas: quantidade e requisitos', () => {
    const semFocus = heroiBasico({ magias_valores: ['bola_de_fogo'] })
    expect(mensagens(erros(semFocus))).toContain('soma dos Focus é 0')

    const focusBaixo = heroiBasico({ ph: 10, focus: { fogo: 2 }, magias_valores: ['bola_de_fogo'] })
    expect(mensagens(erros(focusBaixo))).toContain('Bola de Fogo exige Fogo 3')

    const certo = heroiBasico({ ph: 10, focus: { fogo: 3 }, magias_valores: ['bola_de_fogo'] })
    expect(mensagens(erros(certo))).not.toContain('Bola de Fogo')

    const teleporte = heroiBasico({ ph: 12, focus: { ar: 3 }, magias_valores: ['teleportacao'] })
    expect(mensagens(erros(teleporte))).toContain('Teleportação exige')
  })

  it('Cura Mágica exige Clericato ou kit Clérigo/Druida', () => {
    expect(magiaDisponivel(heroiBasico({ focus: { agua: 1 } }), 'cura_magica')).toBe(false)
    expect(magiaDisponivel(heroiBasico({ focus: { agua: 1 }, kit_valor: 'druida' }), 'cura_magica')).toBe(true)
    expect(magiaDisponivel(heroiBasico({ focus: { agua: 1 }, vantagens_valores: ['clericato'] }), 'cura_magica')).toBe(true)
  })
})

describe('calcularPvPm', () => {
  it('usa R x 5 sem kit e o multiplicador do kit', () => {
    expect(calcularPvPm(heroiBasico({ caracteristicas: { R: 2 } }))).toEqual({ pv: 10, pm: 10 })
    expect(calcularPvPm(heroiBasico({ kit_valor: 'barbaro', caracteristicas: { R: 2 } }))).toEqual({ pv: 14, pm: 6 })
    expect(calcularPvPm(heroiBasico({ kit_valor: 'mago', caracteristicas: { R: 3 } }))).toEqual({ pv: 9, pm: 18 })
  })

  it('R0 tem 1 PV e 1 PM; R vazio não calcula', () => {
    expect(calcularPvPm(heroiBasico({ caracteristicas: { R: 0 } }))).toEqual({ pv: 1, pm: 1 })
    expect(calcularPvPm(heroi())).toEqual({ pv: null, pm: null })
  })

  it('PV/PM Extras somam 10 por compra', () => {
    const h = heroiBasico({ caracteristicas: { R: 2 }, vantagens_valores: ['pontos_de_vida_extras', 'pontos_de_magia_extras'], ajustes: { pontos_de_vida_extras: 2 } })
    expect(calcularPvPm(h)).toEqual({ pv: 30, pm: 20 })
  })
})

describe('gerarTextos', () => {
  it('lista vantagens, quantidades e itens grátis de raça e kit', () => {
    const textos = gerarTextos(heroiBasico({
      raca_valor: 'anao',
      kit_valor: 'monge',
      vantagens_valores: ['armadura_extra_normal'],
      ajustes: { armadura_extra_normal: 2 },
      desvantagens_valores: ['codigo_de_honra']
    }))
    expect(textos.vantagem).toBe('Armadura Extra - Normal x2, Resistência à Magia (raça), Deflexão (kit)')
    expect(textos.desvantagem).toBe('Código de Honra')
  })

  it('acrescenta desvantagens da raça que não foram escolhidas', () => {
    expect(gerarTextos(heroiBasico({ raca_valor: 'ogre' })).desvantagem).toBe('Má Fama (raça), Modelo Especial (raça), Monstruoso (raça)')
  })

  it('lista as magias conhecidas quando o herói tem Focus', () => {
    const textos = gerarTextos(heroiBasico({ focus: { fogo: 3, ar: 1 }, magias_valores: ['bola_de_fogo'] }))
    expect(textos.magia).toBe('Magias Iniciais, Bola de Fogo')
    expect(gerarTextos(heroiBasico({ focus: { luz: 1 } })).magia).toBe('Magias Iniciais')
    expect(gerarTextos(heroiBasico()).magia).toBe('')
  })
})

describe('validarGrupo', () => {
  const comPh = (ph: number, extra = {}) => heroiBasico({ ph, ...extra })

  it('Livre não exige quantidades', () => {
    expect(validarGrupo([comPh(5)], 'livre')).toEqual([])
  })

  it('confere a quantidade de heróis por faixa (Novato: 3 de 5 e 2 de 7)', () => {
    const certo = [comPh(5), comPh(5), comPh(5), comPh(7), comPh(7)]
    expect(validarGrupo(certo, 'novato')).toEqual([])

    const faltando = mensagens(validarGrupo([comPh(5)], 'novato'))
    expect(faltando).toContain('Novato pede 3 heróis de 5 pts (tem 1)')
    expect(faltando).toContain('Novato pede 2 heróis de 7 pts (tem 0)')

    expect(mensagens(validarGrupo([...certo, comPh(10)], 'novato'))).toContain('Novato permite 0 heróis de 10 pts (tem 1)')
  })

  it('não permite o mesmo kit duas vezes na mesma faixa', () => {
    const grupo = [comPh(5, { kit_valor: 'guerreiro' }), comPh(5, { kit_valor: 'guerreiro' }), comPh(7, { kit_valor: 'guerreiro' })]
    const problemas = mensagens(validarGrupo(grupo, 'livre'))
    expect(problemas).toContain('Kit Guerreiro repetido entre heróis de 5 pts')
    expect(problemas).not.toContain('de 7 pts')
  })

  it('não permite Boa Fama e Má Fama no mesmo grupo (inclusive racial)', () => {
    const grupo = [comPh(5, { vantagens_valores: ['boa_fama'] }), comPh(5, { raca_valor: 'goblin' })]
    expect(mensagens(validarGrupo(grupo, 'livre'))).toContain('Boa Fama')
  })
})
