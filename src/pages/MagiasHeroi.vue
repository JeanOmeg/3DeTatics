<template>
  <q-page class="pagina">
    <CabecalhoPagina
      sobretitulo="Construção de heróis"
      titulo="Magias"
      descricao="Caminhos, Focus e as magias que seus heróis podem lançar na mesa."
    />

    <IndiceSecoes :itens="indice" />

    <section class="bloco">
      <TituloSecao
        titulo="Caminhos e Focus"
        ancora="caminhos"
      />
      <p>A magia é dividida em seis Caminhos. O poder de um herói em cada Caminho é o seu <span class="termo">Focus</span>, comprado como a Vantagem Focus (1 ponto por nível em cada Caminho). O Focus segue o mesmo limite das Características para a faixa de pontos do herói. Arcano, Clericato e algumas raças dão Focus extra.</p>

      <div class="tabela-rolagem">
        <table class="tabela-regras">
          <thead>
            <tr>
              <th>Caminho</th>
              <th>Oposto</th>
              <th>Tipos de dano</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="caminho in caminhos"
              :key="caminho.nome"
            >
              <td><span class="termo">{{ caminho.nome }}</span></td>
              <td>{{ caminho.oposto }}</td>
              <td>{{ caminho.dano }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="texto-suave">
        Todo dano causado por magia também conta como mágico. Quando a magia permite, escolha o tipo de dano ao lançar.
      </p>
    </section>

    <section class="bloco">
      <TituloSecao
        titulo="Lançando magias"
        ancora="lancando"
      />
      <ul class="lista-regras">
        <li><span class="termo">Ação:</span> lançar uma magia usa a Ação do turno. O herói pode Mover antes ou depois de lançar.</li>
        <li><span class="termo">Requisito:</span> o herói precisa ter, no Caminho indicado, um Focus igual ou maior que o requisito da magia. Quando a magia lista vários Caminhos separados por "ou", basta um deles.</li>
        <li><span class="termo">Magias conhecidas:</span> todo herói com pelo menos 1 ponto de Focus conhece todas as Magias Iniciais. Além delas, ele conhece Magias Avançadas, escolhidas na criação e anotadas na ficha.</li>
        <li><span class="termo">Custo:</span> os PM são gastos quando a magia é lançada, mesmo que o alvo resista.</li>
        <li><span class="termo">Alvo:</span> salvo quando indicado, o alvo precisa estar em linha de visão. "Toque" significa contato de base, e o conjurador pode ser o próprio alvo.</li>
        <li><span class="termo">Testes de resistência:</span> é um teste de Característica (normalmente R; veja Conceitos básicos nas Regras): se passar, o alvo resiste. Resistência à Magia dá +3 nesses testes.</li>
        <li><span class="termo">Sustentável:</span> a magia continua ativa enquanto o conjurador pagar 1PM no início de cada um de seus turnos. Cada herói só mantém uma magia sustentável por vez (duas com Arcano). Se o conjurador for derrotado ou deixar de pagar, a magia termina.</li>
      </ul>

      <CaixaDestaque
        tipo="importante"
        titulo="Quantas e quais Magias Avançadas"
      >
        <p>São duas contas diferentes:</p>
        <ul>
          <li><b>Quantas:</b> a soma de todos os seus Focus diz quantas Magias Avançadas o herói pode escolher.</li>
          <li><b>Quais:</b> o Focus em cada Caminho diz quais magias ele pode escolher. Toda Magia Avançada exige <b>Focus 2 ou mais</b> num Caminho específico (Bola de Fogo, por exemplo, pede Fogo 3).</li>
        </ul>
        <p><span class="termo">Exemplo:</span> um herói só com Arcano x1 tem Focus 1 nos seis Caminhos. Ele conhece todas as Magias Iniciais e pode escolher até 6 Avançadas, mas ainda não cumpre o requisito de nenhuma. Comprando Trevas 2 (+1 ponto), ele passa a poder escolher Toque Vampírico, Flecha Ácida, Cegueira, Sono e Pânico.</p>
      </CaixaDestaque>

      <TituloSecao
        titulo="Alcance de PdF (pelo Focus)"
        :nivel="3"
      />
      <p>As magias à distância usam a mesma tabela de alcance do Poder de Fogo, trocando o PdF pelo Focus do Caminho usado na magia. Se a magia aceita mais de um Caminho, use o Focus do Caminho escolhido.</p>
      <div class="tabela-rolagem">
        <table class="tabela-regras tabela-regras--compacta">
          <thead>
            <tr>
              <th>Focus</th>
              <th
                v-for="linha in alcanceFocus"
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
                v-for="linha in alcanceFocus"
                :key="linha.valor"
              >
                {{ linha.alcance }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section
      id="lista"
      class="lista-magias"
    >
      <TituloSecao titulo="Lista de magias" />

      <div class="barra-filtros">
        <q-tabs
          v-model="aba"
          dense
          no-caps
          align="left"
          active-color="primary"
          indicator-color="accent"
        >
          <q-tab
            name="iniciais"
            :label="`Iniciais (${lista_iniciais.length})`"
          />
          <q-tab
            name="avancadas"
            :label="`Avançadas (${lista_avancadas.length})`"
          />
        </q-tabs>

        <q-input
          v-model="busca"
          dense
          outlined
          clearable
          placeholder="Buscar..."
          class="barra-filtros__busca"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div
        class="filtro-caminhos"
        role="group"
        aria-label="Filtrar por Caminho"
      >
        <q-chip
          v-for="caminho in nomesCaminhos"
          :key="caminho"
          clickable
          color="primary"
          icon-selected="check"
          :selected="caminhoFiltro === caminho"
          :outline="caminhoFiltro !== caminho"
          :text-color="caminhoFiltro === caminho ? 'white' : undefined"
          @click="alternarCaminho(caminho)"
        >
          {{ caminho }}
        </q-chip>
      </div>

      <div
        v-if="magiasFiltradas.length"
        class="pilha"
      >
        <ItemRegra
          v-for="item in magiasFiltradas"
          :key="item.value"
          :nome="item.nome"
          :custo="item.custo"
          :etiquetas="[
            { rotulo: 'Requisito', valor: item.requisito },
            { rotulo: 'Alcance', valor: item.alcance },
            { rotulo: 'Duração', valor: item.duracao }
          ]"
        >
          <p>{{ item.descricao }}</p>
        </ItemRegra>
      </div>

      <EstadoVazio
        v-else
        icone="search_off"
        titulo="Nenhuma magia encontrada"
        texto="Tente outro termo de busca ou remova o filtro de Caminho."
      >
        <q-btn
          flat
          no-caps
          color="primary"
          label="Limpar filtros"
          @click="limparFiltros"
        />
      </EstadoVazio>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CabecalhoPagina from 'components/CabecalhoPagina.vue'
import TituloSecao from 'components/TituloSecao.vue'
import IndiceSecoes from 'components/IndiceSecoes.vue'
import ItemRegra from 'components/ItemRegra.vue'
import EstadoVazio from 'components/EstadoVazio.vue'
import CaixaDestaque from 'components/CaixaDestaque.vue'
import { MagiasLib } from 'src/libs/magias-lib'
import { correspondeBusca, normalizarTexto } from 'src/libs/busca-lib'

const indice = [
  { ancora: 'caminhos', titulo: 'Caminhos e Focus' },
  { ancora: 'lancando', titulo: 'Lançando magias' },
  { ancora: 'lista', titulo: 'Lista de magias' }
]

const caminhos = [
  { nome: 'Água', oposto: 'Fogo', dano: 'Frio/Gelo ou Químico' },
  { nome: 'Ar', oposto: 'Terra', dano: 'Eletricidade ou Vento/Som' },
  { nome: 'Fogo', oposto: 'Água', dano: 'Calor/Fogo' },
  { nome: 'Luz', oposto: 'Trevas', dano: 'Luz' },
  { nome: 'Terra', oposto: 'Ar', dano: 'Contusão ou Perfuração' },
  { nome: 'Trevas', oposto: 'Luz', dano: 'Químico ou Corte' }
]

const nomesCaminhos = caminhos.map(caminho => caminho.nome)

const alcanceFocus = [
  { valor: 1, alcance: '3"' },
  { valor: 2, alcance: '6"' },
  { valor: 3, alcance: '12"' },
  { valor: 4, alcance: '18"' },
  { valor: 5, alcance: '24"' }
]

const aba = ref<'iniciais' | 'avancadas'>('iniciais')
const busca = ref('')
const caminhoFiltro = ref<string | null>(null)

const lista_iniciais = MagiasLib.listarMagias().filter(item => item.inicial)
const lista_avancadas = MagiasLib.listarMagias().filter(item => !item.inicial)

// Uma magia "Qualquer Caminho" aparece em qualquer filtro de Caminho.
function usaCaminho (requisito: string, caminho: string) {
  const texto = normalizarTexto(requisito)
  const palavras = texto.split(/[^a-z]+/)
  return texto.includes('qualquer caminho') || palavras.includes(normalizarTexto(caminho))
}

const magiasFiltradas = computed(() => {
  const lista = aba.value === 'iniciais' ? lista_iniciais : lista_avancadas

  return lista.filter(item =>
    correspondeBusca(busca.value, item.nome, item.descricao, item.requisito) &&
    (!caminhoFiltro.value || usaCaminho(item.requisito, caminhoFiltro.value))
  )
})

function alternarCaminho (caminho: string) {
  caminhoFiltro.value = caminhoFiltro.value === caminho ? null : caminho
}

function limparFiltros () {
  busca.value = ''
  caminhoFiltro.value = null
}
</script>

<style scoped lang="scss">
.lista-regras {
  margin: 0 0 var(--esp-3);
  padding-left: var(--esp-5);

  li {
    margin-bottom: var(--esp-2);
  }
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

.lista-magias {
  scroll-margin-top: 80px;
}

.filtro-caminhos {
  display: flex;
  flex-wrap: wrap;
  gap: var(--esp-1);
  margin-bottom: var(--esp-4);
}
</style>
