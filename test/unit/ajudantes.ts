import type { IHeroi } from 'src/interfaces/heroi-interface'
import { novoHeroi } from 'src/libs/heroi-lib'

// Cria um herói de teste a partir de um herói em branco.
export function heroi (dados: Partial<IHeroi> = {}): IHeroi {
  const base = novoHeroi()
  return {
    ...base,
    ...dados,
    caracteristicas: { ...base.caracteristicas, ...(dados.caracteristicas ?? {}) },
    focus: { ...base.focus, ...(dados.focus ?? {}) }
  }
}

// Herói "limpo" de 5 pts: F1 H1 R1 A1 PdF1 = 5 pontos, sem raça nem kit.
export function heroiBasico (dados: Partial<IHeroi> = {}): IHeroi {
  return heroi({
    ph: 5,
    ...dados,
    caracteristicas: { F: 1, H: 1, R: 1, A: 1, PdF: 1, ...(dados.caracteristicas ?? {}) }
  })
}

export function mensagens (problemas: { mensagem: string }[]): string {
  return problemas.map(p => p.mensagem).join(' | ')
}
