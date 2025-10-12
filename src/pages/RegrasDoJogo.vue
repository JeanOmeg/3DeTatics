<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="text-h3 text-weight-light q-mb-lg">Regras Básicas do 3D&Tatics</div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-pb-sm">Capítulo 1: Introdução ao Wargame</div>
        <q-separator />
      </q-card-section>

      <q-card-section>
        <p class="text-body1">
          Bem-vindo ao 3D&Tatics, um wargame tático em escala que coloca você no comando de
          exércitos épicos em cenários de fantasia e ficção científica. Antes de mergulhar na
          construção do seu exército e nas batalhas, é essencial dominar estes conceitos
          fundamentais.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-pb-sm">Capítulo 2: A Estrutura do Turno</div>
        <q-separator />
      </q-card-section>

      <q-card-section>
        <p class="text-body1 q-mb-md">
          Cada jogo de 3D&Tatics é dividido em rodadas de jogo, e cada rodada é composta por fases
          sequenciais. Seguir a ordem correta das fases é crucial para a jogabilidade.
        </p>

        <q-list bordered separator>
          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_one" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Planejamento</q-item-label>
              <q-item-label caption
                >Nesta fase, ambos os jogadores secretamente escolhem e revelam suas ordens de
                comando.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_two" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Movimentação</q-item-label>
              <q-item-label caption
                >As unidades são movidas pelo campo de batalha. O movimento é medido em polegadas
                (ou centímetros), conforme o tipo de unidade.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_3" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Combate</q-item-label>
              <q-item-label caption
                >Unidades engajam em combate à distância (disparo) e em combate corpo a corpo
                (assalto).
              </q-item-label>
              <q-item-label caption
                >Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="looks_4" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Fase de Moral e Verificação</q-item-label>
              <q-item-label caption
                >Unidades que sofreram baixas significativas devem fazer testes de Moral. O jogador
                verifica condições de vitória.</q-item-label
              >
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
        <p class="text-body1 q-mb-md">
          A maioria das ações no 3D&Tatics é resolvida com um lançamento de dado de 6 faces (D6).
        </p>

        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">Teste de Acerto:</q-item-label>
              <q-item-label caption
                >Para atingir um alvo, o atacante deve rolar um número igual ou superior ao seu
                valor de Habilidade de Combate (HC). Excepteur sint occaecat cupidatat non
                proident.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">Teste de Ferimento:</q-item-label>
              <q-item-label caption
                >Após acertar, o atacante deve rolar um D6 e somar modificadores para igualar ou
                exceder o valor de Resistência (R) do alvo.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">Regras Especiais:</q-item-label>
              <q-item-label caption
                >Uma rolagem de '1' (Falha Crítica) sempre falha. Uma rolagem de '6' (Sucesso
                Crítico) sempre acerta, e geralmente confere um bônus especial.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>

        <p class="q-mt-md">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit.
        </p>
      </q-card-section>
    </q-card>

    <div class="text-caption text-grey-6 q-mt-xl text-center">
      Estas são apenas as regras básicas. Para informações detalhadas sobre a construção do exército
      e regras avançadas, consulte o 'Codex'.
    </div>
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
