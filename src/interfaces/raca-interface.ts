import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'
import type { TCaminho } from 'src/types/caminho-type'

export type TCategoriaRaca = 'vivo' | 'construto' | 'morto_vivo'

export interface IRaca {
  nome: string
  custo: number
  vantagens: string[]
  desvantagens: string[]
  value: string

  // Dados para a calculadora de pontos e as validações.
  categoria: TCategoriaRaca
  // Bônus nas Características (nunca levam a Característica acima de 5).
  bonus?: Partial<Record<TCaracteristicaKey, number>>
  // Bônus de Focus.
  bonusFocus?: Partial<Record<TCaminho, number>>
  // Vantagens recebidas de graça (pelo `value`).
  vantagensGratis?: string[]
  // Desvantagens da raça (pelo `value`): não dão pontos nem contam no limite.
  desvantagensRaciais?: string[]
  // Restrições de magia.
  semMagia?: boolean
  focusMaximo?: number
  magiaExigeClericato?: boolean
  // Vantagens que a raça não pode comprar (pelo `value`).
  vantagensProibidas?: string[]
}
