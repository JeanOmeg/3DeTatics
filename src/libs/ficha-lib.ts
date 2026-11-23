import type { IHeroi } from 'src/interfaces/heroi-interface'
import type { TTamanhoGrupo } from 'src/interfaces/grupo-interface'
import type { IKit } from 'src/interfaces/kit-interface'
import type { IRaca } from 'src/interfaces/raca-interface'
import type { IVantagemDesvantagem } from 'src/interfaces/vantagem-desvantagem-interface'
import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'
import { CAMINHOS, type TCaminho } from 'src/types/caminho-type'
import { RacasLib } from 'src/libs/racas-lib'
import { KitsLib } from 'src/libs/kits-lib'
import { MagiasLib } from 'src/libs/magias-lib'
import { VantagensEDesvantagensLib } from 'src/libs/vantagens-lib'

// =============================================================================
// Calculadora de pontos, PV/PM automáticos, texto da carta e validações.
// Os limites do jogo ficam nas tabelas abaixo para facilitar ajustes de balanceamento.
// =============================================================================

export const CARACTERISTICAS: TCaracteristicaKey[] = ['F', 'H', 'R', 'A', 'PdF']

export const FAIXAS_DE_PONTOS = [5, 7, 10, 12]

// Limite de pontos COMPRADOS em cada Característica e Focus, por faixa de PH.
// `vantagens`: número máximo de Vantagens compradas (sem contar as gratuitas).
export const LIMITES_POR_FAIXA: Record<number, { caracteristica: number, vantagens?: number }> = {
  5: { caracteristica: 3, vantagens: 2 },
  7: { caracteristica: 4 },
  10: { caracteristica: 5 },
  12: { caracteristica: 5 }
}

// Nenhuma Característica ou Focus final passa de 5 em heróis recém-criados.
export const VALOR_MAXIMO = 5

export const LIMITE_DESVANTAGENS = { quantidade: 3, pontos: -6 }

export const MULTIPLICADOR_PADRAO = 5
export const BONUS_PV_PM_EXTRAS = 10

export const TAMANHOS_GRUPO: Record<TTamanhoGrupo, { nome: string, herois?: Record<number, number> }> = {
  livre: { nome: 'Livre (sem limites)' },
  novato: { nome: 'Novato', herois: { 5: 3, 7: 2 } },
  lutador: { nome: 'Lutador', herois: { 5: 3, 7: 2, 10: 2 } },
  campeao: { nome: 'Campeão', herois: { 5: 3, 7: 3, 10: 3, 12: 1 } },
  lenda: { nome: 'Lenda', herois: { 5: 3, 7: 3, 10: 3, 12: 3 } }
}

export type TNivelProblema = 'erro' | 'aviso'

export interface IProblema {
  nivel: TNivelProblema
  mensagem: string
}

export interface IItemCusto {
  rotulo: string
  pontos: number
}

export interface ICalculoHeroi {
  pontos: number
  itens: IItemCusto[]
  pv: number | null
  pm: number | null
  focusTotal: number
  problemas: IProblema[]
}

// -----------------------------------------------------------------------------
// Utilidades
// -----------------------------------------------------------------------------

function numero (valor: number | null | undefined): number {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : 0
}

function nomeDe (value: string): string {
  return VantagensEDesvantagensLib.obter(value)?.nome ?? value
}

interface IContexto {
  heroi: IHeroi
  raca: IRaca | undefined
  kit: IKit | undefined
  vantagens: IVantagemDesvantagem[]
  desvantagens: IVantagemDesvantagem[]
  gratis: Set<string>
  desvantagensForaDaConta: Set<string>
}

function montarContexto (heroi: IHeroi): IContexto {
  const raca = heroi.raca_valor ? RacasLib.obter(heroi.raca_valor) : undefined
  const kit = heroi.kit_valor ? KitsLib.obter(heroi.kit_valor) : undefined
  const listar = (valores: string[]) => valores
    .map(valor => VantagensEDesvantagensLib.obter(valor))
    .filter((item): item is IVantagemDesvantagem => item !== undefined)

  return {
    heroi,
    raca,
    kit,
    vantagens: listar(heroi.vantagens_valores),
    desvantagens: listar(heroi.desvantagens_valores),
    gratis: new Set([...(raca?.vantagensGratis ?? []), ...(kit?.vantagensGratis ?? [])]),
    desvantagensForaDaConta: new Set([...(raca?.desvantagensRaciais ?? []), ...(kit?.desvantagensDoKit ?? [])])
  }
}

