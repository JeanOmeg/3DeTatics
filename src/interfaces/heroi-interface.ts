export interface IHeroi {
  name: string
  ponto: number | null
  raca: string | null
  kit: []
  caracteristicas: { [key: string]: number | null }
  vantagem: []
  desvantagem: []
}
