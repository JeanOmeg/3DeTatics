import { IComboBox } from 'src/interfaces/combobox-interface'
import { IKit } from 'src/interfaces/kit-interface'

// Kits genéricos do 3DeTatics, adaptados do conceito de kits do 3D&T Turbinado.
// Cada kit representa um arquétipo comum de miniatura de RPG, para que qualquer
// coleção possa ser usada na mesa. Regras gerais:
// - cada herói pode ter no máximo um kit;
// - Vantagens do kit são gratuitas; Desvantagens do kit não dão pontos;
// - o kit define o multiplicador de PV e PM (sem kit: R x 5 para ambos).

type TKitBase = Omit<IKit, 'multiplicadorPv' | 'multiplicadorPm'>

// Multiplicador a partir do texto "R x 5".
function multiplicador (texto: string): number {
  const numero = /\d+/.exec(texto)
  return numero ? Number(numero[0]) : 5
}

// Dados para a calculadora e as validações, pelo value do kit.
const REGRAS_DOS_KITS: Record<string, Partial<IKit>> = {
  guerreiro: { descontos: { arena: 1 } },
  barbaro: { categoriasProibidas: ['construto', 'morto_vivo'], desvantagensDoKit: ['furia'] },
  cavaleiro: { desvantagensDoKit: ['modelo_especial'] },
  guardiao: { bonus: { A: 1 } },
  arqueiro: { racasProibidas: ['minotauro'], custoPorRaca: { elfo: 0, elfo_negro: 0 }, bonus: { PdF: 1 }, descontos: { tiro_carregavel: 1, tiro_multiplo: 1 } },
  monge: { vantagensGratis: ['deflexao'], desvantagensDoKit: ['codigo_de_honra'] },
  ladino: { descontos: { invisibilidade: 1 } },
  batedor: { categoriasProibidas: ['construto'] },
  bardo: { categoriasProibidas: ['construto'] },
  clerigo: { exigeVantagens: ['clericato'] },
  paladino: { exigeDesvantagens: ['codigo_de_honra'] },
  mago: { vantagensGratis: ['ataque_especial'], descontos: { ae_area: 2 } },
  elementalista: { desvantagensDoKit: ['vulnerabilidade'] },
  druida: { categoriasProibidas: ['construto', 'morto_vivo'] },
  necromante: { desvantagensDoKit: ['ma_fama'] },
  fera: { desvantagensDoKit: ['monstruoso'], pdfMaximo: 1, vantagensProibidas: ['arma_magica', 'genialidade', 'clericato'] }
}

export namespace KitsLib {

