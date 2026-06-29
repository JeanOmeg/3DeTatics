/* eslint-disable no-unused-vars */
declare module 'localbase' {
  interface LocalbaseDoc {
    get(): Promise<unknown>
    set(document: unknown): Promise<unknown>
    update(document: unknown): Promise<unknown>
    delete(): Promise<unknown>
  }

  interface LocalbaseCollection {
    add(document: unknown, key?: string): Promise<unknown>
    get(options?: { keys?: boolean }): Promise<unknown[]>
    set(document: unknown): Promise<unknown>
    delete(): Promise<unknown>
    doc(keyOrCriteria: string | Record<string, unknown>): LocalbaseDoc
    orderBy(field: string, order?: 'asc' | 'desc'): LocalbaseCollection
    limit(amount: number): LocalbaseCollection
  }

  export default class Localbase {
    constructor (databaseName: string)
    config: { debug: boolean }
    collection (name: string): LocalbaseCollection
  }
}
