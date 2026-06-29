import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'

export interface IHeroi {
  id: string
  name: string
  ph: number
  pv: number
  pm: number
  raca: string
  kit: string
  caracteristicas: Record<TCaracteristicaKey, number>
  vantagem: string
  desvantagem: string
  tipo_de_dano_f: string
  tipo_de_dano_pdf: string
}
