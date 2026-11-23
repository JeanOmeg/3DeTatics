<template>
  <q-btn-dropdown
    outline
    no-caps
    color="primary"
    icon="backup"
    label="Backup"
  >
    <q-list style="min-width: 260px">
      <q-item
        v-close-popup
        clickable
        @click="exportar"
      >
        <q-item-section avatar>
          <q-icon name="download" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Exportar backup</q-item-label>
          <q-item-label caption>
            Baixa grupos e heróis em um arquivo .json
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-close-popup
        clickable
        @click="escolherArquivo"
      >
        <q-item-section avatar>
          <q-icon name="upload" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Importar backup</q-item-label>
          <q-item-label caption>
            Adiciona os dados de um arquivo .json
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <input
    ref="campoArquivo"
    type="file"
    accept="application/json,.json"
    class="campo-oculto"
    @change="aoEscolherArquivo"
  >
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { exportarBackup, importarBackup, lerBackup } from 'src/services/backup-service'

const emit = defineEmits<{ importado: [] }>()

const $q = useQuasar()
const campoArquivo = ref<HTMLInputElement | null>(null)

function plural (quantidade: number, singular: string, pluralTexto: string) {
  return `${quantidade} ${quantidade === 1 ? singular : pluralTexto}`
}

async function exportar () {
  try {
    const total = await exportarBackup()
    $q.notify({ type: 'positive', message: `Backup exportado: ${plural(total.grupos, 'grupo', 'grupos')} e ${plural(total.herois, 'herói', 'heróis')}.` })
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível exportar o backup.' })
  }
}

function escolherArquivo () {
  campoArquivo.value?.click()
}

async function aoEscolherArquivo (evento: Event) {
  const campo = evento.target as HTMLInputElement
  const arquivo = campo.files?.[0]
  campo.value = ''

  if (!arquivo) {
    return
  }

  try {
    const backup = lerBackup(await arquivo.text())

    $q.dialog({
      title: 'Importar backup',
      message: `O arquivo tem ${plural(backup.grupos.length, 'grupo', 'grupos')} e ${plural(backup.herois.length, 'herói', 'heróis')}. Itens que já existem neste navegador serão substituídos pela versão do arquivo; os demais continuam como estão.`,
      cancel: { label: 'Cancelar', flat: true, noCaps: true },
      ok: { label: 'Importar', color: 'primary', unelevated: true, noCaps: true },
      persistent: true
    }).onOk(() => {
      importarBackup(backup)
        .then(total => {
          $q.notify({ type: 'positive', message: `Importados: ${plural(total.grupos, 'grupo', 'grupos')} e ${plural(total.herois, 'herói', 'heróis')}.` })
          emit('importado')
        })
        .catch(() => {
          $q.notify({ type: 'negative', message: 'Não foi possível importar o backup.' })
        })
    })
  } catch (erro) {
    $q.notify({ type: 'negative', message: erro instanceof Error ? erro.message : 'Arquivo inválido.' })
  }
}
</script>

<style scoped>
.campo-oculto {
  display: none;
}
</style>
