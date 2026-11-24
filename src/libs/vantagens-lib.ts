import { TipoVantagemEnum } from 'src/enums/tipo-vantagem-enum'
import { IComboBox } from 'src/interfaces/combobox-interface'
import { IVantagemDesvantagem } from 'src/interfaces/vantagem-desvantagem-interface'

// Adaptação para wargame skirmish das Vantagens e Desvantagens do
// Manual 3D&T Revisado, Ampliado e Turbinado. Os textos são próprios do
// 3DeTatics: distâncias em polegadas (") e efeitos medidos em turnos/rodadas.

// Custo numérico padrão: o primeiro número do texto do custo ("-1 a -3 pontos" -> -1).
function pontosDoCusto (custo: string): number {
  const numero = /-?\d+/.exec(custo)
  return numero ? Number(numero[0]) : 0
}

function vantagem (nome: string, custo: string, descricao: string, value: string): IVantagemDesvantagem {
  return { nome, custo, descricao, value, tipo: TipoVantagemEnum.vantagem, pontos: pontosDoCusto(custo) }
}

function desvantagem (nome: string, custo: string, descricao: string, value: string): IVantagemDesvantagem {
  return { nome, custo, descricao, value, tipo: TipoVantagemEnum.desvantagem, pontos: pontosDoCusto(custo) }
}

// Regras de custo e pré-requisitos que não cabem no texto do custo.
const REQUER_ARMA_MAGICA = { requer: ['arma_magica'] }
const REQUER_ATAQUE_ESPECIAL = { requer: ['ataque_especial'] }

const REGRAS_ESPECIAIS: Record<string, Partial<IVantagemDesvantagem>> = {
  arcano: { repetivel: true },
  armadura_extra_normal: { repetivel: true, escolha: 'tipo' },
  pontos_de_vida_extras: { repetivel: true },
  pontos_de_magia_extras: { repetivel: true },
  energia_extra: { opcoes: [1, 2] },
  sentidos_especiais: { opcoes: [1, 2] },
  am_ataque_especial: REQUER_ARMA_MAGICA,
  am_retornavel: REQUER_ARMA_MAGICA,
  am_sagrada: REQUER_ARMA_MAGICA,
  am_veloz: REQUER_ARMA_MAGICA,
  am_vorpal: REQUER_ARMA_MAGICA,
  ae_area: REQUER_ATAQUE_ESPECIAL,
  ae_paralisante: REQUER_ATAQUE_ESPECIAL,
  ae_preciso: REQUER_ATAQUE_ESPECIAL,
  ae_teleguiado: REQUER_ATAQUE_ESPECIAL,
  ae_lento: REQUER_ATAQUE_ESPECIAL,
  ae_perto_da_morte: REQUER_ATAQUE_ESPECIAL,
  codigo_de_honra: { repetivel: true },
  restricao_de_magia: { opcoes: [-1, -2, -3] },
  vulnerabilidade: { opcoes: [-1, -2, -3], escolha: 'tipo' },
  // Escolhas que o jogador completa no texto da carta.
  ataque_especial: { escolha: 'F/PdF' },
  toque_de_energia: { escolha: 'tipo' },
  arena: { escolha: 'terreno' },
  ambiente_especial: { escolha: 'ambiente' }
}