// Tem a vantagem comprada ou recebida de graça (raça/kit)?
function temVantagem (ctx: IContexto, value: string): boolean {
  return ctx.gratis.has(value) || ctx.heroi.vantagens_valores.includes(value)
}

function temDesvantagem (ctx: IContexto, value: string): boolean {
  return ctx.desvantagensForaDaConta.has(value) || ctx.heroi.desvantagens_valores.includes(value)
}

function quantidade (ctx: IContexto, item: IVantagemDesvantagem): number {
  return item.repetivel ? Math.max(1, numero(ctx.heroi.ajustes[item.value]) || 1) : 1
}

// Custo de uma vantagem/desvantagem escolhida pelo jogador.
function custoDoItem (ctx: IContexto, item: IVantagemDesvantagem): number {
  if (ctx.gratis.has(item.value) || ctx.desvantagensForaDaConta.has(item.value)) {
    return 0
  }

  const base = ctx.kit?.descontos?.[item.value] ?? item.pontos

  if (item.opcoes) {
    const escolhido = ctx.heroi.ajustes[item.value]
    return typeof escolhido === 'number' && item.opcoes.includes(escolhido) ? escolhido : base
  }

  return base * quantidade(ctx, item)
}

function bonusCaracteristica (ctx: IContexto, key: TCaracteristicaKey): number {
  return numero(ctx.raca?.bonus?.[key]) + numero(ctx.kit?.bonus?.[key])
}

function bonusFocus (ctx: IContexto, caminho: TCaminho): number {
  const arcano = VantagensEDesvantagensLib.obter('arcano')
  const niveisArcano = arcano && ctx.heroi.vantagens_valores.includes('arcano') ? quantidade(ctx, arcano) : 0
  return numero(ctx.raca?.bonusFocus?.[caminho]) + niveisArcano
}

export function multiplicadoresPvPm (heroi: IHeroi): { pv: number, pm: number } {
  const kit = heroi.kit_valor ? KitsLib.obter(heroi.kit_valor) : undefined
  return {
    pv: kit?.multiplicadorPv ?? MULTIPLICADOR_PADRAO,
    pm: kit?.multiplicadorPm ?? MULTIPLICADOR_PADRAO
  }
}

// -----------------------------------------------------------------------------
// Bônus automáticos na carta (raça, kit e Arcano)
// -----------------------------------------------------------------------------

export interface IBonusFicha {
  caracteristicas: Record<TCaracteristicaKey, number>
  focus: Record<TCaminho, number>
}

// Bônus que a raça, o kit e o Arcano dão nas Características e no Focus do herói.
export function bonusDaFicha (heroi: IHeroi): IBonusFicha {
  const ctx = montarContexto(heroi)

  return {
    caracteristicas: Object.fromEntries(CARACTERISTICAS.map(key => [key, bonusCaracteristica(ctx, key)])) as Record<TCaracteristicaKey, number>,
    focus: Object.fromEntries(CAMINHOS.map(caminho => [caminho.key, bonusFocus(ctx, caminho.key)])) as Record<TCaminho, number>
  }
}

function ajustarValor (atual: number | null, diferenca: number): number | null {
  if (!diferenca) return atual
  // Valor vazio só é preenchido quando o bônus aumenta
  if (atual === null && diferenca < 0) return null
  // Tirar exatamente o que o bônus tinha colocado deixa o campo vazio de novo
  if (diferenca < 0 && atual === -diferenca) return null
  return Math.min(VALOR_MAXIMO, Math.max(0, numero(atual) + diferenca))
}

