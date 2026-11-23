import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'
import type { TCategoriaRaca } from 'src/interfaces/raca-interface'

export interface IKit {
  nome: string
  custo: number
  restricoes: string
  vantagens: string[]
  desvantagens: string[]
  pv: string
  pm: string
  value: string

  // Dados para a calculadora de pontos e as validações.
  multiplicadorPv: number
  multiplicadorPm: number
  // Custo diferente para certas raças (pelo `value` da raça).
  custoPorRaca?: Record<string, number>
  // Bônus nas Características (até o máximo de 5).
  bonus?: Partial<Record<TCaracteristicaKey, number>>
  // Vantagens recebidas de graça (pelo `value`).
  vantagensGratis?: string[]
  // Vantagens com custo reduzido para este kit: `value` -> custo em pontos.
  descontos?: Record<string, number>
  // Desvantagens do kit (pelo `value`): não dão pontos nem contam no limite.
  desvantagensDoKit?: string[]
  // Restrições de raça.
  racasProibidas?: string[]
  categoriasProibidas?: TCategoriaRaca[]
  // Exige estas vantagens/desvantagens compradas pelo jogador (pelo `value`).
  exigeVantagens?: string[]
  exigeDesvantagens?: string[]
  // Vantagens que o kit não pode comprar (pelo `value`).
  vantagensProibidas?: string[]
  pdfMaximo?: number
}
