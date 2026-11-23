<template>
  <q-page class="pagina pagina--larga">
    <section class="capa">
      <div class="capa__texto">
        <div class="capa__sobretitulo">
          Wargame skirmish de miniaturas
        </div>
        <h1 class="capa__titulo">
          Táticas de RPG na sua mesa
        </h1>
        <p class="capa__descricao">
          No <b>3DeTatics</b> cada jogador comanda um pequeno grupo de heróis, representados por miniaturas de RPG e cartas que funcionam como fichas. As batalhas acontecem em mesas com terreno, exigem planejamento e posicionamento, e trazem para o tabuleiro a essência dos clássicos de estratégia em turnos, como <i>Final Fantasy Tactics</i> e <i>Fire Emblem</i>, usando os conceitos do <b>3D&T Turbinado</b>.
        </p>
        <p class="capa__descricao">
          Simples de aprender, profundo o bastante para desafiar veteranos. Use qualquer miniatura da sua coleção.
        </p>
        <div class="capa__acoes">
          <q-btn
            unelevated
            no-caps
            size="lg"
            color="primary"
            icon="menu_book"
            label="Ler as regras"
            to="/regras"
          />
          <q-btn
            outline
            no-caps
            size="lg"
            color="primary"
            icon="military_tech"
            label="Montar um grupo"
            to="/grupo"
          />
        </div>
      </div>

      <div class="capa__arte">
        <img
          alt="Arte de capa do 3DeTatics: um grupo de heróis de fantasia, com guerreiros, magos e uma clériga, em um campo de batalha com ruínas."
          width="900"
          height="1350"
          :src="imagens.capa"
        >
      </div>
    </section>

    <section aria-labelledby="atalhos-titulo">
      <h2
        id="atalhos-titulo"
        class="titulo-secao q-mb-md"
      >
        Comece por aqui
      </h2>
      <div class="grade-cards">
        <router-link
          v-for="atalho in atalhos"
          :key="atalho.link"
          class="atalho"
          :to="atalho.link"
        >
          <q-icon
            size="32px"
            class="atalho__icone"
            :name="atalho.icone"
          />
          <div class="atalho__titulo">
            {{ atalho.titulo }}
          </div>
          <div class="atalho__texto">
            {{ atalho.texto }}
          </div>
        </router-link>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { imagens } from 'src/libs/imagens'

const atalhos = [
  { titulo: 'Regras do jogo', texto: 'Configuração da mesa, turnos, movimento, ataque e combate.', icone: 'menu_book', link: '/regras' },
  { titulo: 'Vantagens, raças e kits', texto: 'Tudo o que você pode comprar para montar seus heróis.', icone: 'add_circle', link: '/vantagens' },
  { titulo: 'Desvantagens', texto: 'Fraquezas que dão pontos extras na criação.', icone: 'remove_circle', link: '/desvantagens' },
  { titulo: 'Magias', texto: 'Caminhos, Focus e a lista de magias do jogo.', icone: 'auto_fix_high', link: '/magias' },
  { titulo: 'Criador de Grupo', texto: 'Monte as cartas dos seus heróis e imprima.', icone: 'military_tech', link: '/grupo' },
  { titulo: 'Grupos salvos', texto: 'Abra, edite ou exclua os grupos deste navegador.', icone: 'groups', link: '/grupos' },
  { titulo: 'Meus Heróis', texto: 'Heróis salvos para usar em vários grupos.', icone: 'bookmarks', link: '/herois' }
]
</script>

<style scoped lang="scss">
.capa {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: var(--esp-6);
  align-items: center;
  margin-bottom: var(--esp-7);

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
  }
}

.capa__sobretitulo {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--cor-destaque);
  margin-bottom: var(--esp-2);
}

.capa__titulo {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--esp-4);
}

.capa__descricao {
  font-size: 1.1rem;
  max-width: 60ch;
}

.capa__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-3);
  margin-top: var(--esp-5);
}

.capa__arte {
  justify-self: center;
  max-width: 420px;

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--raio-3);
    border: 4px solid var(--cor-superficie);
    box-shadow: var(--sombra-2), 0 0 0 1px var(--cor-borda);
    transform: rotate(1.5deg);
  }

  @media (max-width: 899px) {
    order: -1;
    max-width: 280px;
  }
}

.atalho {
  display: flex;
  flex-direction: column;
  gap: var(--esp-2);
  padding: var(--esp-5);
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-3);
  box-shadow: var(--sombra-1);
  text-decoration: none;
  color: var(--cor-texto);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--sombra-2);
    border-color: var(--cor-ouro);
  }
}

.atalho__icone {
  color: var(--cor-destaque);
}

.atalho__titulo {
  font-family: var(--fonte-titulo);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--cor-titulo);
}

.atalho__texto {
  font-size: 0.95rem;
  color: var(--cor-texto-suave);
}
</style>
