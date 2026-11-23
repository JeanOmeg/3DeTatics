import { beforeEach, describe, expect, it } from 'vitest'
import { db } from 'src/services/banco'
import { listarGrupos, obterGrupo, removerGrupo, salvarGrupo } from 'src/services/grupos-service'
import { listarHerois, obterHeroi, removerHeroi, salvarHeroi } from 'src/services/herois-service'
import { obterConfiguracoes, salvarConfiguracoes } from 'src/services/configuracoes-service'
import { gerarBackup, importarBackup, lerBackup } from 'src/services/backup-service'
import { novoHeroi } from 'src/libs/heroi-lib'

// Serviços do Localbase sobre um IndexedDB simulado (fake-indexeddb).

const espera = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

beforeEach(async () => {
  for (const colecao of ['grupos', 'herois', 'configuracoes']) {
    await db.collection(colecao).delete()
  }
})

describe('grupos-service', () => {
  it('salva, lista, abre e remove grupos', async () => {
    const heroi = { ...novoHeroi(), name: 'Arwen' }
    const salvo = await salvarGrupo({ id: 'g1', nome: 'Grupo 1', herois: [heroi], tamanho: 'novato' })

    expect(salvo.versao).toBe(1)
    expect(await obterGrupo('g1')).toMatchObject({ nome: 'Grupo 1', tamanho: 'novato' })
    expect((await listarGrupos()).map(g => g.id)).toEqual(['g1'])

    await removerGrupo('g1')
    expect(await listarGrupos()).toEqual([])
    expect(await obterGrupo('g1')).toBeUndefined()
  })

  it('mantém criadoEm e atualiza atualizadoEm ao salvar de novo', async () => {
    const primeiro = await salvarGrupo({ id: 'g1', nome: 'A', herois: [], tamanho: 'livre' })
    await espera(5)
    const segundo = await salvarGrupo({ id: 'g1', nome: 'B', herois: [], tamanho: 'livre' })

    expect(segundo.criadoEm).toBe(primeiro.criadoEm)
    expect(segundo.atualizadoEm > primeiro.atualizadoEm).toBe(true)
    expect((await obterGrupo('g1'))?.nome).toBe('B')
  })

  it('lista os grupos do mais recente para o mais antigo', async () => {
    await salvarGrupo({ id: 'antigo', nome: 'Antigo', herois: [], tamanho: 'livre' })
    await espera(5)
    await salvarGrupo({ id: 'novo', nome: 'Novo', herois: [], tamanho: 'livre' })
    expect((await listarGrupos()).map(g => g.id)).toEqual(['novo', 'antigo'])
  })
})

describe('herois-service', () => {
  it('salva, atualiza e remove heróis', async () => {
    const heroi = { ...novoHeroi(), name: 'Lyra' }
    const salvo = await salvarHeroi(heroi)
    expect(salvo.id).toBe(heroi.id)

    await salvarHeroi({ ...heroi, name: 'Lyra II' })
    const herois = await listarHerois()
    expect(herois).toHaveLength(1)
    expect(herois[0]?.name).toBe('Lyra II')
    expect(herois[0]?.criadoEm).toBe(salvo.criadoEm)

    await removerHeroi(heroi.id)
    expect(await obterHeroi(heroi.id)).toBeUndefined()
  })
})

describe('configuracoes-service', () => {
  it('usa o tema automático por padrão e guarda a escolha', async () => {
    expect((await obterConfiguracoes()).tema).toBe('auto')
    await salvarConfiguracoes({ tema: 'escuro' })
    expect((await obterConfiguracoes()).tema).toBe('escuro')
  })
})

describe('backup-service', () => {
  it('gera um backup com grupos e heróis e importa de volta', async () => {
    await salvarGrupo({ id: 'g1', nome: 'Grupo', herois: [], tamanho: 'livre' })
    await salvarHeroi({ ...novoHeroi(), id: 'h1', name: 'Thorin' })

    const backup = await gerarBackup()
    expect(backup.app).toBe('3detatics-backup')
    expect(backup.grupos).toHaveLength(1)
    expect(backup.herois).toHaveLength(1)

    await removerGrupo('g1')
    await removerHeroi('h1')

    const lido = lerBackup(JSON.stringify(backup))
    expect(await importarBackup(lido)).toEqual({ grupos: 1, herois: 1 })
    expect((await obterGrupo('g1'))?.nome).toBe('Grupo')
    expect((await obterHeroi('h1'))?.name).toBe('Thorin')
  })

  it('importa grupos no formato antigo, preservando as datas', async () => {
    const antigo = {
      app: '3detatics-backup',
      versao: 1,
      grupos: [{ id: 'velho', nome: 'Velho', criadoEm: '2026-01-01T00:00:00.000Z', herois: [{ id: 'x', name: 'Bob' }] }],
      herois: []
    }
    await importarBackup(lerBackup(JSON.stringify(antigo)))
    const grupo = await obterGrupo('velho')
    expect(grupo?.atualizadoEm).toBe('2026-01-01T00:00:00.000Z')
    expect(grupo?.tamanho).toBe('livre')
    expect(grupo?.herois[0]?.vantagens_valores).toEqual([])
  })

  it('recusa arquivos inválidos', () => {
    expect(() => lerBackup('isso não é json')).toThrow('não é um JSON válido')
    expect(() => lerBackup('{"nada":1}')).toThrow('não é um backup do 3DeTatics')
    expect(() => lerBackup('{"app":"3detatics-backup","versao":99}')).toThrow('versão mais nova')
  })
})
