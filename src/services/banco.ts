import Localbase from 'localbase'

// Banco local do 3DeTatics (IndexedDB via Localbase), compartilhado por todos os serviços.
// Coleções: `grupos`, `herois`, `configuracoes`.

export const db = new Localbase('3detatics')
db.config.debug = false

// Versão do formato dos dados salvos. Ao mudar o formato (novos campos na ficha,
// por exemplo), aumente este número e trate a conversão nas funções `migrar*`.
export const VERSAO_DADOS = 1

// O IndexedDB não serializa os Proxies reativos do Vue (DataCloneError):
// sempre grave uma cópia em objeto puro.
export function clonar<T> (valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T
}

export function agoraIso (): string {
  return new Date().toISOString()
}

// Grava um documento com id próprio, criando ou substituindo.
export async function gravarDocumento (colecao: string, id: string, dados: object): Promise<void> {
  const existente = await db.collection(colecao).doc(id).get()

  if (existente) {
    await db.collection(colecao).doc(id).set(dados)
  } else {
    await db.collection(colecao).add(dados, id)
  }
}