const VANTAGENS: IVantagemDesvantagem[] = [
  vantagem('Aceleração', '1 ponto', 'Aceleração custa 1PM por turno para ativar (o herói pode ativar Aceleração no turno do adversário desde que seja para executar uma esquiva). Em testes de esquiva, o herói recebe H+1 para rolar o teste (não cumulativo com Teleporte). Com Aceleração ativada, o herói pode correr e executar uma ação, em vez de apenas correr no seu turno.', 'aceleracao'),
  vantagem('Aparência Inofensiva', '1 ponto', 'O primeiro ataque corpo a corpo que o herói fizer na partida ganha um ataque extra na mesma Ação. Não pode ser combinada com Monstruoso.', 'aparencia_inofensiva'),
  vantagem('Arcano', '4 pontos', 'Herói recebe +1 em todos os Focus. Arcano pode ser comprado quantas vezes quiser, então, por 8 pontos, pode ter Arcano x2 e Focus +2 em todos os Caminhos.', 'arcano'),
  vantagem('Arena', '1 ponto', 'Escolha um tipo de terreno: Floresta, Difícil, Elevado, Cobertura ou Perigoso (anote na carta). Dentro dele, o herói recebe H+2 em todos os testes (incluindo ataque, defesa e esquiva) e ignora o custo extra de movimento.', 'arena'),
  vantagem('Arma Mágica', '1 ponto', 'O herói recebe +1 de FA quando ataca com sua Arma Mágica, e esses ataques são mágicos (o tipo de dano continua o anotado na carta).', 'arma_magica'),
  vantagem('AM - Ataque Especial', '1 ponto (necessário Arma Mágica)', 'Além do bônus de Arma Mágica, o herói recebe +2 de FA ao realizar um ataque. Ativar AM - Ataque Especial custa 2PM por uso e precisa ser ativado antes de rolar o ataque.', 'am_ataque_especial'),
  vantagem('AM - Retornável', '1 ponto (necessário Arma Mágica)', 'Além do bônus de Arma Mágica, caso seja arremessada, esta arma retorna às mãos do herói no mesmo turno (não é necessário buscar o marcador da arma).', 'am_retornavel'),
  vantagem('AM - Sagrada', '1 ponto (necessário Arma Mágica)', 'Além do bônus de Arma Mágica, o herói recebe +1 de F e A quando luta contra Mortos-Vivos e criaturas malignas (que possuam ou sejam criadas com magia das Trevas ou Má Fama).', 'am_sagrada'),
  vantagem('AM - Veloz', '1 ponto (necessário Arma Mágica)', 'Além do bônus de Arma Mágica, o herói recebe +2 de H ao rolar iniciativa.', 'am_veloz'),
  vantagem('AM - Vorpal', '2 pontos (necessário Arma Mágica)', 'Além do bônus de Arma Mágica, quando o herói consegue um Acerto Crítico e causa dano, o alvo faz um teste de A. Se falhar, é derrotado imediatamente (PV reduzido a 0). Construtos e Mortos-Vivos apenas sofrem o dano normal.', 'am_vorpal'),
  vantagem('Armadura Extra - Normal', '2 pontos cada', 'Ao realizar testes que utilizam A, a A do herói será dobrada, mas apenas contra o tipo de dano escolhido: Corte; Perfuração; Contusão; Explosão; Calor/Fogo; Frio/Gelo; Luz; Eletricidade; Vento/Som; Químico (Água, Ácido, Venenos...).', 'armadura_extra_normal'),
  vantagem('Armadura Extra - F', '3 pontos', 'Ao realizar testes que utilizam A, a A do herói será dobrada, mas apenas contra ataques com Força.', 'armadura_extra_f'),
  vantagem('Armadura Extra - Mágica', '3 pontos', 'Ao realizar testes que utilizam A, a A do herói será dobrada, mas apenas contra ataques com Magia e Armas Mágicas.', 'armadura_extra_magica'),
  vantagem('Armadura Extra - PdF', '4 pontos', 'Ao realizar testes que utilizam A, a A do herói será dobrada, mas apenas contra ataques com PdF.', 'armadura_extra_pdf'),
  vantagem('Ataque Especial', '1 ponto', 'O herói gasta 2PM e realiza um ataque com +2 de F ou PdF (escolha um e anote na carta), e o ataque é considerado mágico. Sem esta Vantagem, qualquer herói pode gastar 1PM para atacar com +1 de F ou PdF.', 'ataque_especial'),
  vantagem('AE - Área', '3 pontos (necessário Ataque Especial)', 'Além do bônus de Ataque Especial, escolha um ponto dentro do alcance: todos os heróis a até 3" dele (aliados e o próprio herói incluídos) sofrem o ataque, com FA–1 para cada 1" de distância do centro. Cada alvo pode tentar uma Esquiva para reduzir a FA em 1. Só vale para PdF e custa +8PM.', 'ae_area'),
  vantagem('AE - Paralisante', '1 ponto (necessário Ataque Especial)', 'Além do bônus de Ataque Especial, acrescente os efeitos da Vantagem Paralisia. O herói gasta +2PM além do gasto de Ataque Especial.', 'ae_paralisante'),
  vantagem('AE - Preciso', '1 ponto (necessário Ataque Especial)', 'Além do bônus de Ataque Especial, este ataque impõe um redutor de –1 de H contra o alvo em sua FD.', 'ae_preciso'),
  vantagem('AE - Teleguiado', '1 ponto (necessário Ataque Especial)', 'Além do bônus de Ataque Especial, este ataque impõe ao alvo um redutor de –2 na H em sua FD e tentativas de Esquiva. Válido apenas para ataques com PdF e não exige linha de visão clara, apenas que o alvo esteja no alcance. Custa +2PM além do gasto com Ataque Especial.', 'ae_teleguiado'),
  vantagem('AE - Lento', '-1 ponto (Desvantagem para Ataque Especial)', 'Este Ataque Especial é lento: o alvo recebe +2 em Esquivas contra ele. Válido apenas para ataques com PdF. Mesmo com Desvantagens, um Ataque Especial nunca custa menos de 1 ponto.', 'ae_lento'),
  vantagem('AE - Perto da Morte', '-2 pontos (Desvantagem para Ataque Especial)', 'Este Ataque Especial só pode ser usado quando o herói está Perto da Morte (PV igual ou menor que sua R). Mesmo com Desvantagens, um Ataque Especial nunca custa menos de 1 ponto.', 'ae_perto_da_morte'),
  vantagem('Ataque Múltiplo', '1 ponto', 'Com uma única Ação, o herói faz vários ataques com Força contra inimigos em contato com sua base, até um máximo de ataques igual à sua H. Cada ataque (incluindo o primeiro) custa 2PM e a FA de cada um é calculada separadamente. O recuo de 1" acontece apenas depois do último ataque.', 'ataque_multiplo'),
  vantagem('Boa Fama', '1 ponto', 'Outros heróis aliados que estiverem a até 6" recebem +1 na FA. Quando um herói possui Boa Fama nenhum outro herói do grupo pode possuir a desvantagem Má Fama.', 'boa_fama'),
  vantagem('Clericato', '2 pontos', 'O herói recebe +1 de Focus em qualquer Caminho e pode usar magias com requisito Clericato, além de poder escolher Kits com esse requisito.', 'clericato'),
  vantagem('Deflexão', '1 ponto', 'Quando recebe um ataque com PdF, o herói pode gastar 2PM para dobrar sua H no cálculo da FD. Se a FD for igual ou maior que a FA, o ataque é desviado e não causa nenhum dano (nem o dano mínimo de 1 ponto). Conta como uma Esquiva para o limite por rodada.', 'deflexao'),
  vantagem('Energia Extra', '1 ou 2 pontos', 'O herói usa sua Ação e gasta 2PM para recuperar todos os seus PV. Por 1 ponto só pode ser usada quando está Perto da Morte; por 2 pontos pode ser usada a qualquer momento. Pode ser usada apenas uma vez por partida.', 'energia_extra'),
  vantagem('Energia Vital', '2 pontos', 'O herói pode gastar PV no lugar de PM para ativar Vantagens e magias (1 PV vale 1 PM). Não é possível gastar o último PV dessa forma.', 'energia_vital'),
  vantagem('Focus', '1 ponto por nível em cada Caminho', 'Representa o poder mágico do herói em um dos seis Caminhos (Água, Ar, Fogo, Luz, Terra e Trevas). Cada nível custa 1 ponto, e o máximo segue o limite das Características para a faixa do herói. Com pelo menos 1 ponto de Focus, o herói pode lançar magias (veja a página de Magias).', 'focus'),
  vantagem('Genialidade', '1 ponto', 'O herói recebe H+2 em todos os testes de H que não sejam ataque, defesa ou esquiva (escalar, terreno Perigoso...). Apenas um herói por grupo pode ter Genialidade.', 'genialidade'),
  vantagem('Invisibilidade', '2 pontos', 'O herói usa sua Ação e gasta 4PM para ficar invisível até o fim de seu próximo turno. Invisível, ele não pode ser alvo de ataques à distância nem de magias, e ataques corpo a corpo contra ele sofrem H–1. A invisibilidade termina se o herói atacar, usar magia ou sofrer dano.', 'invisibilidade'),
  vantagem('Levitação', '2 pontos', 'O herói voa. Ao Mover ou Correr ele ignora os custos e restrições de terreno Difícil, Floresta, Perigoso, Intransponível, Elevado e Bloqueador (passa por cima), mas precisa terminar o movimento em um local onde a miniatura possa ficar. Levitação não muda a linha de visão: Bloqueador continua bloqueando a visão.', 'levitacao'),
  vantagem('Paralisia', '1 ponto', 'O herói gasta 2PM ou mais e faz um ataque normal que não causa dano. Se a FA vencer a FD do alvo, ele faz um teste de R: se falhar, fica paralisado durante 1 rodada (+1 rodada a cada 2PM extras gastos). Um herói paralisado não pode ser ativado nem esquivar, e é considerado Indefeso. Qualquer dano recebido encerra a paralisia.', 'paralisia'),
  vantagem('Parceiro', '2 pontos', 'Dois heróis do mesmo grupo com esta Vantagem, um escolhido como Parceiro do outro. Quando um deles termina o turno, o outro pode ser ativado logo em seguida, antes do adversário, desde que estejam a até 6" um do outro.', 'parceiro'),
  vantagem('Pontos de Magia Extras', '1 ponto cada', 'O herói recebe +10 PM. Pode ser comprada várias vezes e não altera a R verdadeira.', 'pontos_de_magia_extras'),
  vantagem('Pontos de Vida Extras', '1 ponto cada', 'O herói recebe +10 PV. Pode ser comprada várias vezes e não altera a R verdadeira.', 'pontos_de_vida_extras'),
  vantagem('Reflexão', '2 pontos', 'Igual à Deflexão, mas custa 4PM e, se a FD for igual ou maior que a FA, o ataque é devolvido ao atacante com a mesma FA original (o atacante defende normalmente). Conta como uma Esquiva para o limite por rodada.', 'reflexao'),
  vantagem('Perícia: Crime', '2 pontos', 'Emboscada: no deploy, o herói é posicionado depois de todos os outros heróis (dos dois jogadores), seguindo as regras normais de distância da borda.', 'pericia_crime'),
  vantagem('Perícia: Esporte', '2 pontos', 'O herói escala terreno Elevado sem fazer teste de H e atravessa terreno Difícil de água (rios, lagos rasos, pântanos) sem custo extra de movimento.', 'pericia_esporte'),
  vantagem('Perícia: Sobrevivência', '2 pontos', 'O herói ignora o custo extra de movimento em terreno Floresta e recebe H+1 no teste de terreno Perigoso.', 'pericia_sobrevivencia'),
  vantagem('Regeneração', '3 pontos', 'No início de cada turno do herói, ele recupera 1 PV. Não funciona se o herói estiver com 0 PV e não recupera PM.', 'regeneracao'),
  vantagem('Resistência à Magia', '1 ponto', 'O herói recebe +3 em testes de R para resistir a magias e efeitos de Focus. Não protege contra dano. Um resultado 6 continua sendo sempre falha.', 'resistencia_a_magia'),
  vantagem('Sentidos Especiais', '1 ponto (três sentidos) ou 2 pontos (todos)', 'Audição Aguçada: ataques corpo a corpo contra inimigos invisíveis não sofrem redutor. Faro Aguçado: o herói sabe onde estão heróis invisíveis a até 6". Infravisão: ignora o limite de linha de visão do cenário noturno. Ver o Invisível: Invisibilidade não funciona contra o herói. Visão Aguçada: +3" no alcance de PdF. Visão de Raios-X: o herói traça linha de visão através de terreno Bloqueador (o ataque ainda não atravessa).', 'sentidos_especiais'),
  vantagem('Teleporte', '2 pontos', 'No lugar de Mover, o herói pode se teleportar para qualquer ponto em linha de visão a até H x 2", ignorando terreno e miniaturas no caminho. Também recebe +2 em Esquivas (não cumulativo com Aceleração). Teleporte não pode ser usado para Correr.', 'teleporte'),
  vantagem('Tiro Carregável', '2 pontos', 'O herói gasta 2PM e usa sua Ação para carregar o disparo. No seu próximo turno, seu primeiro ataque com PdF tem o PdF dobrado. Se sofrer dano antes de disparar, a carga é perdida.', 'tiro_carregavel'),
  vantagem('Tiro Múltiplo', '2 pontos', 'Com uma única Ação, o herói faz vários ataques com PdF, contra um ou mais alvos no alcance e na linha de visão, até um máximo de ataques igual à sua H. Cada ataque (incluindo o primeiro) custa 2PM e a FA de cada um é calculada separadamente.', 'tiro_multiplo'),
  vantagem('Toque de Energia', '1 ponto', 'O herói usa sua Ação e gasta 4PM para atacar todos os inimigos em contato com sua base com FA igual a A+1d (a H não entra). O tipo de dano é escolhido na criação e anotado na carta.', 'toque_de_energia')
]

