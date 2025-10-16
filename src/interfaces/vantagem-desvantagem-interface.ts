import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'

export interface IVantagemDesvantagem {
  nome: string
  custo: string
  descricao: string
  value: string
  tipo: TipoVantagemEnum
}
