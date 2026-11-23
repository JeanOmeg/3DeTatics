import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'
import type { TCaminho } from 'src/types/caminho-type'

export interface IHeroi {
  id: string
  name: string
  ph: number | null
  pv: number | null
  pm: number | null
  raca: string
  kit: string
  caracteristicas: Record<TCaracteristicaKey, number | null>
  vantagem: string
  desvantagem: string
  tipo_de_dano_f: string
  tipo_de_dano_pdf: string

  // Escolhas feitas no Assistente (guardadas pelo `value` de cada lista),
  // para que o assistente reabra com a mesma seleção.
  raca_valor: string
  kit_valor: string
  vantagens_valores: string[]
  desvantagens_valores: string[]

  // Focus por Caminho (valor final, já com bônus) e magias avançadas escolhidas.
  focus: Record<TCaminho, number | null>
  magias_valores: string[]
  // Texto de magias impresso na carta.
  magia: string

  // Ajustes de vantagens com custo variável: `value` -> quantidade (repetíveis)
  // ou custo escolhido (vantagens com opções de custo).
  ajustes: Record<string, number>

  // Quando falso, PV e PM são calculados automaticamente (R x multiplicador do kit).
  pv_pm_manual: boolean
}

// Herói guardado na coleção `herois` (Meus Heróis).
export interface IHeroiSalvo extends IHeroi {
  versao: number
  criadoEm: string
  atualizadoEm: string
}
