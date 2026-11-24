import { RacaEnum } from 'src/enums/raca-enum'
import { IComboBox } from 'src/interfaces/combobox-interface'
import { IRaca } from 'src/interfaces/raca-interface'

// Raças (Vantagens e Desvantagens Únicas) adaptadas para o skirmish.
// Cada herói pode ter apenas uma raça. Bônus raciais nunca levam uma
// Característica acima de 5 em heróis recém-criados.
// Os campos estruturados (bonus, vantagensGratis, desvantagensRaciais...)
// alimentam a calculadora de pontos; os textos são o que aparece nas páginas.

const DESCONTO_PERICIAS = { pericia_crime: 1, pericia_esporte: 1, pericia_sobrevivencia: 1 }

const RACAS: IRaca[] = [
  {
    nome: 'Anão',
    custo: 2,
    vantagens: ['Infravisão', 'Resistência à Magia', 'R+1 em testes', 'H+1 contra Goblins, Meio-Orcs e Ogres'],
    desvantagens: ['-2" de movimento'],
    value: RacaEnum.anao,
    categoria: 'vivo',
    vantagensGratis: ['resistencia_a_magia']
  },
  {
    nome: 'Anfíbio',
    custo: 0,
    vantagens: ['Move-se por terreno de água normalmente', '+2" de movimento dentro de terreno com água'],
    desvantagens: ['Ambiente Especial (água)', 'Vulnerabilidade (calor/fogo)'],
    value: RacaEnum.anfibio,
    categoria: 'vivo',
    desvantagensRaciais: ['ambiente_especial', 'vulnerabilidade']
  },
  {
    nome: 'Centauro',
    custo: 2,
    vantagens: ['+2" de movimento', 'Pode trocar seu ataque por 2 ataques com os cascos (FA = F+1d, sem H, sem bônus de Vantagens)'],
    desvantagens: ['Modelo Especial'],
    value: RacaEnum.centauro,
    categoria: 'vivo',
    desvantagensRaciais: ['modelo_especial']
  },
  {
    nome: 'Construto',
    custo: 0,
    vantagens: ['Imune às magias Sono e Pânico e a efeitos que só funcionam em seres vivos (cura, Toque Vampírico...)'],
    desvantagens: ['Não recupera PV por cura ou magia', 'Não pode usar magia'],
    value: RacaEnum.construto,
    categoria: 'construto',
    semMagia: true
  },
  {
    nome: 'Elfo',
    custo: 2,
    vantagens: ['Infravisão', 'H+1 (máx. 5)', 'FA+1 com dano de corte (F) ou perfuração (PdF), escolha um'],
    desvantagens: ['R-1 em testes'],
    value: RacaEnum.elfo,
    categoria: 'vivo',
    bonus: { H: 1 }
  },
  {
    nome: 'Elfo Negro',
    custo: 3,
    vantagens: ['H+1 (máx. 5)', 'Infravisão', 'Resistência à Magia', 'Focus+1 em Luz e Trevas'],
    desvantagens: ['R-1 em testes', 'De dia (o padrão), sofre H-1', 'Vulnerabilidade (luz)'],
    value: RacaEnum.elfo_negro,
    categoria: 'vivo',
    bonus: { H: 1 },
    bonusFocus: { luz: 1, trevas: 1 },
    vantagensGratis: ['resistencia_a_magia'],
    desvantagensRaciais: ['vulnerabilidade']
  },
  {
    nome: 'Esqueleto',
    custo: -2,
    vantagens: ['Armadura Extra (corte e perfuração)', 'Invulnerabilidade (frio/gelo)', 'Imune às magias Sono e Pânico e a efeitos que só funcionam em seres vivos (cura, Toque Vampírico...)'],
    desvantagens: ['Não recupera PV', 'Não pode usar magia ou gastar PM', 'Monstruoso'],
    value: RacaEnum.esqueleto,
    categoria: 'morto_vivo',
    semMagia: true,
    desvantagensRaciais: ['monstruoso']
  },
  {
    nome: 'Gnomo',
    custo: 2,
    vantagens: ['H+1 (máx. 5)', 'Genialidade', 'Focus+1 em Luz', 'As magias Ilusão, Imagem Turva e Invisibilidade custam 1PM a menos'],
    desvantagens: ['Modelo Especial'],
    value: RacaEnum.gnomo,
    categoria: 'vivo',
    bonus: { H: 1 },
    bonusFocus: { luz: 1 },
    vantagensGratis: ['genialidade'],
    desvantagensRaciais: ['modelo_especial']
  },
  {
    nome: 'Goblin',
    custo: -2,
    vantagens: ['Pode comprar a Perícia Crime por 1 ponto', 'Infravisão'],
    desvantagens: ['Má Fama', 'Não pode ter o kit Mago', 'Só usa magia com Clericato, com Focus máximo 2 e nunca em Luz'],
    value: RacaEnum.goblin,
    categoria: 'vivo',
    desvantagensRaciais: ['ma_fama'],
    focusMaximo: 2,
    magiaExigeClericato: true,
    caminhosProibidos: ['luz'],
    descontos: { pericia_crime: 1 }
  },
  {
    nome: 'Halfling',
    custo: 2,
    vantagens: ['H+1 (máx. 5)', 'PdF+1 (máx. 5)', 'Resistência à Magia', 'Pode comprar a Perícia Crime por 1 ponto'],
    desvantagens: ['Modelo Especial'],
    value: RacaEnum.halfling,
    categoria: 'vivo',
    bonus: { H: 1, PdF: 1 },
    vantagensGratis: ['resistencia_a_magia'],
    descontos: { pericia_crime: 1 },
    desvantagensRaciais: ['modelo_especial']
  },
  {
    nome: 'Humano',
    custo: 0,
    vantagens: ['Pode comprar Perícias por 1 ponto cada'],
    desvantagens: [],
    value: RacaEnum.humano,
    categoria: 'vivo',
    descontos: DESCONTO_PERICIAS
  },
  {
    nome: 'Licantropo',
    custo: 0,
    vantagens: ['Ao entrar em Fúria se transforma: F+1 e A+1 até a Fúria acabar'],
    desvantagens: ['Fúria', 'Monstruoso enquanto transformado', 'Vulnerabilidade (magia e armas mágicas)'],
    value: RacaEnum.licantropo,
    categoria: 'vivo',
    desvantagensRaciais: ['furia', 'vulnerabilidade']
  },
  {
    nome: 'Meio-Elfo',
    custo: 1,
    vantagens: ['Pode comprar Perícias por 1 ponto cada', 'Infravisão'],
    desvantagens: [],
    value: RacaEnum.meio_elfo,
    categoria: 'vivo',
    descontos: DESCONTO_PERICIAS
  },
  {
    nome: 'Meio-Orc',
    custo: -1,
    vantagens: ['F+1 (máx. 5)', 'Infravisão'],
    desvantagens: ['Má Fama', 'Não pode comprar Genialidade'],
    value: RacaEnum.meio_orc,
    categoria: 'vivo',
    bonus: { F: 1 },
    desvantagensRaciais: ['ma_fama'],
    vantagensProibidas: ['genialidade']
  },
  {
    nome: 'Minotauro',
    custo: 1,
    vantagens: ['F+2 (máx. 5)', 'R+1 (máx. 5)'],
    desvantagens: ['Código de Honra do Combate', 'Má Fama', 'Medo de altura: não pode terminar o movimento sobre terreno Elevado'],
    value: RacaEnum.minotauro,
    categoria: 'vivo',
    bonus: { F: 2, R: 1 },
    desvantagensRaciais: ['codigo_de_honra', 'ma_fama']
  },
  {
    nome: 'Ogre',
    custo: 3,
    vantagens: ['F+3 (máx. 5)', 'R+3 (máx. 5)'],
    desvantagens: ['Má Fama', 'Modelo Especial', 'Monstruoso', 'Não pode comprar Genialidade'],
    value: RacaEnum.ogre,
    categoria: 'vivo',
    bonus: { F: 3, R: 3 },
    desvantagensRaciais: ['ma_fama', 'modelo_especial', 'monstruoso'],
    vantagensProibidas: ['genialidade']
  },
  {
    nome: 'Troglodita',
    custo: 3,
    vantagens: ['F+1 (máx. 5)', 'A+1 (máx. 5)', 'Infravisão', 'Camuflagem: não pode ser alvo de ataques à distância na primeira rodada', 'Óleo fedorento: uma vez por partida, como Ação, um inimigo em contato de base testa R; se falhar sofre F-1 por 2 rodadas'],
    desvantagens: ['Monstruoso', 'Vulnerabilidade (frio/gelo)', 'Só usa magia com Clericato e Focus máximo 3'],
    value: RacaEnum.troglodita,
    categoria: 'vivo',
    bonus: { F: 1, A: 1 },
    desvantagensRaciais: ['monstruoso', 'vulnerabilidade'],
    focusMaximo: 3,
    magiaExigeClericato: true
  }
]

const POR_VALOR = new Map(RACAS.map(raca => [raca.value, raca]))

export namespace RacasLib {

  export function listarRacas () {
    return RACAS
  }

  export function obter (value: string) {
    return POR_VALOR.get(value)
  }

  export function listarRacasCombo () {
    const combo: IComboBox[] = RACAS.map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
