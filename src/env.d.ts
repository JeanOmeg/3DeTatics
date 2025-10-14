declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }

  declare module '*.png'
  declare module '*.jpg'
  declare module '*.jpeg'
  declare module '*.gif'
  declare module '*.svg'
  declare module '#q-app/wrappers'
}
