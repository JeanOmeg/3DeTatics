import Localbase from 'localbase'
import type { IGrupo } from 'src/interfaces/grupo-interface'

const db = new Localbase('3detatics')
db.config.debug = false

const COLECAO = 'grupos'

export async function listarGrupos (): Promise<IGrupo[]> {
  const grupos = await db.collection(COLECAO).orderBy('criadoEm', 'desc').get()

  return (grupos ?? []) as IGrupo[]
}

export async function obterGrupo (id: string): Promise<IGrupo | undefined> {
  const grupo = await db.collection(COLECAO).doc(id).get()

  return (grupo ?? undefined) as IGrupo | undefined
}

export async function salvarGrupo (grupo: IGrupo): Promise<void> {
  // Clona para objeto puro: o IndexedDB não consegue serializar
  // os Proxies reativos do Vue (lançaria DataCloneError).
  const dados = JSON.parse(JSON.stringify(grupo)) as IGrupo

  const existente = await obterGrupo(dados.id)

  if (existente) {
    await db.collection(COLECAO).doc(dados.id).set(dados)
  } else {
    await db.collection(COLECAO).add(dados, dados.id)
  }
}

export async function removerGrupo (id: string): Promise<void> {
  await db.collection(COLECAO).doc(id).delete()
}
