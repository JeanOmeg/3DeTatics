import type { IGrupo } from 'src/interfaces/grupo-interface'
import { migrarHeroi } from 'src/libs/heroi-lib'
import { agoraIso, clonar, db, gravarDocumento, VERSAO_DADOS } from 'src/services/banco'

const COLECAO = 'grupos'

// Converte grupos salvos em qualquer versão anterior para o formato atual.
export function migrarGrupo (dados: Partial<IGrupo>): IGrupo {
  const criadoEm = dados.criadoEm ?? agoraIso()

  return {
    id: dados.id ?? globalThis.crypto.randomUUID(),
    nome: dados.nome ?? 'Grupo sem nome',
    herois: (dados.herois ?? []).map(heroi => migrarHeroi(heroi)),
    tamanho: dados.tamanho ?? 'livre',
    versao: VERSAO_DADOS,
    criadoEm,
    atualizadoEm: dados.atualizadoEm ?? criadoEm
  }
}

export async function listarGrupos (): Promise<IGrupo[]> {
  const grupos = (await db.collection(COLECAO).get() ?? []) as Partial<IGrupo>[]

  return grupos
    .map(migrarGrupo)
    .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
}

export async function obterGrupo (id: string): Promise<IGrupo | undefined> {
  const grupo = await db.collection(COLECAO).doc(id).get() as Partial<IGrupo> | null

  return grupo ? migrarGrupo(grupo) : undefined
}

// Salva o grupo mantendo a data de criação original e atualizando `atualizadoEm`.
export async function salvarGrupo (grupo: Pick<IGrupo, 'id' | 'nome' | 'herois' | 'tamanho'>): Promise<IGrupo> {
  const existente = await obterGrupo(grupo.id)
  const agora = agoraIso()

  const dados: IGrupo = clonar({
    id: grupo.id,
    nome: grupo.nome,
    herois: grupo.herois,
    tamanho: grupo.tamanho,
    versao: VERSAO_DADOS,
    criadoEm: existente?.criadoEm ?? agora,
    atualizadoEm: agora
  })

  await gravarDocumento(COLECAO, dados.id, dados)

  return dados
}

// Grava exatamente o grupo recebido (usado na importação de backup, preservando datas).
export async function gravarGrupoImportado (grupo: Partial<IGrupo>): Promise<void> {
  const dados = clonar(migrarGrupo(grupo))
  await gravarDocumento(COLECAO, dados.id, dados)
}

export async function removerGrupo (id: string): Promise<void> {
  await db.collection(COLECAO).doc(id).delete()
}
