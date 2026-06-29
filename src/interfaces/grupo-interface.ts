import type { IHeroi } from 'src/interfaces/heroi-interface'

export interface IGrupo {
  id: string
  nome: string
  herois: IHeroi[]
  criadoEm: string
}