const DESVANTAGENS: IVantagemDesvantagem[] = [
  desvantagem('Ambiente Especial', '-1 ponto', 'Escolha um tipo de ambiente (água, gelo, floresta...). Ao fim de cada rodada em que o herói não estiver dentro ou em contato com terreno desse ambiente, ele recebe um marcador. Com 3 marcadores, sofre –1 em F e R até entrar no ambiente, o que remove todos os marcadores. Combine com o oponente antes de montar o terreno.', 'ambiente_especial'),
  desvantagem('Assombrado', '-2 pontos', 'No início de cada rodada role 1d: com 4, 5 ou 6 o herói sofre –1 em todas as Características até o fim da rodada.', 'assombrado'),
  desvantagem('Código de Honra', '-1 ponto cada', 'Combate: nunca ataca um inimigo Indefeso nem um que já foi atacado corpo a corpo por um aliado nesta rodada. Derrota: nunca usa Correr para se afastar de inimigos. Caçador: se puder atacar, sempre ataca o inimigo de maior PH ao seu alcance. Heróis: se um aliado a até 6" estiver Perto da Morte, o herói deve se mover e atacar o inimigo mais próximo desse aliado. Vários Códigos podem ser combinados.', 'codigo_de_honra'),
  desvantagem('Curto-Circuito', '-2 pontos', 'Igual a Assombrado, mas apenas para Construtos.', 'curto_circuito'),
  desvantagem('Devoção', '-2 pontos', 'No deploy, escolha e anuncie um herói inimigo. Enquanto ele estiver em jogo, o herói sofre –1 em todas as Características em qualquer turno em que não se mova em direção a ele nem o ataque.', 'devocao'),
  desvantagem('Fetiche', '-1 ponto', 'Apenas para heróis com Focus. Sempre que sofrer mais de 1 ponto de dano, faz um teste de H: se falhar, não pode usar magia no seu próximo turno.', 'fetiche'),
  desvantagem('Fúria', '-1 ponto', 'Sempre que sofrer dano, o herói faz um teste de R. Se falhar, entra em Fúria: no seu próximo turno deve se mover em direção a quem o feriu e atacá-lo (usando Correr se não o alcançar). Em Fúria recebe H+1 e FA+1, mas não pode esquivar nem gastar PM. A Fúria termina quando o alvo é derrotado; o herói sofre –1 em todas as Características até o fim da rodada seguinte.', 'furia'),
  desvantagem('Má Fama', '-1 ponto', 'Heróis aliados não podem usar Vantagens ou magias de apoio (cura, proteção, bônus) neste herói. Não pode estar no mesmo grupo que um herói com Boa Fama.', 'ma_fama'),
  desvantagem('Modelo Especial', '-1 ponto', 'O corpo do herói foge do padrão humano (muito grande, muito pequeno ou de formato estranho). Ele sofre –1 em testes de H para escalar e não pode usar portas, escadas e passagens de terreno feitas para humanos (combine com o oponente antes da partida).', 'modelo_especial'),
  desvantagem('Monstruoso', '-1 ponto', 'O herói é grande e chamativo: inimigos recebem +1 na FA ao atacá-lo à distância. Não pode ser combinado com Aparência Inofensiva.', 'monstruoso'),
  desvantagem('Munição Limitada', '-1 ponto', 'O herói pode fazer apenas PdF x 2 ataques com PdF por partida. Marque cada disparo na ficha.', 'municao_limitada'),
  desvantagem('Ponto Fraco', '-1 ponto', 'Depois que o herói fizer seu primeiro ataque na partida, todos os inimigos recebem H+1 quando lutam contra ele.', 'ponto_fraco'),
  desvantagem('Restrição de Magia', '-1 a -3 pontos', 'Apenas para heróis com pelo menos 3 pontos em Focus. A magia do herói não funciona em certa condição, combinada antes da partida: incomum, –1 (ex.: contra Mortos-Vivos); comum, –2 (ex.: contra humanoides); muito comum, –3 (ex.: contra qualquer criatura viva).', 'restricao_de_magia'),
  desvantagem('Vulnerabilidade', '-1 a -3 pontos cada', 'Contra o tipo de dano escolhido, a A do herói é reduzida à metade (arredonde para baixo) no cálculo da FD. –1 ponto para um tipo simples (Corte; Perfuração; Contusão; Explosão; Calor/Fogo; Frio/Gelo; Luz; Eletricidade; Vento/Som; Químico), –2 pontos para Força ou para Magia e Armas Mágicas, –3 pontos para PdF.', 'vulnerabilidade')
]

const TODAS: IVantagemDesvantagem[] = [...VANTAGENS, ...DESVANTAGENS].map(item => ({ ...item, ...(REGRAS_ESPECIAIS[item.value] ?? {}) }))
const POR_VALOR = new Map(TODAS.map(item => [item.value, item]))

// Focus é comprado nos campos próprios da ficha, não pela lista de vantagens.
const FORA_DO_SELETOR = new Set(['focus'])

export namespace VantagensEDesvantagensLib {

  export function listarVantagensEDesvantagens () {
    return TODAS
  }

  export function obter (value: string) {
    return POR_VALOR.get(value)
  }

  export function listarVantagensEDesvantagensCombo (tipo: TipoVantagemEnum) {
    const combo = TODAS.filter(item => item.tipo === tipo && !FORA_DO_SELETOR.has(item.value)).map(item => ({ label: item.nome, value: item.value }))

    return combo as IComboBox[]
  }
}
