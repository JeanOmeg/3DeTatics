import type { IHeroi, IHeroiSalvo } from 'src/interfaces/heroi-interface'
import { migrarHeroi } from 'src/libs/heroi-lib'
import { agoraIso, clonar, db, gravarDocumento, VERSAO_DADOS } from 'src/services/banco'

// Heróis salvos individualmente (Meus Heróis), para reaproveitar em vários grupos.
// Ao entrar em um grupo, o herói é copiado: editar o herói salvo não altera grupos antigos.

const COLECAO = 'herois'

export function migrarHeroiSalvo (dados: Partial<IHeroiSalvo>): IHeroiSalvo {
  const criadoEm = dados.criadoEm ?? agoraIso()

  return {
    ...migrarHeroi(dados),
    versao: VERSAO_DADOS,
    criadoEm,
    atualizadoEm: dados.atualizadoEm ?? criadoEm
  }
}

export async function listarHerois (): Promise<IHeroiSalvo[]> {
  const herois = (await db.collection(COLECAO).get() ?? []) as Partial<IHeroiSalvo>[]

  return herois
    .map(migrarHeroiSalvo)
    .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
}

export async function obterHeroi (id: string): Promise<IHeroiSalvo | undefined> {
  const heroi = await db.collection(COLECAO).doc(id).get() as Partial<IHeroiSalvo> | null

  return heroi ? migrarHeroiSalvo(heroi) : undefined
}

// Cria ou atualiza o herói salvo com o mesmo id, mantendo a data de criação.
export async function salvarHeroi (heroi: IHeroi): Promise<IHeroiSalvo> {
  const existente = await obterHeroi(heroi.id)
  const agora = agoraIso()

  const dados: IHeroiSalvo = clonar({
    ...migrarHeroi(heroi),
    versao: VERSAO_DADOS,
    criadoEm: existente?.criadoEm ?? agora,
    atualizadoEm: agora
  })

  await gravarDocumento(COLECAO, dados.id, dados)

  return dados
}

// Grava exatamente o herói recebido (usado na importação de backup, preservando datas).
export async function gravarHeroiImportado (heroi: Partial<IHeroiSalvo>): Promise<void> {
  const dados = clonar(migrarHeroiSalvo(heroi))
  await gravarDocumento(COLECAO, dados.id, dados)
}

export async function removerHeroi (id: string): Promise<void> {
  await db.collection(COLECAO).doc(id).delete()
}
