import { IComboBox } from 'src/interfaces/combobox-interface'
import type { IMagia, IRequisitoMagia, TRequisitoFocus } from 'src/interfaces/magia-interface'
import { CAMINHOS, type TCaminho } from 'src/types/caminho-type'

// Magias do 3DeTatics, adaptadas do sistema de Caminhos e Focus do
// 3D&T Turbinado. Distâncias em polegadas ("), durações em rodadas.
// O alcance das magias à distância usa a tabela de alcance do PdF,
// trocando o PdF pelo Focus do Caminho usado.
// "Sustentável": dura enquanto o conjurador pagar 1PM no início de cada
// uma de suas ativações (veja as regras de magia).

function magia (inicial: boolean, nome: string, value: string, requisito: string, custo: string, alcance: string, duracao: string, descricao: string): IMagia {
  return { nome, value, requisito, custo, alcance, duracao, descricao, inicial }
}

const MAGIAS: IMagia[] = [
  // Magias Iniciais
  magia(true, 'Ataque Mágico', 'ataque_magico', 'Qualquer Caminho 1', '1PM por ponto de Focus usado', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'Um ataque à distância com FA = H + Focus usado + 1D6. O dano é mágico e do tipo ligado ao Caminho escolhido. Exige linha de visão e pode ser esquivado normalmente.'),
  magia(true, 'Aumento de Dano', 'aumento_de_dano', 'Qualquer Caminho 1', '1PM por ponto de Focus usado (máx. +3)', 'Toque', 'Sustentável',
    'O alvo recebe FA+1 para cada ponto de Focus usado. Não é cumulativa com outro Aumento de Dano.'),
  magia(true, 'Proteção Mágica', 'protecao_magica', 'Qualquer Caminho 1', '1PM por ponto de Focus usado (máx. +3)', 'Toque', 'Sustentável',
    'O alvo recebe FD+1 para cada ponto de Focus usado. Não é cumulativa com outra Proteção Mágica.'),
  magia(true, 'Proteção Contra o Elemento', 'protecao_contra_o_elemento', 'Qualquer Caminho 1', '2PM', 'Alcance de PdF (pelo Focus)', 'Sustentável',
    'Escolha um tipo de dano ligado a um Caminho que você possua. O alvo recebe Armadura Extra contra esse tipo de dano.'),
  magia(true, 'Cancelamento de Magia', 'cancelamento_de_magia', 'Qualquer Caminho com Focus igual ou maior que o da magia a cancelar', '2PM', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'Encerra uma magia sustentável ativa em um alvo visível. Se a magia foi lançada por um conjurador com Focus maior que o seu, faça um teste de H: em caso de falha a magia continua.'),
  magia(true, 'Corpo Elemental', 'corpo_elemental', 'Qualquer Caminho 2', '2PM', 'Pessoal', 'Sustentável',
    'O corpo do conjurador se torna feito do elemento do Caminho escolhido: recebe Armadura Extra contra o tipo de dano desse Caminho, e seus ataques com F passam a ser mágicos e desse tipo de dano.'),
  magia(true, 'Criatura Mágica', 'criatura_magica', 'Qualquer Caminho 3', '3PM', 'Coloca a criatura em contato com a base do conjurador', 'Sustentável',
    'Cria uma criatura (use uma miniatura ou marcador) com F1, H1, R1, A1, PdF0 e 5 PV, feita do elemento do Caminho usado. Ela é ativada logo depois do conjurador, faz apenas Mover ou atacar, e desaparece com 0 PV ou quando a magia termina. Só uma Criatura Mágica por conjurador.'),
  magia(true, 'Cura Mágica', 'cura_magica', 'Água ou Luz 1, mais Clericato ou kit Clérigo ou Druida', '2PM por 1D6 de cura (máx. Focus x 1D6)', 'Toque (3" com Focus 2 ou mais)', 'Instantânea',
    'O alvo recupera os PV rolados, sem passar do seu PV inicial. Não funciona em Construtos nem em Mortos-Vivos.'),
  magia(true, 'Cura Sagrada', 'cura_sagrada', 'Luz 1 e kit Paladino', '1PM por PV curado (máx. Focus x 3)', 'Toque', 'Instantânea',
    'O alvo recupera a quantidade de PV escolhida, sem passar do seu PV inicial. Não funciona em Construtos nem em Mortos-Vivos.'),
  magia(true, 'Detecção Mágica', 'deteccao_magica', 'Qualquer Caminho 1', '1PM', 'Alcance de PdF (pelo Focus)', 'Até o fim da rodada',
    'Revela todos os heróis invisíveis e todas as ilusões dentro do alcance. Até o fim da rodada, os aliados do conjurador podem atacar esses heróis normalmente.'),
  magia(true, 'Força Mágica', 'forca_magica', 'Ar, Terra ou Luz 1', '1PM por polegada de comprimento (máx. Focus x 2")', 'Alcance de PdF (pelo Focus)', 'Sustentável',
    'Cria uma barreira de energia (use um marcador) com até 1" de altura. Ela bloqueia movimento e linha de visão como terreno Bloqueador, e pode ser atacada: tem FD = Focus x 2 e se desfaz com qualquer dano maior ou igual a Focus.'),
  magia(true, 'Ilusão', 'ilusao', 'Luz 1', '2PM', 'Alcance de PdF (pelo Focus)', 'Sustentável',
    'Cria uma peça de terreno ilusória de até 3" x 3" que bloqueia linha de visão, mas não o movimento. Qualquer herói que entre em contato com ela pode fazer um teste de R: se passar, a Ilusão se desfaz.'),
  magia(true, 'Invisibilidade', 'invisibilidade', 'Luz ou Ar 2', '3PM', 'Toque', 'Até o fim da próxima ativação do alvo',
    'O alvo recebe os efeitos da Vantagem Invisibilidade. A magia termina se o alvo atacar, lançar magia ou sofrer dano.'),
  magia(true, 'Transporte', 'transporte', 'Ar ou Água 1', '2PM', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'O alvo (o conjurador ou um aliado) faz imediatamente um movimento extra de até Focus x 2", ignorando terreno Difícil e Floresta. Esse movimento não conta como a ação Mover do alvo.'),

  // Magias Avançadas
  magia(false, 'Bola de Fogo', 'bola_de_fogo', 'Fogo 3', '6PM', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'Escolha um ponto em linha de visão: todos os heróis a até 2" dele (aliados e o próprio conjurador incluídos) sofrem um ataque com FA = H + Focus + 1D6 (Calor/Fogo). Uma Esquiva bem-sucedida reduz a FA à metade.'),
  magia(false, 'Relâmpago', 'relampago', 'Ar 3', '5PM', 'Linha reta a partir da base do conjurador, com comprimento igual ao Alcance de PdF (pelo Focus)', 'Instantânea',
    'Todos os heróis tocados pela linha sofrem um ataque com FA = H + Focus + 1D6 (Eletricidade). Uma Esquiva bem-sucedida reduz a FA à metade.'),
  magia(false, 'Raio Desintegrador', 'raio_desintegrador', 'Trevas 4', '8PM', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'Ataque contra um único alvo com FA = H + Focus + 1D6. A FD do alvo ignora sua A (FD = H + 1D6). Construtos e Mortos-Vivos não recebem nenhuma proteção contra este dano.'),
  magia(false, 'Toque Vampírico', 'toque_vampirico', 'Trevas 2', '3PM', 'Toque', 'Instantânea',
    'Ataque corpo a corpo com FA = H + Focus + 1D6. O conjurador recupera PV igual à metade do dano causado. Não afeta Construtos nem Mortos-Vivos.'),
  magia(false, 'Flecha Ácida', 'flecha_acida', 'Água ou Trevas 2', '3PM', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'Ataque com FA = H + Focus + 1D6 (Químico). Se causar dano, o alvo sofre mais 1 ponto de dano no início de cada uma de suas próximas duas ativações.'),
  magia(false, 'Lentidão', 'lentidao', 'Água ou Terra 2', '2PM', 'Alcance de PdF (pelo Focus)', '2 rodadas',
    'O alvo faz um teste de R. Se falhar, seu movimento cai 3" e ele não pode Correr enquanto durar a magia.'),
  magia(false, 'Raízes', 'raizes', 'Terra ou Água 3', '4PM', 'Alcance de PdF (pelo Focus)', 'Sustentável',
    'Cria uma área de 2" de raio (use um marcador). Quem estiver na área ao ser lançada, ou entrar nela, faz um teste de H: se falhar, fica preso e não pode Mover nem Correr. No início de cada ativação, um herói preso pode repetir o teste para se soltar.'),
  magia(false, 'Terremoto', 'terremoto', 'Terra 4', '6PM', 'Alcance de PdF (pelo Focus)', 'Instantânea, mas a área continua',
    'Todos os heróis a até 3" do ponto escolhido fazem um teste de H: quem falhar perde seu próximo Mover e fica Indefeso até o fim da rodada. A área vira terreno Difícil até o fim da partida.'),
  magia(false, 'Cegueira', 'cegueira', 'Luz ou Trevas 2', '3PM', 'Alcance de PdF (pelo Focus)', '1 rodada',
    'O alvo faz um teste de R. Se falhar, não consegue traçar linha de visão a mais de 1" de sua base: só pode atacar inimigos em contato.'),
  magia(false, 'Sono', 'sono', 'Luz, Terra ou Trevas 2', '3PM', 'Alcance de PdF (pelo Focus)', 'Até o fim da próxima rodada',
    'O alvo faz um teste de R. Se falhar, adormece: fica Indefeso e não pode ser ativado. Qualquer dano o acorda. Não afeta Construtos nem Mortos-Vivos.'),
  magia(false, 'Pânico', 'panico', 'Trevas 2', '3PM', 'Alcance de PdF (pelo Focus)', 'Instantânea',
    'O alvo faz um teste de R. Se falhar, em sua próxima ativação deve usar Correr para se afastar o máximo possível do conjurador. Heróis em Fúria são imunes.'),
  magia(false, 'Silêncio', 'silencio', 'Ar 2', '3PM', 'Alcance de PdF (pelo Focus)', 'Sustentável',
    'Cria uma área de 3" de raio (use um marcador). Nenhum herói dentro dela pode lançar magias, nem mesmo o conjurador.'),
  magia(false, 'Imagem Turva', 'imagem_turva', 'Luz 2', '2PM', 'Toque', 'Sustentável',
    'O contorno do alvo fica borrado: ele recebe +2 em Esquivas.'),
  magia(false, 'Desvio de Disparos', 'desvio_de_disparos', 'Ar 2', '2PM', 'Toque', 'Sustentável',
    'Ataques à distância (PdF e magias de ataque) contra o alvo sofrem FA-2.'),
  magia(false, 'Voo', 'voo', 'Ar 2', '2PM', 'Toque', 'Sustentável',
    'O alvo recebe os efeitos da Vantagem Levitação.'),
  magia(false, 'Teleportação', 'teleportacao', 'Ar 3 e Luz 1', '4PM', 'Toque', 'Instantânea',
    'O alvo (o conjurador ou um aliado em contato) é colocado em qualquer ponto em linha de visão do conjurador dentro do alcance, ignorando terreno e miniaturas no caminho.'),
  magia(false, 'Gigantismo', 'gigantismo', 'Terra ou Água 2', '3PM', 'Toque', 'Sustentável',
    'O alvo cresce: recebe F+1 e A+1 (podendo passar de 5) e a Desvantagem Monstruoso enquanto durar a magia.'),
  magia(false, 'Bênção de Batalha', 'bencao_de_batalha', 'Luz 2', '3PM', 'Aliados a até 6" do conjurador', 'Até o fim da rodada',
    'Todos os aliados na área (incluindo o conjurador) recebem H+1 em ataques e Esquivas. Não é cumulativa com outra Bênção de Batalha.'),
  magia(false, 'Esconjuro de Mortos-Vivos', 'esconjuro_de_mortos_vivos', 'Luz 2 e Clericato', '3PM', 'Mortos-Vivos a até 6" do conjurador', 'Instantânea',
    'Cada Morto-Vivo inimigo na área faz um teste de R. Quem falhar sofre 1D6 de dano e deve usar sua próxima ativação para se afastar do conjurador.'),
  magia(false, 'Erguer Mortos', 'erguer_mortos', 'Trevas 3', '5PM', 'Alcance de PdF (pelo Focus)', 'Sustentável',
    'Uma vez por partida, escolha um herói derrotado (de qualquer jogador) dentro do alcance: coloque um marcador no local. Ele volta como um Morto-Vivo sob seu controle com F1, H1, R1, A0, PdF0 e 5 PV, seguindo as regras de Criatura Mágica.'),
  magia(false, 'Invocar Elemental', 'invocar_elemental', 'Qualquer Caminho 4', '6PM', 'Coloca a criatura em contato com a base do conjurador', 'Sustentável',
    'Igual a Criatura Mágica, mas a criatura tem F3, H2, R3, A2, PdF0 e 15 PV, e seus ataques causam dano mágico do tipo ligado ao Caminho usado.')
]

