import type { TCaracteristicaKey } from 'src/types/caracteristica-key-type'

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
}
