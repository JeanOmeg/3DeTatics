<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h4 text-center text-primary q-pb-md">INTRODUÇÃO</div>
        <q-separator />
      </q-card-section>

      <q-card-section>
        <p class="text-body1">
          <b>3D&Tatics</b> é um wargame de miniaturas no estilo <b><i>skirmish</i></b
          >, o skirmish é um tipo de jogo em que cada jogador comanda poucas miniaturas individuais, geralmente representando heróis específicos, em vez de grandes exércitos. 3D&Tatics traz para a mesa a essência dos clássicos eletrônicos de estratégia em turnos, como Final Fantasy Tactics e Fire
          Emblem. Cada jogador comanda um grupo de heróis representados por miniaturas de RPG e cartas que funcionam como fichas, mostrando atributos e habilidades únicas, no espírito do 3D&T clássico. As batalhas acontecem em tabuleiros que exigem planejamento, posicionamento e uso inteligente de
          recursos. O jogo é simples de aprender, mas profundo o bastante para desafiar veteranos, entregando partidas intensas em que cada decisão conta. 3D&Tatics combina nostalgia e inovação para quem curte estratégia e o universo 3D&T.
        </p>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h4 text-center text-primary q-pb-md">PRINCÍPIOS GERAIS</div>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="text-h5 text-center text-negative">Regra de ouro</div>
      </q-card-section>

      <q-card-section>
        <p class="text-body1">Se uma regra entrar em conflito ou não cobrir uma situação, resolva com bom senso e acordo entre os jogadores. Sempre que possível, informe ao criador do jogo para ajudar a melhorar o 3D&Tatics.</p>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="text-h5 text-center text-negative">3D&T</div>
      </q-card-section>

      <q-card-section>
        <p class="text-body1">Todas as regras do 3D&T Revisado, Ampliado e Turbinado continuam valendo, exceto quando este livro indicar o contrário.</p>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="text-h5 text-center text-negative">Objetivo</div>
      </q-card-section>

      <q-card-section>
        <p class="text-body1">Escaramuça! Ganha quem derrotar os heróis do jogador adversário.</p>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h4 text-center text-primary q-pb-md">CONFIGURAÇÃO</div>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="text-h5 text-center text-negative">Os grupos</div>
      </q-card-section>

      <q-card-section>
        <p class="text-body1">No modo normal, o jogo é para 2 jogadores. Em modos alternativos (descritos no capítulo específico), esse número pode variar. Cada jogador monta um grupo do mesmo tamanho: recomendamos o tamanho Novato para iniciantes e Lenda para veteranos.</p>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="text-h5 text-center text-negative">Tamanho dos grupos</div>
      </q-card-section>

      <q-card-section>
        <p class="text-body1">
          Os grupos são divididos em 4 tamanhos, sendo o <b>novato</b> o ideal para conhecer o jogo.<br /><br />
          <b>Novato (5):</b> 3 heróis de 5 pts + 2 heróis de 7 pts.<br />
          <b>Lutador (7):</b> 3 heróis de 5 pts + 2 heróis de 7 pts + 2 heróis de 10 pts.<br />
          <b>Campeão (10):</b> 3 heróis de 5 pts + 3 heróis de 7 pts + 3 heróis de 10 pts + 1 herói de 12 pts.<br />
          <b>Lenda (12):</b> 3 heróis de 5 pts + 3 heróis de 7 pts + 3 heróis de 10 pts + 3 heróis de 12 pts.
        </p>
      </q-card-section>
    </q-card>

    <!-- <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <q-list bordered separator>
          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_one" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Planejamento</q-item-label>
              <q-item-label caption>Nesta fase, ambos os jogadores secretamente escolhem e revelam suas ordens de comando.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_two" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Movimentação</q-item-label>
              <q-item-label caption>As unidades são movidas pelo campo de batalha. O movimento é medido em polegadas (ou centímetros), conforme o tipo de unidade.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_3" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Combate</q-item-label>
              <q-item-label caption>Unidades engajam em combate à distância (disparo) e em combate corpo a corpo (assalto). </q-item-label>
              <q-item-label caption>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_4" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Moral e Verificação</q-item-label>
              <q-item-label caption>Unidades que sofreram baixas significativas devem fazer testes de Moral. O jogador verifica condições de vitória.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-pb-sm">Capítulo 3: Resolução de Ações (O Dado)</div>
        <q-separator />
      </q-card-section>

      <q-card-section>
        <p class="text-body1 q-mb-md">A maioria das ações no 3D&Tatics é resolvida com um lançamento de dado de 6 faces (D6).</p>

        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">Teste de Acerto:</q-item-label>
              <q-item-label caption>Para atingir um alvo, o atacante deve rolar um número igual ou superior ao seu valor de Habilidade de Combate (HC). Excepteur sint occaecat cupidatat non proident.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">Teste de Ferimento:</q-item-label>
              <q-item-label caption>Após acertar, o atacante deve rolar um D6 e somar modificadores para igualar ou exceder o valor de Resistência (R) do alvo.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">Regras Especiais:</q-item-label>
              <q-item-label caption>Uma rolagem de '1' (Falha Crítica) sempre falha. Uma rolagem de '6' (Sucesso Crítico) sempre acerta, e geralmente confere um bônus especial.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <p class="q-mt-md">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit.
        </p>
      </q-card-section>
    </q-card>

    <div class="text-caption text-grey-6 q-mt-xl text-center">Estas são apenas as regras básicas. Para informações detalhadas sobre a construção do exército e regras avançadas, consulte o 'Codex'.</div> -->
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Você pode adicionar estilos específicos aqui se precisar */
.q-page {
  max-width: 1000px; /* Limita a largura para melhor leitura */
  margin: 0 auto; /* Centraliza a página de regras */
}
</style>