// Ao trocar de raça ou kit (ou mudar o Arcano), tira o bônus antigo e aplica o novo
// nos valores da carta. Ex.: escolher Elfo soma H+1; trocar Elfo por Humano tira o H+1.
export function aplicarDiferencaDeBonus (heroi: IHeroi, antes: IBonusFicha, depois: IBonusFicha): void {
  for (const key of CARACTERISTICAS) {
    const novo = ajustarValor(heroi.caracteristicas[key], depois.caracteristicas[key] - antes.caracteristicas[key])
    if (novo !== heroi.caracteristicas[key]) heroi.caracteristicas[key] = novo
  }

  for (const caminho of CAMINHOS) {
    const novo = ajustarValor(heroi.focus[caminho.key], depois.focus[caminho.key] - antes.focus[caminho.key])
    if (novo !== heroi.focus[caminho.key]) heroi.focus[caminho.key] = novo
  }
}

// -----------------------------------------------------------------------------
// PV e PM automáticos
// -----------------------------------------------------------------------------

export function calcularPvPm (heroi: IHeroi): { pv: number | null, pm: number | null } {
  const r = heroi.caracteristicas.R

  if (r === null || r === undefined) {
    return { pv: null, pm: null }
  }

  const ctx = montarContexto(heroi)
  const mult = multiplicadoresPvPm(heroi)
  const extras = (value: string) => {
    const item = VantagensEDesvantagensLib.obter(value)
    return item && heroi.vantagens_valores.includes(value) ? quantidade(ctx, item) * BONUS_PV_PM_EXTRAS : 0
  }

  return {
    pv: (r <= 0 ? 1 : r * mult.pv) + extras('pontos_de_vida_extras'),
    pm: (r <= 0 ? 1 : r * mult.pm) + extras('pontos_de_magia_extras')
  }
}

// -----------------------------------------------------------------------------
// Texto da carta (gerado a partir das escolhas do Assistente)
// -----------------------------------------------------------------------------

function rotuloDoItem (ctx: IContexto, item: IVantagemDesvantagem): string {
  if (item.repetivel && quantidade(ctx, item) > 1) {
    return `${item.nome} x${quantidade(ctx, item)}`
  }

  if (item.opcoes && typeof ctx.heroi.ajustes[item.value] === 'number') {
    return `${item.nome} (${Math.abs(ctx.heroi.ajustes[item.value] ?? 0)})`
  }

  return item.nome
}

export function gerarTextos (heroi: IHeroi): { vantagem: string, desvantagem: string, magia: string } {
  const ctx = montarContexto(heroi)

  const vantagens = ctx.vantagens.map(item => rotuloDoItem(ctx, item))
  for (const value of ctx.raca?.vantagensGratis ?? []) {
    if (!heroi.vantagens_valores.includes(value)) vantagens.push(`${nomeDe(value)} (raça)`)
  }
  for (const value of ctx.kit?.vantagensGratis ?? []) {
    if (!heroi.vantagens_valores.includes(value)) vantagens.push(`${nomeDe(value)} (kit)`)
  }

  const desvantagens = ctx.desvantagens.map(item => rotuloDoItem(ctx, item))
  for (const value of ctx.raca?.desvantagensRaciais ?? []) {
    if (!heroi.desvantagens_valores.includes(value)) desvantagens.push(`${nomeDe(value)} (raça)`)
  }
  for (const value of ctx.kit?.desvantagensDoKit ?? []) {
    if (!heroi.desvantagens_valores.includes(value)) desvantagens.push(`${nomeDe(value)} (kit)`)
  }

  // O Focus tem linha própria na carta; o bloco Magias lista só as magias conhecidas.
  const temFocus = CAMINHOS.some(caminho => numero(heroi.focus[caminho.key]) > 0)

  let magia = ''
  if (temFocus) {
    const avancadas = heroi.magias_valores
      .map(value => MagiasLib.obter(value)?.nome)
      .filter((nome): nome is string => Boolean(nome))
    magia = ['Magias Iniciais', ...avancadas].join(', ')
  }

  return {
    vantagem: vantagens.join(', '),
    desvantagem: desvantagens.join(', '),
    magia
  }
}

// -----------------------------------------------------------------------------
// Pontos e validações do herói
// -----------------------------------------------------------------------------

