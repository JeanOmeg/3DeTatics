import { defineBoot } from '#q-app/wrappers'
import axios, { type AxiosInstance } from 'axios'
import certo_1 from 'src/assets/certo_1.jpg'
import certo_2 from 'src/assets/certo_2.jpg'
import errado_1 from 'src/assets/errado_1.jpg'
import errado_2 from 'src/assets/errado_2.jpg'
import atacar_1 from 'src/assets/atacar_1.jpg'
import atacar_2 from 'src/assets/atacar_2.jpg'
import terreno from 'src/assets/terreno.jpg'
import visao1 from 'src/assets/visao1.jpg'
import visao2 from 'src/assets/visao2.jpg'
import sem_visao1 from 'src/assets/sem_visao1.jpg'
import sem_visao2 from 'src/assets/sem_visao2.jpg'
import alcanca from 'src/assets/alcanca.jpg'
import nao_alcanca from 'src/assets/nao_alcanca.jpg'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://api.example.com' })

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

const boot_imagens = {
  certo_1,
  certo_2,
  errado_1,
  errado_2,
  atacar_1,
  atacar_2,
  terreno,
  visao1,
  visao2,
  sem_visao1,
  sem_visao2,
  alcanca,
  nao_alcanca
}

export { api, boot_imagens }
