// Busca de texto simples, sem diferenciar maiúsculas nem acentos.

const ACENTOS = /\p{Diacritic}/gu

export function normalizarTexto (texto: string): string {
  return texto.normalize('NFD').replace(ACENTOS, '').toLowerCase()
}

export function correspondeBusca (busca: string | null, ...campos: string[]): boolean {
  const termo = normalizarTexto((busca ?? '').trim())

  if (!termo) {
    return true
  }

  return campos.some(campo => normalizarTexto(campo).includes(termo))
}
