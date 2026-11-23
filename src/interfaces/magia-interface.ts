import type { TCaminho } from 'src/types/caminho-type'

// Uma alternativa de requisito: todos os Caminhos listados com pelo menos o Focus indicado.
export type TRequisitoFocus = Partial<Record<TCaminho, number>>

export interface IMagia {
  nome: string
  value: string
  requisito: string
  custo: string
  alcance: string
  duracao: string
  descricao: string
  inicial: boolean
}

// Requisitos estruturados, usados para validar a ficha.
export interface IRequisitoMagia {
  // Basta cumprir UMA das alternativas.
  alternativas: TRequisitoFocus[]
  // Além do Focus, exige ter uma destas vantagens OU um destes kits (pelo `value`).
  vantagens?: string[]
  kits?: string[]
}