function cumpreRequisitoMagia (ctx: IContexto, value: string): { focus: boolean, extra: boolean } {
  const requisito = MagiasLib.requisitos(value)
  const focus = requisito.alternativas.some(alternativa =>
    Object.entries(alternativa).every(([caminho, minimo]) => numero(ctx.heroi.focus[caminho as TCaminho]) >= numero(minimo))
  )
  const exigeExtra = Boolean(requisito.vantagens?.length || requisito.kits?.length)
  const extra = !exigeExtra ||
    (requisito.vantagens ?? []).some(v => temVantagem(ctx, v)) ||
    (requisito.kits ?? []).includes(ctx.heroi.kit_valor)

  return { focus, extra }
}

export function calcularHeroi (heroi: IHeroi): ICalculoHeroi {
  const ctx = montarContexto(heroi)
  const itens: IItemCusto[] = []
  const problemas: IProblema[] = []
  const erro = (mensagem: string) => problemas.push({ nivel: 'erro', mensagem })
  const aviso = (mensagem: string) => problemas.push({ nivel: 'aviso', mensagem })

  const ph = heroi.ph
  const limite = ph !== null ? LIMITES_POR_FAIXA[ph] : undefined

  // Características (paga-se só o que foi comprado; bônus de raça e kit são gratuitos)
  let pontosCaracteristicas = 0
  for (const key of CARACTERISTICAS) {
    const final = numero(heroi.caracteristicas[key])
    const comprado = Math.max(0, final - bonusCaracteristica(ctx, key))
    pontosCaracteristicas += comprado

    if (final > VALOR_MAXIMO) {
      erro(`${key} ${final} passa do máximo de ${VALOR_MAXIMO}.`)
    }
    if (limite && comprado > limite.caracteristica) {
      erro(`${key} comprada (${comprado}) passa do limite de ${limite.caracteristica} para heróis de ${ph} pts.`)
    }
  }
  if (ctx.kit?.pdfMaximo !== undefined && numero(heroi.caracteristicas.PdF) > ctx.kit.pdfMaximo) {
    erro(`O kit ${ctx.kit.nome} permite PdF no máximo ${ctx.kit.pdfMaximo}.`)
  }
  itens.push({ rotulo: 'Características', pontos: pontosCaracteristicas })

  // Focus (Arcano e raça dão níveis grátis; Clericato dá 1 nível grátis em um Caminho)
  let pontosFocus = 0
  let focusTotal = 0
  for (const caminho of CAMINHOS) {
    const final = numero(heroi.focus[caminho.key])
    const comprado = Math.max(0, final - bonusFocus(ctx, caminho.key))
    focusTotal += final
    pontosFocus += comprado

    if (final > VALOR_MAXIMO) {
      erro(`Focus em ${caminho.label} (${final}) passa do máximo de ${VALOR_MAXIMO}.`)
    }
    if (limite && comprado > limite.caracteristica) {
      erro(`Focus comprado em ${caminho.label} (${comprado}) passa do limite de ${limite.caracteristica} para heróis de ${ph} pts.`)
    }
    if (ctx.raca?.focusMaximo !== undefined && final > ctx.raca.focusMaximo) {
      erro(`${ctx.raca.nome} tem Focus máximo ${ctx.raca.focusMaximo}.`)
    }
  }
  if (temVantagem(ctx, 'clericato') && pontosFocus > 0) {
    pontosFocus -= 1
  }
  if (pontosFocus > 0) {
    itens.push({ rotulo: 'Focus', pontos: pontosFocus })
  }

  // Raça
  if (ctx.raca) {
    itens.push({ rotulo: `Raça: ${ctx.raca.nome}`, pontos: ctx.raca.custo })
  }

  // Kit
  if (ctx.kit) {
    const custoKit = ctx.kit.custoPorRaca?.[heroi.raca_valor] ?? ctx.kit.custo
    itens.push({ rotulo: `Kit: ${ctx.kit.nome}`, pontos: custoKit })

    const categoria = ctx.raca?.categoria ?? 'vivo'
    if (ctx.kit.racasProibidas?.includes(heroi.raca_valor)) {
      erro(`O kit ${ctx.kit.nome} é proibido para ${ctx.raca?.nome ?? 'esta raça'}.`)
    }
    if (ctx.kit.categoriasProibidas?.includes(categoria)) {
      erro(`O kit ${ctx.kit.nome} é proibido para ${ctx.raca?.nome ?? 'esta raça'}.`)
    }
    for (const value of ctx.kit.exigeVantagens ?? []) {
      if (!temVantagem(ctx, value)) erro(`O kit ${ctx.kit.nome} exige ${nomeDe(value)}.`)
    }
    for (const value of ctx.kit.exigeDesvantagens ?? []) {
      if (!heroi.desvantagens_valores.includes(value)) erro(`O kit ${ctx.kit.nome} exige a desvantagem ${nomeDe(value)}.`)
    }
    for (const value of ctx.kit.vantagensProibidas ?? []) {
      if (temVantagem(ctx, value)) erro(`O kit ${ctx.kit.nome} não pode ter ${nomeDe(value)}.`)
    }
  }

  // Vantagens
  let quantidadeVantagens = 0
  for (const item of ctx.vantagens) {
    const pontos = custoDoItem(ctx, item)
    const gratis = ctx.gratis.has(item.value)
    itens.push({ rotulo: gratis ? `${item.nome} (grátis)` : rotuloDoItem(ctx, item), pontos })
    if (!gratis && pontos > 0) quantidadeVantagens += 1

    for (const requisito of item.requer ?? []) {
      if (!temVantagem(ctx, requisito)) erro(`${item.nome} exige ${nomeDe(requisito)}.`)
    }
    if (ctx.raca?.vantagensProibidas?.includes(item.value)) {
      erro(`${ctx.raca.nome} não pode comprar ${item.nome}.`)
    }
    if (item.opcoes && typeof heroi.ajustes[item.value] !== 'number') {
      aviso(`Escolha o custo de ${item.nome} no Assistente (${item.opcoes.join(' ou ')} pontos).`)
    }
  }
  if (limite?.vantagens !== undefined && quantidadeVantagens > limite.vantagens) {
    erro(`Heróis de ${ph} pts podem ter no máximo ${limite.vantagens} Vantagens compradas (tem ${quantidadeVantagens}).`)
  }

  // Desvantagens (as da raça e do kit não dão pontos nem contam no limite)
  let quantidadeDesvantagens = 0
  let pontosDesvantagens = 0
  for (const item of ctx.desvantagens) {
    const pontos = custoDoItem(ctx, item)
    const doKitOuRaca = ctx.desvantagensForaDaConta.has(item.value)
    itens.push({ rotulo: doKitOuRaca ? `${item.nome} (raça/kit)` : rotuloDoItem(ctx, item), pontos })

    if (!doKitOuRaca) {
      quantidadeDesvantagens += 1
      pontosDesvantagens += pontos
    }
    if (item.opcoes && typeof heroi.ajustes[item.value] !== 'number') {
      aviso(`Escolha o valor de ${item.nome} no Assistente (${item.opcoes.join(' ou ')} pontos).`)
    }
  }
  if (quantidadeDesvantagens > LIMITE_DESVANTAGENS.quantidade) {
    erro(`No máximo ${LIMITE_DESVANTAGENS.quantidade} Desvantagens (tem ${quantidadeDesvantagens}).`)
  }
  if (pontosDesvantagens < LIMITE_DESVANTAGENS.pontos) {
    erro(`Desvantagens valem no máximo ${LIMITE_DESVANTAGENS.pontos} pontos (somam ${pontosDesvantagens}).`)
  }

  // Combinações proibidas e pré-requisitos de desvantagens
  if (temVantagem(ctx, 'aparencia_inofensiva') && temDesvantagem(ctx, 'monstruoso')) {
    erro('Aparência Inofensiva não pode ser combinada com Monstruoso.')
  }
  if (heroi.desvantagens_valores.includes('restricao_de_magia') && focusTotal < 3) {
    erro('Restrição de Magia exige pelo menos 3 pontos em Focus.')
  }
  if (heroi.desvantagens_valores.includes('fetiche') && focusTotal === 0) {
    erro('Fetiche só pode ser escolhido por heróis com Focus.')
  }
  if (heroi.desvantagens_valores.includes('curto_circuito') && ctx.raca?.categoria !== 'construto') {
    erro('Curto-Circuito é apenas para Construtos.')
  }

  // Magia
  if (focusTotal > 0) {
    if (ctx.raca?.semMagia) {
      erro(`${ctx.raca.nome} não pode usar magia (tem Focus).`)
    }
    if (ctx.raca?.magiaExigeClericato && !temVantagem(ctx, 'clericato')) {
      erro(`${ctx.raca.nome} só pode usar magia com Clericato.`)
    }
  }
  if (heroi.magias_valores.length > focusTotal) {
    erro(`Magias Avançadas: ${heroi.magias_valores.length} escolhidas, mas a soma dos Focus é ${focusTotal}.`)
  }
  for (const value of heroi.magias_valores) {
    const magia = MagiasLib.obter(value)
    if (!magia) continue
    const cumpre = cumpreRequisitoMagia(ctx, value)
    if (!cumpre.focus) erro(`${magia.nome} exige ${magia.requisito}.`)
    else if (!cumpre.extra) erro(`${magia.nome}: requisito não cumprido (${magia.requisito}).`)
  }

  const pontos = itens.reduce((total, item) => total + item.pontos, 0)

  // PH
  if (ph === null) {
    aviso('Defina o PH do herói (5, 7, 10 ou 12).')
  } else {
    if (!FAIXAS_DE_PONTOS.includes(ph)) {
      aviso(`PH ${ph} não é uma faixa do jogo (5, 7, 10 ou 12).`)
    }
    if (pontos > ph) {
      erro(`Usa ${pontos} pontos: ${pontos - ph} a mais que o PH (${ph}).`)
    } else if (pontos < ph) {
      aviso(`Sobram ${ph - pontos} ${ph - pontos === 1 ? 'ponto' : 'pontos'} para gastar.`)
    }
  }

  const pvPm = calcularPvPm(heroi)

  return { pontos, itens, pv: pvPm.pv, pm: pvPm.pm, focusTotal, problemas }
}

