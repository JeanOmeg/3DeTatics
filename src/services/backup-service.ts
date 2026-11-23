import type { IGrupo } from 'src/interfaces/grupo-interface'
import type { IHeroiSalvo } from 'src/interfaces/heroi-interface'
import { agoraIso, VERSAO_DADOS } from 'src/services/banco'
import { gravarGrupoImportado, listarGrupos } from 'src/services/grupos-service'
import { gravarHeroiImportado, listarHerois } from 'src/services/herois-service'

// Backup de todos os dados do jogador em um arquivo JSON.
// Sem backup, limpar os dados do navegador apaga tudo; com ele, dá para
// guardar uma cópia ou levar os grupos para outro aparelho.

const IDENTIFICADOR = '3detatics-backup'

export interface IBackup {
  app: typeof IDENTIFICADOR
  versao: number
  exportadoEm: string
  grupos: IGrupo[]
  herois: IHeroiSalvo[]
}

export interface IResultadoImportacao {
  grupos: number
  herois: number
}

export async function gerarBackup (): Promise<IBackup> {
  const [grupos, herois] = await Promise.all([listarGrupos(), listarHerois()])

  return {
    app: IDENTIFICADOR,
    versao: VERSAO_DADOS,
    exportadoEm: agoraIso(),
    grupos,
    herois
  }
}

// Baixa o backup como arquivo `.json`.
export async function exportarBackup (): Promise<IResultadoImportacao> {
  const backup = await gerarBackup()
  const conteudo = JSON.stringify(backup, null, 2)
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }))
  const data = backup.exportadoEm.slice(0, 10)

  const link = document.createElement('a')
  link.href = url
  link.download = `3detatics-backup-${data}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)

  return { grupos: backup.grupos.length, herois: backup.herois.length }
}

export function lerBackup (texto: string): IBackup {
  let dados: unknown

  try {
    dados = JSON.parse(texto)
  } catch {
    throw new Error('O arquivo não é um JSON válido.')
  }

  const backup = dados as Partial<IBackup>

  if (!backup || backup.app !== IDENTIFICADOR) {
    throw new Error('O arquivo não é um backup do 3DeTatics.')
  }

  if (typeof backup.versao !== 'number' || backup.versao > VERSAO_DADOS) {
    throw new Error('Este backup foi feito em uma versão mais nova do 3DeTatics. Atualize a página e tente de novo.')
  }

  return {
    app: IDENTIFICADOR,
    versao: backup.versao,
    exportadoEm: backup.exportadoEm ?? '',
    grupos: Array.isArray(backup.grupos) ? backup.grupos : [],
    herois: Array.isArray(backup.herois) ? backup.herois : []
  }
}

// Importa mesclando: itens com o mesmo id são substituídos, os demais são mantidos.
export async function importarBackup (backup: IBackup): Promise<IResultadoImportacao> {
  for (const grupo of backup.grupos) {
    await gravarGrupoImportado(grupo)
  }

  for (const heroi of backup.herois) {
    await gravarHeroiImportado(heroi)
  }

  return { grupos: backup.grupos.length, herois: backup.herois.length }
}
