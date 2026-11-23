import { db, gravarDocumento, VERSAO_DADOS } from 'src/services/banco'

// Preferências do jogador, guardadas no navegador (coleção `configuracoes`).

export type TTema = 'auto' | 'claro' | 'escuro'

export interface IConfiguracoes {
  versao: number
  tema: TTema
}

const COLECAO = 'configuracoes'
const DOCUMENTO = 'preferencias'

const PADRAO: IConfiguracoes = {
  versao: VERSAO_DADOS,
  tema: 'auto'
}

export async function obterConfiguracoes (): Promise<IConfiguracoes> {
  try {
    const salvo = await db.collection(COLECAO).doc(DOCUMENTO).get() as Partial<IConfiguracoes> | null
    return { ...PADRAO, ...(salvo ?? {}), versao: VERSAO_DADOS }
  } catch {
    return { ...PADRAO }
  }
}

export async function salvarConfiguracoes (alteracoes: Partial<IConfiguracoes>): Promise<void> {
  const atual = await obterConfiguracoes()
  const dados: IConfiguracoes = { ...atual, ...alteracoes, versao: VERSAO_DADOS }

  await gravarDocumento(COLECAO, DOCUMENTO, dados)
}
