<template>
  <q-page class="pagina">
    <CabecalhoPagina
      sobretitulo="Livro de regras"
      titulo="Regras do jogo"
      descricao="Tudo o que você precisa para montar a mesa, posicionar seus heróis e resolver os combates."
    />

    <IndiceSecoes :itens="indice" />

    <!-- 1. Princípios gerais -->
    <section class="bloco">
      <TituloSecao
        numero="1"
        titulo="Princípios gerais"
        ancora="principios"
      />

      <CaixaDestaque
        tipo="importante"
        titulo="Regra de ouro"
      >
        <p>Se uma regra entrar em conflito ou não cobrir uma situação, resolva com bom senso e acordo entre os jogadores. Sempre que possível, informe ao criador do jogo para ajudar a melhorar o 3DeTatics.</p>
      </CaixaDestaque>

      <TituloSecao
        titulo="3D&T Turbinado"
        :nivel="3"
      />
      <p>As regras do 3D&T Turbinado são a base do 3DeTatics, no geral as regras são as mesmas, mas com suas devidas adaptações para um wargame. Você é livre para modificar as regras, mas lembre-se, 3DeTatics não é um RPG, tenha bom senso.</p>

      <TituloSecao
        titulo="Objetivo"
        :nivel="3"
      />
      <p>Escaramuça! Ganha quem derrotar os heróis do jogador adversário. Na seção Modos de jogo você encontra outras formas de jogar, com objetivos diferentes.</p>
    </section>

    <!-- 2. Configuração -->
    <section class="bloco">
      <TituloSecao
        numero="2"
        titulo="Configuração"
        ancora="configuracao"
      />

      <TituloSecao
        titulo="Os grupos"
        :nivel="3"
      />
      <p>No modo normal, o jogo é para 2 jogadores. Em alguns modos de jogo (veja Modos de jogo), esse número pode variar. Cada jogador monta um grupo do mesmo tamanho: recomendo o tamanho Novato para iniciantes e Lenda para veteranos.</p>

      <TituloSecao
        titulo="Tamanho dos grupos"
        :nivel="3"
      />
      <p>Os grupos são divididos em 4 tamanhos, sendo o <b>Novato</b> o ideal para conhecer o jogo.</p>
      <div class="tabela-rolagem">
        <table class="tabela-regras">
          <thead>
            <tr>
              <th>Tamanho</th>
              <th>5 pts</th>
              <th>7 pts</th>
              <th>10 pts</th>
              <th>12 pts</th>
              <th>Campo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tamanho in tamanhosGrupo"
              :key="tamanho.nome"
            >
              <td><span class="termo">{{ tamanho.nome }}</span></td>
              <td>{{ tamanho.h5 }}</td>
              <td>{{ tamanho.h7 }}</td>
              <td>{{ tamanho.h10 }}</td>
              <td>{{ tamanho.h12 }}</td>
              <td>{{ tamanho.campo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CaixaDestaque
        tipo="nota"
        titulo="Kits repetidos"
      >
        <p>Não pode possuir heróis com kits iguais por grupo de pontos. Exemplo: se seu grupo é do tamanho Novato, 3 heróis de 5 pts com kits diferentes e 2 heróis de 7 pts com kits diferentes. Mas você pode possuir um herói de 5 pts com kit Guerreiro e outro de 7 pts também com kit Guerreiro.</p>
      </CaixaDestaque>

      <TituloSecao
        titulo="Campo de batalha"
        :nivel="3"
      />
      <p>O tamanho do campo varia conforme o grupo (veja a tabela acima), mas você pode usar qualquer dimensão. Como o jogo não utiliza grids, adotamos duas medidas de referência: pés (’) e polegadas (”).</p>
      <ul>
        <li><span class="termo">1’ (pé):</span> 12” ou 30,5 cm.</li>
        <li><span class="termo">1” (polegada):</span> 2,5 cm.</li>
      </ul>

      <TituloSecao
        titulo="Terrenos"
        :nivel="3"
      />
      <p>Como em todo wargame de fantasia, os terrenos criam desafios de movimentação e estratégia. Eles se dividem em oito tipos.</p>
      <div class="pilha">
        <ItemRegra
          v-for="terreno in terrenos"
          :key="terreno.nome"
          :nome="terreno.nome"
        >
          <p>{{ terreno.descricao }}</p>
          <ul v-if="terreno.regras.length">
            <li
              v-for="regra in terreno.regras"
              :key="regra.rotulo"
            >
              <span class="termo">{{ regra.rotulo }}:</span> {{ regra.texto }}
            </li>
          </ul>
        </ItemRegra>
      </div>

      <TituloSecao
        titulo="Montagem de terreno"
        :nivel="3"
      />
      <p>Antes da partida, monte o campo com pelo menos 15 a 20 peças de terreno. Quanto mais terrenos houver, mais estratégica será a partida. Uma boa referência é cobrir cerca de 50% da mesa, distribuindo as peças de forma equilibrada entre os lados. Varie os tipos de terreno para que diferentes unidades e habilidades tenham utilidade durante o jogo. Siga as proporções abaixo:</p>
      <ul>
        <li>50% dos terrenos devem bloquear linha de visão.</li>
        <li>33% devem fornecer cobertura.</li>
        <li>33% devem ser terrenos difíceis.</li>
        <li>Cada jogador escolhe 1 terreno perigoso.</li>
      </ul>
      <CaixaDestaque
        tipo="nota"
        titulo="Por que as proporções passam de 100%"
      >
        <p>As categorias se sobrepõem: uma mesma peça pode contar em mais de uma. Uma floresta densa, por exemplo, bloqueia a linha de visão e também é terreno difícil; um muro baixo de ruínas dá cobertura e é terreno difícil. Use as proporções como guia para a variedade da mesa, não como uma soma exata.</p>
      </CaixaDestaque>
      <div class="imagem-unica">
        <ImagemExemplo
          alt="Mesa de jogo montada com várias peças de terreno: rochas, árvores, ruínas e muros."
          legenda="Exemplo de mesa montada"
          :src="imagens.terreno"
        />
      </div>

      <TituloSecao
        titulo="Posicionamento dos heróis"
        :nivel="3"
      />
      <p>Cada jogador deve selecionar o herói com a maior pontuação de Iniciativa, considerando o maior valor de H e quaisquer vantagens que concedam bônus à iniciativa. Em seguida, ambos rolam H + bônus (se houver) + 1D6. O jogador com o maior resultado vence a iniciativa e deve escolher um dos quatro lados do campo como sua zona de deploy. O jogador que perder a iniciativa deve jogar no lado oposto.</p>
      <p>Após definir os lados, o jogador que venceu a iniciativa deve colocar o primeiro herói em campo, a até 12” da borda correspondente ao seu lado. Os jogadores então se alternam, colocando um herói por vez até que todos estejam posicionados. Quando todos os heróis estiverem em campo, ambos os jogadores devem rolar novamente a iniciativa. O vencedor dessa nova rolagem será o primeiro a jogar.</p>
    </section>

    <!-- 3. Jogando -->
    <section class="bloco">
      <TituloSecao
        numero="3"
        titulo="Jogando"
        ancora="jogando"
      />

      <TituloSecao
        titulo="Unidade de tempo"
        :nivel="3"
      />
      <p>O jogo é dividido em dois tipos de tempo, turno e rodada. Não há um limite de "tempo de jogo": o jogo termina quando todos os heróis do grupo adversário forem derrotados (ou quando alguma condição de modos alternativos for cumprida).</p>
      <ul>
        <li><span class="termo">Turno:</span> cada vez que um herói finaliza suas ações de jogo é considerado um turno.</li>
        <li><span class="termo">Rodada:</span> quando todos os heróis em campo finalizarem seus turnos, é considerado uma rodada.</li>
      </ul>

      <TituloSecao
        titulo="Ativando o herói"
        :nivel="3"
      />
      <p>Cada herói pode ser ativado apenas <b>uma vez por rodada</b>, exceto em situações de defesa/esquiva ou testes que o valham. Após o herói ser ativado e ter utilizado suas ações, adicione um marcador ao lado do herói: ele só poderá ser ativado novamente no início da nova rodada.</p>

      <TituloSecao
        titulo="Ações do herói"
        :nivel="3"
      />
      <p>Cada herói pode executar 3 tipos de ações durante sua ativação, seguindo o mesmo princípio do Manual 3D&T Revisado, Ampliado e Turbinado.</p>
      <div class="tabela-rolagem">
        <table class="tabela-regras">
          <thead>
            <tr>
              <th>Ação</th>
              <th>Quando</th>
              <th>Efeito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="termo">Mover</span></td>
              <td>Uma vez por turno</td>
              <td>Move até 6" (a menos que algo diga o contrário), antes ou depois de executar uma Ação.</td>
            </tr>
            <tr>
              <td><span class="termo">Ação</span></td>
              <td>Uma vez por turno</td>
              <td>Atacar, usar uma vantagem (algumas não usam ação), lançar uma magia e afins.</td>
            </tr>
            <tr>
              <td><span class="termo">Correr</span></td>
              <td>Uma vez por turno, se não usou Mover nem Ação</td>
              <td>Move 2 x Mover e finaliza o turno.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <TituloSecao
        titulo="Mover"
        :nivel="3"
      />
      <p>Cada herói pode mover até 6" por turno (ele não precisa mover seu máximo de movimento), seguindo para qualquer direção em que seja possível se movimentar. Algumas vantagens, desvantagens e magias podem adicionar ou remover polegadas do movimento.</p>
      <div class="par-imagens">
        <ImagemExemplo
          alt="Trena saindo da ponta da base da miniatura."
          legenda="Certo: a régua sai da ponta da base"
          tipo="certo"
          :src="imagens.certo_1"
        />
        <ImagemExemplo
          alt="Miniatura posicionada antes do fim da régua."
          legenda="Certo: o herói para antes do fim da régua"
          tipo="certo"
          :src="imagens.certo_2"
        />
        <ImagemExemplo
          alt="Trena saindo do meio da base da miniatura."
          legenda="Errado: a régua sai de outro ponto da base"
          tipo="errado"
          :src="imagens.errado_1"
        />
        <ImagemExemplo
          alt="Miniatura posicionada depois do fim da régua."
          legenda="Errado: o herói passa do fim da régua"
          tipo="errado"
          :src="imagens.errado_2"
        />
      </div>

      <TituloSecao
        titulo="Ação"
        :nivel="3"
      />
      <p>Utilizar uma ação segue o mesmo princípio do 3D&T Turbinado: geralmente um ataque, usar uma vantagem ou uma magia e assim por diante. O herói só pode utilizar <b>uma Ação por turno</b>, a não ser que algo diga o contrário.</p>
      <p><span class="termo">Ataque:</span> o ataque é considerado uma Ação. Para atacar ou defender as regras são as mesmas do 3D&T Turbinado (veja Combate), lembrando que todo ataque, mesmo que a FD do alvo seja maior, causa 1 ponto de dano. Para atacar, o herói atacante deve estar encostado na base do herói alvo e, após o ataque, o herói atacante recua 1" da base do herói alvo.</p>
      <div class="par-imagens">
        <ImagemExemplo
          alt="Duas miniaturas com as bases encostadas."
          legenda="Ao atacar: bases em contato"
          :src="imagens.atacar_1"
        />
        <ImagemExemplo
          alt="Miniatura atacante afastada 1 polegada do alvo."
          legenda="Após atacar: recua 1&quot;"
          :src="imagens.atacar_2"
        />
      </div>

      <TituloSecao
        titulo="Atacar à distância"
        :nivel="3"
      />
      <p>Atacar à distância segue quase as mesmas regras do 3D&T Turbinado, com a diferença de que, para executar um ataque à distância, o herói precisa ter pelo menos PdF1. Além disso, o herói precisa ter uma linha de visão clara do herói alvo. Para alcançar o ataque, pelo menos 1/4" deve passar da base do alvo.</p>
      <p><span class="termo">Alcance:</span> o alcance do ataque à distância depende do PdF do herói atacante.</p>
      <div class="tabela-rolagem">
        <table class="tabela-regras tabela-regras--compacta">
          <thead>
            <tr>
              <th>PdF</th>
              <th
                v-for="linha in alcancePdf"
                :key="linha.valor"
              >
                {{ linha.valor }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="termo">Alcance</span></td>
              <td
                v-for="linha in alcancePdf"
                :key="linha.valor"
              >
                {{ linha.alcance }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="par-imagens">
        <ImagemExemplo
          alt="Régua de alcance ultrapassando a base do alvo."
          legenda="Com alcance"
          tipo="certo"
          :src="imagens.alcanca"
        />
        <ImagemExemplo
          alt="Régua de alcance terminando antes da base do alvo."
          legenda="Sem alcance"
          tipo="errado"
          :src="imagens.nao_alcanca"
        />
      </div>

      <TituloSecao
        titulo="Linha de visão"
        :nivel="3"
      />
      <p>O herói atacante precisa enxergar pelo menos 50% da miniatura do herói alvo.</p>
      <div class="par-imagens">
        <ImagemExemplo
          alt="Miniatura alvo quase toda visível atrás de um obstáculo."
          legenda="Com visão: 50% ou mais da miniatura"
          tipo="certo"
          :src="imagens.visao1"
        />
        <ImagemExemplo
          alt="Outra miniatura alvo visível em boa parte."
          legenda="Com visão: 50% ou mais da miniatura"
          tipo="certo"
          :src="imagens.visao2"
        />
        <ImagemExemplo
          alt="Miniatura alvo quase toda escondida atrás de um obstáculo."
          legenda="Sem visão: menos de 50% da miniatura"
          tipo="errado"
          :src="imagens.sem_visao1"
        />
        <ImagemExemplo
          alt="Outra miniatura alvo escondida em sua maior parte."
          legenda="Sem visão: menos de 50% da miniatura"
          tipo="errado"
          :src="imagens.sem_visao2"
        />
      </div>

      <TituloSecao
        titulo="Arremesso de arma"
        :nivel="3"
      />
      <p>Segue o mesmo conceito de ataque à distância. Caso o herói não tenha PdF e queira atacar à distância, ele pode arremessar sua arma (desde que utilize uma) e tenha pelo menos F1, atacando com F em vez de PdF. Após arremessar a arma, adicione um marcador (simbolizando a arma) à frente do herói alvo: até o herói atacante buscar a arma, ele fica com FA-2. O alcance do arremesso é baseado em sua Força.</p>
      <div class="tabela-rolagem">
        <table class="tabela-regras tabela-regras--compacta">
          <thead>
            <tr>
              <th>F</th>
              <th
                v-for="linha in alcanceArremesso"
                :key="linha.valor"
              >
                {{ linha.valor }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="termo">Alcance</span></td>
              <td
                v-for="linha in alcanceArremesso"
                :key="linha.valor"
              >
                {{ linha.alcance }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 4. Combate -->
    <section class="bloco">
      <TituloSecao
        numero="4"
        titulo="Combate"
        ancora="combate"
      />

      <TituloSecao
        titulo="Pontos de Vida e de Magia"
        :nivel="3"
      />
      <p>Para manter as fichas fixas e prontas para impressão, nada é rolado na criação: cada herói começa a partida com PV e PM iguais à sua R multiplicada pelo valor indicado no seu kit (sem kit, <b>PV = R x 5</b> e <b>PM = R x 5</b>). Heróis com R0 têm 1 PV e 1 PM. Vantagens como Pontos de Vida Extras e Pontos de Magia Extras aumentam esses valores. PV e PM não se recuperam durante a partida, a não ser por Vantagens ou magias.</p>

      <TituloSecao
        titulo="Força de Ataque e Força de Defesa"
        :nivel="3"
      />
      <div class="tabela-rolagem">
        <table class="tabela-regras">
          <tbody>
            <tr>
              <th>Força de Ataque (FA)</th>
              <td>H + F + 1D6 corpo a corpo, ou H + PdF + 1D6 à distância.</td>
            </tr>
            <tr>
              <th>Força de Defesa (FD)</th>
              <td>H + A + 1D6.</td>
            </tr>
            <tr>
              <th>Dano</th>
              <td>FA – FD, com mínimo de 1 ponto (Deflexão e Reflexão bem-sucedidas são a exceção: não causam dano).</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><span class="termo">Acerto Crítico:</span> um 6 no dado da FA dobra a F ou o PdF; um 6 no dado da FD dobra a A. Bônus de H nunca são dobrados. Se o valor já estava dobrado (Armadura Extra, Tiro Carregável), ele é triplicado.</p>
      <p><span class="termo">Ataque Especial simples:</span> qualquer herói pode gastar 1 PM antes de rolar o ataque para ganhar F+1 ou PdF+1.</p>

      <TituloSecao
        titulo="Esquiva"
        :nivel="3"
      />
      <p>Antes de rolar a FD, o herói atacado pode tentar uma Esquiva: um teste de H com redutor igual à H do atacante. Se passar, o ataque não acerta. Cada herói pode tentar no máximo H esquivas por rodada, e só uma vez contra cada ataque. Um 6 é sempre falha. Aceleração dá +1 e Teleporte dá +2 nas esquivas (não cumulativos).</p>

      <TituloSecao
        titulo="Indefeso"
        :nivel="3"
      />
      <p>Um herói paralisado, atacado pelas costas sem ter visto o atacante, ou impedido de se defender por qualquer efeito é considerado Indefeso: sua FD é apenas a A, sem H e sem rolar o dado, e ele não pode esquivar.</p>

      <TituloSecao
        titulo="Perto da Morte e Derrota"
        :nivel="3"
      />
      <ul>
        <li><span class="termo">Perto da Morte:</span> o herói está Perto da Morte quando seus PV ficam iguais ou menores que sua R (máximo 5 PV). Algumas Vantagens só funcionam nesse estado.</li>
        <li><span class="termo">Derrota:</span> com 0 PV o herói é derrotado e sua miniatura sai do campo. Não há testes de morte no 3DeTatics.</li>
      </ul>

      <TituloSecao
        titulo="Distâncias das Vantagens"
        :nivel="3"
      />
      <p>As Vantagens do manual original usam metros. No 3DeTatics todas as distâncias já foram convertidas para polegadas (") e os efeitos que duravam "turnos de combate" agora duram turnos de ativação ou rodadas, como indicado em cada Vantagem.</p>

      <CaixaDestaque
        tipo="nota"
        titulo="Magias"
      >
        <p>
          As regras de Focus, Caminhos e a lista de magias estão na <router-link to="/magias">
            página de Magias
          </router-link>.
        </p>
      </CaixaDestaque>
    </section>

    <!-- 5. Modos de jogo -->
    <section class="bloco">
      <TituloSecao
        numero="5"
        titulo="Modos de jogo"
        ancora="modos"
      />
      <p>Escaramuça é o modo padrão. Os modos abaixo mudam apenas o objetivo da partida: o resto das regras continua igual. Combine o modo antes de montar a mesa.</p>

      <div class="pilha">
        <ItemRegra
          v-for="modo in modosDeJogo"
          :key="modo.nome"
          :nome="modo.nome"
          :etiquetas="modo.etiquetas"
        >
          <p
            v-for="(paragrafo, indice) in modo.regras"
            :key="indice"
          >
            {{ paragrafo }}
          </p>
        </ItemRegra>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import TituloSecao from 'components/TituloSecao.vue'
import IndiceSecoes from 'components/IndiceSecoes.vue'
import CaixaDestaque from 'components/CaixaDestaque.vue'
import ItemRegra from 'components/ItemRegra.vue'
import ImagemExemplo from 'components/ImagemExemplo.vue'
import { imagens } from 'src/libs/imagens'

const indice = [
  { ancora: 'principios', titulo: '1. Princípios gerais' },
  { ancora: 'configuracao', titulo: '2. Configuração' },
  { ancora: 'jogando', titulo: '3. Jogando' },
  { ancora: 'combate', titulo: '4. Combate' },
  { ancora: 'modos', titulo: '5. Modos de jogo' }
]

const modosDeJogo = [
  {
    nome: 'Escaramuça',
    etiquetas: [{ rotulo: 'Jogadores', valor: '2' }, { rotulo: 'Duração', valor: 'sem limite de rodadas' }],
    regras: ['O modo padrão. Vence quem derrotar todos os heróis do grupo adversário.']
  },
  {
    nome: 'Domínio',
    etiquetas: [{ rotulo: 'Jogadores', valor: '2' }, { rotulo: 'Duração', valor: '6 rodadas' }],
    regras: [
      'Antes do deploy, coloque 3 marcadores de objetivo: um no centro da mesa e dois nos pontos médios das bordas que não são zonas de deploy (ou outra disposição combinada), sempre a pelo menos 6" das zonas de deploy.',
      'Um objetivo é controlado por um jogador quando ele tem um herói em contato com o marcador e nenhum herói inimigo está em contato com ele. No fim de cada rodada, cada objetivo controlado vale 1 ponto.',
      'Depois da 6ª rodada vence quem tiver mais pontos. Derrotar todos os heróis inimigos encerra a partida com vitória imediata. Em caso de empate, vence quem derrotou mais PH inimigos.'
    ]
  },
  {
    nome: 'Caça ao Líder',
    etiquetas: [{ rotulo: 'Jogadores', valor: '2' }, { rotulo: 'Duração', valor: 'sem limite de rodadas' }],
    regras: [
      'Antes do deploy, cada jogador anota em segredo qual dos seus heróis é o líder. O líder só é revelado quando for derrotado.',
      'Vence quem derrotar o líder adversário primeiro. Se os dois líderes caírem na mesma rodada, vence quem tiver mais PH em campo.'
    ]
  },
  {
    nome: 'Batalha Real',
    etiquetas: [{ rotulo: 'Jogadores', valor: '3 ou 4' }, { rotulo: 'Duração', valor: '8 rodadas' }],
    regras: [
      'Use o campo do tamanho de grupo seguinte (um grupo Novato joga em 3’ x 3’, por exemplo). Cada jogador escolhe um lado ou canto da mesa pela ordem da iniciativa, e o deploy segue a mesma ordem.',
      'As ativações seguem a ordem da iniciativa: cada jogador ativa um herói por vez, em rodízio, até todos os heróis terem sido ativados.',
      'Vence o último jogador com heróis em campo. Se a 8ª rodada terminar com mais de um grupo de pé, vence quem derrotou mais PH inimigos.'
    ]
  }
]

const tamanhosGrupo = [
  { nome: 'Novato', h5: 3, h7: 2, h10: '–', h12: '–', campo: '2’ x 2’ (61 x 61 cm)' },
  { nome: 'Lutador', h5: 3, h7: 2, h10: 2, h12: '–', campo: '3’ x 3’ (91 x 91 cm)' },
  { nome: 'Campeão', h5: 3, h7: 3, h10: 3, h12: 1, campo: '4’ x 4’ (1,22 x 1,22 m)' },
  { nome: 'Lenda', h5: 3, h7: 3, h10: 3, h12: 3, campo: '4’ x 4’ (1,22 x 1,22 m)' }
]

const alcancePdf = [
  { valor: 0, alcance: '0"' },
  { valor: 1, alcance: '3"' },
  { valor: 2, alcance: '6"' },
  { valor: 3, alcance: '12"' },
  { valor: 4, alcance: '18"' },
  { valor: 5, alcance: '24"' }
]

const alcanceArremesso = [
  { valor: 0, alcance: '2"' },
  { valor: 1, alcance: '3"' },
  { valor: 2, alcance: '6"' },
  { valor: 3, alcance: '9"' },
  { valor: 4, alcance: '12"' },
  { valor: 5, alcance: '15"' }
]

const terrenos = [
  {
    nome: 'Campo',
    descricao: 'Base do campo de batalha (grama, deserto, etc.). Não oferece bônus, penalidades ou condições especiais.',
    regras: []
  },
  {
    nome: 'Intransponível',
    descricao: 'Áreas que impedem a passagem (montanhas, precipícios, rios de lava, águas profundas, etc.). Só podem ser atravessadas com vantagens específicas, como Levitação.',
    regras: []
  },
  {
    nome: 'Bloqueador',
    descricao: 'Obstáculos sólidos (rochas, muralhas, torres, estátuas, etc.). Bloqueiam visão e movimento, a não ser que o herói possua a perícia Escalar (muro) ou a vantagem Visão de Raio-X.',
    regras: []
  },
  {
    nome: 'Floresta',
    descricao: 'Bosques, selvas, mata fechada, etc.',
    regras: [
      { rotulo: 'Bônus', texto: 'FD+1 contra ataques à distância caso o defensor esteja dentro do terreno e o atacante fora.' },
      { rotulo: 'Atacar', texto: 'Caso o atacante esteja fora da floresta, ataques à distância não atravessam para atingir alvos fora dela.' },
      { rotulo: 'Mover', texto: 'Custa 2” para cada 1” (ex.: herói com 6” move apenas 3”). Pode ser ignorado com vantagens como Arena (Floresta), Levitação ou Sobrevivência (Floresta).' }
    ]
  },
  {
    nome: 'Cobertura',
    descricao: 'Ruínas, paredes baixas, escombros, caixas e similares, que permitem esconder-se parcialmente.',
    regras: [
      { rotulo: 'Bônus', texto: 'FD+1 contra ataques à distância caso o defensor esteja dentro do terreno e o atacante fora.' }
    ]
  },
  {
    nome: 'Difícil',
    descricao: 'Rios, lama, matas fechadas, escombros, terrenos acidentados e similares.',
    regras: [
      { rotulo: 'Mover', texto: 'Custa 2” para cada 1”. Ignorado se possuir vantagens como Arena (Lama), Levitação ou Natação (no caso de rios) ou perícias/vantagens equivalentes.' }
    ]
  },
  {
    nome: 'Perigoso',
    descricao: 'Rios de lava, espinhos, areia movediça e similares, que podem ferir ou matar o herói. Ao entrar no terreno, o herói realiza um teste de H-1 na primeira polegada.',
    regras: [
      { rotulo: 'Falha no teste', texto: 'Recebe 1D6 de dano e perde o movimento.' },
      { rotulo: 'Repete', texto: 'O teste deve ser feito novamente na próxima vez que o herói tentar se mover no terreno, até conseguir sair.' }
    ]
  },
  {
    nome: 'Elevado',
    descricao: 'Colinas, muros, telhados e similares.',
    regras: [
      { rotulo: 'Altura >3”', texto: 'Intransponível.' },
      { rotulo: 'Altura ≤3”', texto: 'Pode ser escalado como parte do movimento; não é permitido terminar o movimento no meio da escalada. Necessário teste de H para escalar, a menos que o herói possua Perícia Escalar ou outra vantagem que dispense o teste.' },
      { rotulo: 'Altura ≤1”', texto: 'Pode ser ignorado para fins de movimento (não é necessário subir e descer).' },
      { rotulo: 'Cair', texto: 'Se um herói cair ou for empurrado de uma altura ≥2”, sofre 1D6 de dano para cada 1” completa de queda; após a queda, posicione o herói a 2” da base do terreno onde caiu.' }
    ]
  }
]
</script>

<style scoped lang="scss">
.par-imagens {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--esp-4);
  margin: var(--esp-3) 0 var(--esp-5);

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
  }
}

.imagem-unica {
  max-width: 600px;
  margin: var(--esp-3) auto var(--esp-5);
}

.tabela-regras--compacta {
  th,
  td {
    text-align: center;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }
}

ul {
  padding-left: var(--esp-5);
  margin: 0 0 var(--esp-3);

  li {
    margin-bottom: var(--esp-1);
  }
}
</style>
