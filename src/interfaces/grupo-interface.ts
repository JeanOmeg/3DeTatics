import type { IHeroi } from 'src/interfaces/heroi-interface'

export type TTamanhoGrupo = 'livre' | 'novato' | 'lutador' | 'campeao' | 'lenda'

export interface IGrupo {
  id: string
  nome: string
  herois: IHeroi[]
  tamanho: TTamanhoGrupo
  versao: number
  criadoEm: string
  atualizadoEm: string
}
