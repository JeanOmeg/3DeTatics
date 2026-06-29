<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-white q-mb-md row col-12 justify-center">
      <b>Lista de Grupos</b>
    </div>
    <q-separator class="q-mb-md" />

    <q-table
      flat
      bordered
      row-key="id"
      no-data-label="Nenhum grupo salvo ainda."
      :rows="grupos"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 20, 50, 0]"
    >
      <template #body-cell-acoes="props">
        <q-td
          class="q-gutter-x-sm"
          :props="props"
        >
          <q-btn
            dense
            flat
            round
            color="primary"
            icon="edit"
            @click="abrirGrupo(props.row)"
          >
            <q-tooltip>Abrir no criador</q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            round
            color="negative"
            icon="delete"
            @click="confirmarRemocao(props.row)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, type QTableColumn } from 'quasar'
import type { IGrupo } from 'src/interfaces/grupo-interface'
import { listarGrupos, removerGrupo } from 'src/services/grupos-service'

const $q = useQuasar()
const $router = useRouter()

const grupos = ref<IGrupo[]>([])
const carregando = ref(false)

const colunas: QTableColumn<IGrupo>[] = [
  { name: 'nome', label: 'Nome do Grupo', field: 'nome', align: 'left', sortable: true },
  { name: 'herois', label: 'Heróis', field: (row) => row.herois.length, align: 'center', sortable: true },
  {
    name: 'criadoEm',
    label: 'Criado em',
    field: 'criadoEm',
    align: 'left',
    sortable: true,
    format: (val: string) => new Date(val).toLocaleString('pt-BR')
  },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' }
]

async function carregarGrupos () {
  carregando.value = true
  try {
    grupos.value = await listarGrupos()
  } finally {
    carregando.value = false
  }
}

async function abrirGrupo (grupo: IGrupo) {
  await $router.push({ path: '/grupo', query: { id: grupo.id } })
}

function confirmarRemocao (grupo: IGrupo) {
  $q.dialog({
    title: 'Excluir grupo',
    message: `Tem certeza que deseja excluir o grupo "${grupo.nome}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void removerGrupo(grupo.id).then(async () => {
      $q.notify({ type: 'positive', message: 'Grupo excluído.' })
      await carregarGrupos()
    })
  })
}

onMounted(carregarGrupos)
</script>