// Requisitos estruturados de cada magia (o texto em `requisito` é o que aparece na página).
function qualquerCaminho (focus: number): TRequisitoFocus[] {
  return CAMINHOS.map(caminho => ({ [caminho.key]: focus }))
}

function algum (caminhos: TCaminho[], focus: number): TRequisitoFocus[] {
  return caminhos.map(caminho => ({ [caminho]: focus }))
}

const REQUISITOS: Record<string, IRequisitoMagia> = {
  ataque_magico: { alternativas: qualquerCaminho(1) },
  aumento_de_dano: { alternativas: qualquerCaminho(1) },
  protecao_magica: { alternativas: qualquerCaminho(1) },
  protecao_contra_o_elemento: { alternativas: qualquerCaminho(1) },
  cancelamento_de_magia: { alternativas: qualquerCaminho(1) },
  corpo_elemental: { alternativas: qualquerCaminho(2) },
  criatura_magica: { alternativas: qualquerCaminho(3) },
  cura_magica: { alternativas: algum(['agua', 'luz'], 1), vantagens: ['clericato'], kits: ['clerigo', 'druida'] },
  cura_sagrada: { alternativas: algum(['luz'], 1), kits: ['paladino'] },
  deteccao_magica: { alternativas: qualquerCaminho(1) },
  forca_magica: { alternativas: algum(['ar', 'terra', 'luz'], 1) },
  ilusao: { alternativas: algum(['luz'], 1) },
  invisibilidade: { alternativas: algum(['luz', 'ar'], 2) },
  transporte: { alternativas: algum(['ar', 'agua'], 1) },
  bola_de_fogo: { alternativas: algum(['fogo'], 3) },
  relampago: { alternativas: algum(['ar'], 3) },
  raio_desintegrador: { alternativas: algum(['trevas'], 4) },
  toque_vampirico: { alternativas: algum(['trevas'], 2) },
  flecha_acida: { alternativas: algum(['agua', 'trevas'], 2) },
  lentidao: { alternativas: algum(['agua', 'terra'], 2) },
  raizes: { alternativas: algum(['terra', 'agua'], 3) },
  terremoto: { alternativas: algum(['terra'], 4) },
  cegueira: { alternativas: algum(['luz', 'trevas'], 2) },
  sono: { alternativas: algum(['luz', 'terra', 'trevas'], 2) },
  panico: { alternativas: algum(['trevas'], 2) },
  silencio: { alternativas: algum(['ar'], 2) },
  imagem_turva: { alternativas: algum(['luz'], 2) },
  desvio_de_disparos: { alternativas: algum(['ar'], 2) },
  voo: { alternativas: algum(['ar'], 2) },
  teleportacao: { alternativas: [{ ar: 3, luz: 1 }] },
  gigantismo: { alternativas: algum(['terra', 'agua'], 2) },
  bencao_de_batalha: { alternativas: algum(['luz'], 2) },
  esconjuro_de_mortos_vivos: { alternativas: algum(['luz'], 2), vantagens: ['clericato'] },
  erguer_mortos: { alternativas: algum(['trevas'], 3) },
  invocar_elemental: { alternativas: qualquerCaminho(4) }
}

const POR_VALOR = new Map(MAGIAS.map(magia => [magia.value, magia]))

export namespace MagiasLib {

  export function listarMagias () {
    return MAGIAS
  }

  export function obter (value: string) {
    return POR_VALOR.get(value)
  }

  export function requisitos (value: string): IRequisitoMagia {
    return REQUISITOS[value] ?? { alternativas: qualquerCaminho(1) }
  }

  export function listarMagiasCombo () {
    const combo: IComboBox[] = MAGIAS.map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
