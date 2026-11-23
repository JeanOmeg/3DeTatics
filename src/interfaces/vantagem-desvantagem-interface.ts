import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'

export interface IVantagemDesvantagem {
  nome: string
  // Texto do custo exibido nas páginas de regras (ex.: "1 ou 2 pontos").
  custo: string
  descricao: string
  value: string
  tipo: TipoVantagemEnum

  // Dados para a calculadora de pontos.
  // Custo padrão em pontos (negativo para desvantagens).
  pontos: number
  // Pode ser comprada várias vezes (o custo é multiplicado pela quantidade).
  repetivel?: boolean
  // Custos possíveis, à escolha do jogador (ex.: Energia Extra 1 ou 2).
  opcoes?: number[]
  // Exige ter estas vantagens (pelo `value`).
  requer?: string[]
}