// Magias Avançadas que o herói pode escolher agora (cumpre o Focus e os extras).
export function magiaDisponivel (heroi: IHeroi, value: string): boolean {
  const cumpre = cumpreRequisitoMagia(montarContexto(heroi), value)
  return cumpre.focus && cumpre.extra
}

// -----------------------------------------------------------------------------
// Montagem automática do grupo pelo tamanho
// -----------------------------------------------------------------------------

// Herói ainda não preenchido (pode ser removido sem perder nada).
export function heroiVazio (heroi: IHeroi): boolean {
  return !heroi.name.trim() &&
    !heroi.raca.trim() && !heroi.kit.trim() &&
    !heroi.vantagem.trim() && !heroi.desvantagem.trim() &&
    !heroi.raca_valor && !heroi.kit_valor &&
    CARACTERISTICAS.every(key => heroi.caracteristicas[key] === null) &&
    CAMINHOS.every(caminho => heroi.focus[caminho.key] === null)
}

export interface IAjusteDeGrupo {
  herois: IHeroi[]
  adicionados: number
  removidos: number
}

// Deixa o grupo com a quantidade de heróis de cada faixa pedida pelo tamanho:
// 1. heróis sem PH preenchem as vagas que faltam;
// 2. cartas novas são criadas para o restante, já com o PH da faixa;
// 3. cartas VAZIAS que sobram são removidas (cartas preenchidas nunca são apagadas);
// 4. as cartas ficam em ordem de PH.
export function ajustarGrupoAoTamanho (herois: IHeroi[], tamanho: TTamanhoGrupo, criarHeroi: () => IHeroi): IAjusteDeGrupo {
  const regras = TAMANHOS_GRUPO[tamanho].herois

  if (!regras) {
    return { herois, adicionados: 0, removidos: 0 }
  }

  const lista = [...herois]
  const faixas = Object.keys(regras).map(Number).sort((a, b) => a - b)
  const contar = (ph: number) => lista.filter(heroi => heroi.ph === ph).length
  let adicionados = 0
  let removidos = 0

  for (const faixa of faixas) {
    let faltam = (regras[faixa] ?? 0) - contar(faixa)

    for (const heroi of lista) {
      if (faltam <= 0) break
      if (heroi.ph === null) {
        heroi.ph = faixa
        faltam -= 1
      }
    }

    for (; faltam > 0; faltam -= 1) {
      lista.push({ ...criarHeroi(), ph: faixa })
      adicionados += 1
    }
  }

  const faixasPresentes = new Set(lista.map(heroi => heroi.ph))
  for (const faixa of faixasPresentes) {
    if (faixa === null) continue
    let sobram = contar(faixa) - (regras[faixa] ?? 0)

    for (let i = lista.length - 1; i >= 0 && sobram > 0; i -= 1) {
      const heroi = lista[i]
      if (heroi && heroi.ph === faixa && heroiVazio(heroi)) {
        lista.splice(i, 1)
        removidos += 1
        sobram -= 1
      }
    }
  }

  // Ordem por PH (sem PH por último), mantendo a ordem dentro de cada faixa
  const ordenada = lista
    .map((heroi, indice) => ({ heroi, indice }))
    .sort((a, b) => (a.heroi.ph ?? Infinity) - (b.heroi.ph ?? Infinity) || a.indice - b.indice)
    .map(item => item.heroi)

  return { herois: ordenada, adicionados, removidos }
}

