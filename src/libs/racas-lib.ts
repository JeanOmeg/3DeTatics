import { IComboBox } from 'src/interfaces/combobox-interface'
import { IRaca } from 'src/interfaces/raca-interface'

export namespace RacasLib {

  export function listarRacas () {
    const racas: IRaca[] = [
      {
        nome: 'Humano',
        custo: 0,
        vantangens: [],
        desvantagens: [],
        value: 'humano'
      },
      {
        nome: 'Anão',
        custo: 2,
        vantangens: ['Infravisão', ' Resistência à magia', 'R+1 em teste', 'H+1 contra inimigo'],
        desvantagens: ['-2" movimento'],
        value: 'anao'
      },
      {
        nome: 'Centauro',
        custo: 2,
        vantangens: ['F+1 em teste(cavalo)', '+2" movimento', '2x Ataque (F + 1D6)'],
        desvantagens: [],
        value: 'centauro'
      },
      {
        nome: 'Elfo',
        custo: 2,
        vantangens: ['Infravisão', 'H+1 (max 5)', 'FA+1 corte/perfuração'],
        desvantagens: ['R-1 em teste'],
        value: 'elfo'
      },
      {
        nome: 'Esqueleto',
        custo: -2,
        vantangens: ['Armadura extra (corte/perfuração)', 'Invulnerabilidade (frio/gelo)', 'Imune magia mental'],
        desvantagens: ['Não pode recuperar HP', 'Não pode ser ressuscitado', 'Não pode usar magia ou gastar PM'],
        value: 'esqueleto'
      },
      {
        nome: 'Goblin',
        custo: -2,
        vantangens: ['Pode comprar Crime por 1pt', 'Infravisão'],
        desvantagens: ['Má fama', 'Não pode ser mago', 'Focus máximo 2 com Clericato', 'Não pode ter focus em luz'],
        value: 'goblin'
      },
      {
        nome: 'Halfling',
        custo: 2,
        vantangens: ['H+1', 'PdF+1', ' Resistência à magia', 'Pode comprar Crime por 1pt'],
        desvantagens: ['Modelo especial'],
        value: 'halfling'
      },
      {
        nome: 'Licantropo',
        custo: 0,
        vantangens: ['F+1 transformado', 'A+1 transformado'],
        desvantagens: ['Fúria (ativa transformação)', 'Monstruoso', 'Vulnerabilidade magia/armas mágicas'],
        value: 'licantropo'
      },
      {
        nome: 'Meio-orc',
        custo: -1,
        vantangens: ['F+1', 'Infravisão'],
        desvantagens: ['Má fama', 'Não pode comprar genialidade/memoria expandida'],
        value: ''
      }
    ]

    return racas
  }

  export function listarRacasCombo () {
    const combo: IComboBox[] = listarRacas().map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
