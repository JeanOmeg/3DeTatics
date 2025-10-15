import { IComboBox } from 'src/interfaces/combobox-interface'
import { IVantagemDesvantagem } from 'src/interfaces/vantagem-desvantagem-interface'

export namespace VantagensLib {

  export function listarVantagens () {
    const vantangens: IVantagemDesvantagem[] = [
      {
        nome: '',
        custo: 0,
        descricao: '',
        value: ''
      }
    ]

    return vantangens
  }

  export function listarVantagensCombo () {
    const combo: IComboBox[] = listarVantagens().map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
