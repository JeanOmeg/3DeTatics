// Os seis Caminhos da magia.
export type TCaminho = 'agua' | 'ar' | 'fogo' | 'luz' | 'terra' | 'trevas'

export interface ICaminhoInfo {
  key: TCaminho
  label: string
  sigla: string
}

export const CAMINHOS: ICaminhoInfo[] = [
  { key: 'agua', label: 'Água', sigla: 'Ág' },
  { key: 'ar', label: 'Ar', sigla: 'Ar' },
  { key: 'fogo', label: 'Fogo', sigla: 'Fo' },
  { key: 'luz', label: 'Luz', sigla: 'Lu' },
  { key: 'terra', label: 'Terra', sigla: 'Te' },
  { key: 'trevas', label: 'Trevas', sigla: 'Tr' }
]
