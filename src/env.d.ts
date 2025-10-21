declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }

declare module '*.jpg' {
  const value: string
  export default value
}
declare module '*.png' {
  const value: string
  export default value
}
declare module '*.jpeg' {
  const value: string
  export default value
}
declare module '*.gif' {
  const value: string
  export default value
}
  declare module '*.svg'
  declare module '#q-app/wrappers'
}
