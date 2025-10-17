import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'
import { IComboBox } from 'src/interfaces/combobox-interface'
import { IVantagemDesvantagem } from 'src/interfaces/vantagem-desvantagem-interface'

export namespace VantagensEDesvantagensLib {

  export function listarVantagensEDesvantagens () {
    const vantangens_e_desvantagens: IVantagemDesvantagem[] = [
      // Vantagens
      {
        nome: 'Aceleração',
        custo: '1 ponto',
        descricao: 'Aceleração custa 1PM por turno para ativar (o herói pode ativar Aceleração no turno do adversário desde que seja para executar uma esquiva). Em testes de esquiva, o herói recebe H+1 para rolar o teste (não cumulativo com Teleporte). Com Aceleração ativada, o herói pode correr e executar uma ação, em vez de apenas correr no seu turno.',
        value: 'aceleracao',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Adaptador',
        custo: '1 ponto',
        descricao: 'O herói que possui Adaptador pode trocar seu tipo de dano sem receber penalidade. Usar Adaptador não gasta PM.',
        value: 'adaptador',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Aliado',
        custo: '1 ponto cada',
        descricao: 'Aliado é construído com a mesma quantidade de pontos que o próprio herói. Se quiser um Aliado mais poderoso, ele custará mais caro: 1 ponto extra para cada ponto de personagem. Por exemplo, se você é um herói Novato (5 pontos) e quer um Aliado feito com 6 pontos, ele vai custar 2 pontos. O Aliado não pode ser uma miniatura adicional, ela deve estar na mesma base que o herói, o jogador decide se vai usar o herói ou o aliado no turno, nunca podendo usar os dois ao mesmo tempo, a não ser que possua a Vantagem Parceiro (dai vale as regras de Parceiro)',
        value: 'aliado',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Aparência Inofensiva',
        custo: '1 ponto',
        descricao: 'O herói ganha um ataque extra no primeiro turno do combate. Ao lutar com outro herói em outro combate, Aparência Inofensiva só funciona caso esse novo alvo estivesse a mais de 12" do primeiro combate.',
        value: 'aparencia_inofensiva',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Arcano',
        custo: '4 pontos',
        descricao: 'Herói recebe +1 em todos os focus, Arcano pode ser comprado quantas vezes quiser, então, por 8 pontos, pode ter Arcano x2 e focus +2 em todos os Caminhos.',
        value: 'arcano',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Arena',
        custo: '1 ponto',
        descricao: 'O herói recebe +2 de H para todos os tipos de testes (incluindo combates) em um terreno da sua escolha, o terreno não pode ser do tipo Campo (mais informações sobre Terrenos, consultar as regras de terreno',
        value: 'arena',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Arma Mágica',
        custo: '1 ponto',
        descricao: 'O herói recebe +1 de FA quando ataca com sua Arma Mágica e recebe o tipo de dano Mágico.',
        value: 'arma_magica',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AM - Ataque Especial',
        custo: '1 ponto (necessário Arma Mágica)',
        descricao: 'Além do bônus de Arma Mágica, o herói recebe +2 de FA ao realizar um ataque, ativar AM - Ataque Especial custa 2PM por ativação e precisa ser ativado antes de rolar o ataque.',
        value: 'am_ataque_especial',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AM - Sagrada',
        custo: '1 ponto (necessário Arma Mágica)',
        descricao: 'Além do bônus de Arma Mágica, o herói recebe +1 de F e A quando luta contra Mortos-Vivos e criaturas malignas (que possuam ou sejam criadas com magia das Trevas ou Má fama).',
        value: 'am_sagrada',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AM - Retornável',
        custo: '1 ponto (necessário Arma Mágica)',
        descricao: 'Além do bônus de Arma Mágica, caso seja arremessada, esta arma retorna às mãos do herói no mesmo turno.',
        value: 'am_retornavel',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AM - Veloz',
        custo: '1 ponto (necessário Arma Mágica)',
        descricao: 'Além do bônus de Arma Mágica, o herói recebe +2 de H ao rolar iniciativa.',
        value: 'am_veloz',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Armadura Extra - Normal',
        custo: '2 pontos cada',
        descricao: 'Ao realizar testes que utilizam A, a A do herói será e dobrada, mas apenas contra o tipo de dano escolhido: Corte; Perfuração; Contusão; Explosão; Calor/Fogo; Frio/Gelo; Luz; Eletricidade; Vento/Som; Químico (Água, Ácido, Venenos...).',
        value: 'armadura_extra_normal',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Armadura Extra - PdF',
        custo: '4 pontos',
        descricao: 'Ao realizar testes que utilizam A, a A do herói será e dobrada, mas apenas contra ataques com PdF.',
        value: 'armadura_extra_pdf',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Armadura Extra - F',
        custo: '3 pontos',
        descricao: 'Ao realizar testes que utilizam A, a A do herói será e dobrada, mas apenas contra ataques com Força (3 pontos).',
        value: 'armadura_extra_f',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Armadura Extra - Mágica',
        custo: '3 pontos',
        descricao: 'Ao realizar testes que utilizam A, a A do herói será e dobrada, mas apenas contra ataques com Magia e Armas Mágicas.',
        value: 'armadura_extra_magica',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Ataque Especial',
        custo: '1 ponto',
        descricao: 'O herói gasta 2PM e realiza um ataque com +2 de F ou PdF, e o ataque é considerado mágico.',
        value: 'ataque_especial',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AE - Paralizante',
        custo: '1 ponto (necessário Ataque Especial)',
        descricao: 'Além do bônus de Ataque Especial, acrescente os efeitos da Vantagem Paralisia, o herói gasta +2PM além do gasto de Ataque Especial.',
        value: 'ae_paralizante',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AE - Área',
        custo: '3 ponto (necessário Ataque Especial)',
        descricao: 'Além do bônus de Ataque Especial, o ataque de Área atinge vários alvos, com FA total no alvo e –1 a cada 2" de distância. Todos podem tentar esquiva para reduzir a FA em 1. Só vale para PdF, causa dano no próprio herói se ele estiver na área de impacto e custa +8 PM pra usar.',
        value: 'ae_area',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AE - Preciso',
        custo: '1 ponto (necessário Ataque Especial)',
        descricao: 'Além do bônus de Ataque Especial, este ataque impõe um redutor de –1 de H contra o alvo em sua FD.',
        value: 'ae_preciso',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'AE - Teleguiado',
        custo: '1 ponto (necessário Ataque Especial)',
        descricao: 'Além do bônus de Ataque Especial, este ataque impõe ao alvo um redutor de –2 na H em sua FD e tentativas de Esquiva. Válido apenas para ataques com PdF. Custa +2PM além do gasto com Ataque Especial.',
        value: 'ae_teleguiado',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Boa Fama',
        custo: '1 ponto',
        descricao: 'Outros heróis aliados que estiverem a até 6¨ recebem +1 na FA. Quando um herói possui Boa Fama nenhum outro herói do grupo pode possuir a desvantagem Má Fama.',
        value: 'boa_fama',
        tipo: TipoVantagemEnum.vantagem
      },
      {
        nome: 'Clericato',
        custo: '2 pontos',
        descricao: 'O herói recebe +1 de focus em qualquer caminho e pode usar mágias com requisito Clericato, além de poder escolher Kits com esse requisito.',
        value: 'clericato',
        tipo: TipoVantagemEnum.vantagem
      },

      // Desvantagem
      {
        nome: 'Teste desvantagem',
        custo: '',
        descricao: '',
        value: '',
        tipo: TipoVantagemEnum.desvantagem
      },

      // Racial
      {
        nome: 'Teste racial',
        custo: '',
        descricao: '',
        value: '',
        tipo: TipoVantagemEnum.racial
      },

      // Kit
      {
        nome: 'Teste kit',
        custo: '',
        descricao: '',
        value: '',
        tipo: TipoVantagemEnum.kit
      }
    ]

    return vantangens_e_desvantagens
  }

  export function listarVantagensEDesvantagensCombo (tipo: TipoVantagemEnum) {
    const combo = listarVantagensEDesvantagens().filter(item => item.tipo === tipo).map(item => ({ label: item.nome, value: item.value }))

    return combo as IComboBox[]
  }
}
