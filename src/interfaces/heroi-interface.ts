export interface IHeroi {
  name: string
  ponto: number
  raca: string
  kit: string
  caracteristicas: { [key: string]: number }
  vantagem: string
  desvantagem: string
  tipo_de_dano_f: string
  tipo_de_dano_pdf: string
}