// -----------------------------------------------------------------------------
// Validações do grupo
// -----------------------------------------------------------------------------

export function validarGrupo (herois: IHeroi[], tamanho: TTamanhoGrupo): IProblema[] {
  const problemas: IProblema[] = []
  const regras = TAMANHOS_GRUPO[tamanho]

  // Quantidade de heróis por faixa
  if (regras.herois) {
    const semPh = herois.filter(heroi => heroi.ph === null).length
    if (semPh) {
      problemas.push({ nivel: 'aviso', mensagem: `${semPh} ${semPh === 1 ? 'herói está' : 'heróis estão'} sem PH.` })
    }

    const faixas = new Set([...Object.keys(regras.herois).map(Number), ...herois.map(heroi => heroi.ph).filter((ph): ph is number => ph !== null)])
    for (const faixa of [...faixas].sort((a, b) => a - b)) {
      const esperado = regras.herois[faixa] ?? 0
      const atual = herois.filter(heroi => heroi.ph === faixa).length
      if (atual > esperado) {
        problemas.push({ nivel: 'erro', mensagem: `${regras.nome} permite ${esperado} ${esperado === 1 ? 'herói' : 'heróis'} de ${faixa} pts (tem ${atual}).` })
      } else if (atual < esperado) {
        problemas.push({ nivel: 'aviso', mensagem: `${regras.nome} pede ${esperado} heróis de ${faixa} pts (tem ${atual}).` })
      }
    }
  }

  // Kit repetido na mesma faixa de pontos
  const vistos = new Map<string, number>()
  for (const heroi of herois) {
    if (!heroi.kit_valor || heroi.ph === null) continue
    const chave = `${heroi.ph}|${heroi.kit_valor}`
    vistos.set(chave, (vistos.get(chave) ?? 0) + 1)
  }
  for (const [chave, total] of vistos) {
    if (total > 1) {
      const [ph, kit] = chave.split('|')
      problemas.push({ nivel: 'erro', mensagem: `Kit ${KitsLib.obter(kit ?? '')?.nome ?? kit} repetido entre heróis de ${ph} pts.` })
    }
  }

  // Boa Fama x Má Fama no mesmo grupo
  const contextos = herois.map(montarContexto)
  if (contextos.some(ctx => temVantagem(ctx, 'boa_fama')) && contextos.some(ctx => temDesvantagem(ctx, 'ma_fama'))) {
    problemas.push({ nivel: 'erro', mensagem: 'Um herói tem Boa Fama e outro tem Má Fama no mesmo grupo.' })
  }

  return problemas
}
