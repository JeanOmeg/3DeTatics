import type { IHeroi } from 'src/interfaces/heroi-interface'

// Criação, cópia e migração de heróis.

export function novoHeroi (): IHeroi {
  return {
    id: globalThis.crypto.randomUUID(),
    name: '',
    ph: null,
    pv: null,
    pm: null,
    raca: '',
    kit: '',
    caracteristicas: {
      F: null,
      PdF: null,
      A: null,
      H: null,
      R: null
    },
    vantagem: '',
    desvantagem: '',
    tipo_de_dano_f: '',
    tipo_de_dano_pdf: '',
    raca_valor: '',
    kit_valor: '',
    vantagens_valores: [],
    desvantagens_valores: [],
    focus: { agua: null, ar: null, fogo: null, luz: null, terra: null, trevas: null },
    magias_valores: [],
    magia: '',
    ajustes: {},
    pv_pm_manual: false
  }
}

// Cópia independente com id novo (usada ao colocar um herói salvo em um grupo
// ou ao duplicar). Campos extras de armazenamento (datas, versão) são descartados.
export function copiarHeroi (heroi: IHeroi): IHeroi {
  return { ...migrarHeroi(JSON.parse(JSON.stringify(heroi)) as Partial<IHeroi>), id: globalThis.crypto.randomUUID() }
}

// Completa heróis salvos em versões antigas com os campos que surgiram depois.
export function migrarHeroi (dados: Partial<IHeroi>): IHeroi {
  const base = novoHeroi()

  return {
    ...base,
    ...dados,
    id: dados.id ?? base.id,
    caracteristicas: { ...base.caracteristicas, ...(dados.caracteristicas ?? {}) },
    vantagens_valores: dados.vantagens_valores ?? [],
    desvantagens_valores: dados.desvantagens_valores ?? [],
    focus: { ...base.focus, ...(dados.focus ?? {}) },
    magias_valores: dados.magias_valores ?? [],
    ajustes: { ...(dados.ajustes ?? {}) },
    // Heróis antigos tinham PV e PM digitados: mantém como manual se já havia valores.
    pv_pm_manual: dados.pv_pm_manual ?? (dados.pv !== undefined && dados.pv !== null)
  }
}

export function nomeExibicao (heroi: IHeroi): string {
  return heroi.name.trim() || 'Herói sem nome'
}