  export function listarKits () {
    const kits: TKitBase[] = [
      // Combatentes
      {
        nome: 'Guerreiro',
        custo: 0,
        restricoes: 'nenhuma',
        vantagens: ['Firmeza: se não se moveu neste turno, recebe FA+1 em ataques corpo a corpo', 'Pode comprar Arena por 1 ponto a menos (mínimo 1)'],
        desvantagens: [],
        pv: 'R x 5',
        pm: 'R x 4',
        value: 'guerreiro'
      },
      {
        nome: 'Bárbaro',
        custo: 1,
        restricoes: 'proibido para Construtos e Mortos-Vivos',
        vantagens: ['Pode entrar em Fúria voluntariamente no início de sua ativação, sem teste', 'Em Fúria recebe FA+2 em vez de FA+1'],
        desvantagens: ['Fúria'],
        pv: 'R x 7',
        pm: 'R x 3',
        value: 'barbaro'
      },
      {
        nome: 'Cavaleiro',
        custo: 2,
        restricoes: 'apenas miniaturas montadas',
        vantagens: ['+2" de movimento', 'Investida: se mover pelo menos 6" em linha reta e terminar em contato com o alvo, sua F é dobrada na FA desse ataque'],
        desvantagens: ['Modelo Especial (base grande, não entra em terreno Elevado nem passa por aberturas estreitas)'],
        pv: 'R x 5',
        pm: 'R x 4',
        value: 'cavaleiro'
      },
      {
        nome: 'Lanceiro',
        custo: 0,
        restricoes: 'nenhuma',
        vantagens: ['FA+1 com F e PdF (perfuração)', 'Alcance: pode atacar corpo a corpo um inimigo a até 1" de sua base, sem precisar de contato (não recua após o ataque)'],
        desvantagens: [],
        pv: 'R x 5',
        pm: 'R x 4',
        value: 'lanceiro'
      },
      {
        nome: 'Guardião',
        custo: 1,
        restricoes: 'nenhuma',
        vantagens: ['A+1 (máx. 5)', 'Proteger: quando um aliado em contato de base com o Guardião é atacado, o Guardião pode receber o ataque no lugar dele (conta como uma Esquiva para o limite por rodada)'],
        desvantagens: ['-1" de movimento'],
        pv: 'R x 6',
        pm: 'R x 3',
        value: 'guardiao'
      },
      {
        nome: 'Arqueiro',
        custo: 1,
        restricoes: 'proibido para Minotauros; custa 0 para Elfos e Elfos Negros',
        vantagens: ['PdF+1 (máx. 5)', 'Pode comprar Tiro Carregável e Tiro Múltiplo por 1 ponto cada', 'Nunca tem Munição Limitada'],
        desvantagens: ['FA-1 em ataques corpo a corpo'],
        pv: 'R x 4',
        pm: 'R x 3',
        value: 'arqueiro'
      },
      {
        nome: 'Monge',
        custo: 1,
        restricoes: 'nenhuma',
        vantagens: ['Recebe Deflexão gratuitamente', 'Golpe Concentrado: uma vez por partida, um ataque corpo a corpo é Acerto Crítico automático'],
        desvantagens: ['Deve adotar pelo menos um Código de Honra'],
        pv: 'R x 5',
        pm: 'R x 4',
        value: 'monge'
      },
      // Especialistas
      {
        nome: 'Ladino',
        custo: 1,
        restricoes: 'nenhuma',
        vantagens: ['Ataque Furtivo: FA+2 contra inimigos Indefesos ou que estejam em contato de base com outro aliado seu', 'Pode comprar Invisibilidade por 1 ponto'],
        desvantagens: [],
        pv: 'R x 4',
        pm: 'R x 3',
        value: 'ladino'
      },
      {
        nome: 'Batedor',
        custo: 1,
        restricoes: 'proibido para Construtos',
        vantagens: ['Ignora o custo extra de movimento em terreno Floresta e Difícil', 'Vanguarda: no deploy pode ser posicionado a até 18" da sua borda (em vez de 12")'],
        desvantagens: [],
        pv: 'R x 5',
        pm: 'R x 3',
        value: 'batedor'
      },
      {
        nome: 'Bardo',
        custo: 1,
        restricoes: 'proibido para Construtos',
        vantagens: ['Inspirar: como Ação e gastando 2PM, todos os aliados a até 6" recebem FA+1 até o fim da rodada (não cumulativo com outra Inspiração)'],
        desvantagens: [],
        pv: 'R x 3',
        pm: 'R x 5',
        value: 'bardo'
      },
      // Místicos
      {
        nome: 'Clérigo',
        custo: 0,
        restricoes: 'Clericato',
        vantagens: ['Cura: como Ação e gastando 2PM, o Clérigo ou um aliado a até 3" recupera 1D6 PV (não pode passar do PV inicial)'],
        desvantagens: [],
        pv: 'R x 4',
        pm: 'R x 5',
        value: 'clerigo'
      },
      {
        nome: 'Paladino',
        custo: 1,
        restricoes: 'Código de Honra dos Heróis',
        vantagens: ['Golpe Sagrado: F+1 contra Mortos-Vivos e heróis com Má Fama', 'Imposição de Mãos: uma vez por partida, como Ação, um aliado em contato de base (ou ele mesmo) recupera PV igual à R do Paladino'],
        desvantagens: [],
        pv: 'R x 5',
        pm: 'R x 4',
        value: 'paladino'
      },
      {
        nome: 'Mago',
        custo: 0,
        restricoes: 'nenhuma',
        vantagens: ['Recebe Ataque Especial (PdF) gratuitamente', 'Seus ataques com PdF são mágicos', 'Pode comprar AE - Área por 2 pontos'],
        desvantagens: ['FA-1 em ataques corpo a corpo'],
        pv: 'R x 3',
        pm: 'R x 6',
        value: 'mago'
      },
      {
        nome: 'Elementalista',
        custo: 1,
        restricoes: 'nenhuma',
        vantagens: ['Escolha um elemento (Calor/Fogo, Frio/Gelo, Eletricidade ou Químico): todos os seus ataques causam esse tipo de dano', 'Armadura Extra contra o seu elemento'],
        desvantagens: ['Vulnerabilidade ao elemento oposto (Fogo e Gelo são opostos; Eletricidade e Químico são opostos)'],
        pv: 'R x 4',
        pm: 'R x 5',
        value: 'elementalista'
      },
      {
        nome: 'Druida',
        custo: 1,
        restricoes: 'proibido para Construtos e Mortos-Vivos',
        vantagens: ['Arena (Floresta) gratuitamente', 'Forma Selvagem: uma vez por partida, como Ação, recebe F+1, H+1 e A+1 por 3 rodadas; nesse período não pode usar PdF nem gastar PM'],
        desvantagens: [],
        pv: 'R x 4',
        pm: 'R x 5',
        value: 'druida'
      },
      {
        nome: 'Necromante',
        custo: 1,
        restricoes: 'nenhuma',
        vantagens: ['Drenar Vida: ao causar dano com PdF, pode gastar 2PM para recuperar PV igual à metade do dano causado (arredonde para baixo)', 'Seus ataques com PdF são mágicos'],
        desvantagens: ['Má Fama'],
        pv: 'R x 3',
        pm: 'R x 5',
        value: 'necromante'
      },
      // Criaturas
      {
        nome: 'Fera',
        custo: 0,
        restricoes: 'apenas miniaturas de animais e monstros não humanoides',
        vantagens: ['Armas Naturais: FA+1 em ataques com F (garras, presas, chifres)', 'Sentidos Especiais (Faro Aguçado) gratuitamente'],
        desvantagens: ['Monstruoso', 'PdF máximo 1', 'Não pode comprar Arma Mágica, Genialidade nem Clericato'],
        pv: 'R x 6',
        pm: 'R x 2',
        value: 'fera'
      }
    ]

    return kits.map((kit): IKit => ({
      ...kit,
      multiplicadorPv: multiplicador(kit.pv),
      multiplicadorPm: multiplicador(kit.pm),
      ...(REGRAS_DOS_KITS[kit.value] ?? {})
    }))
  }

  export function obter (value: string) {
    return listarKits().find(kit => kit.value === value)
  }

  export function listarKitsCombo () {
    const combo: IComboBox[] = listarKits().map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
