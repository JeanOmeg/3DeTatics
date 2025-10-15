import { IComboBox } from 'src/interfaces/combobox-interface'
import { IVantagemDesvantagem } from 'src/interfaces/vantagem-desvantagem-interface'

export namespace DesvantagensLib {

  export function listarDesvantagens () {
    const desvantangens: IVantagemDesvantagem[] = [
      {
        nome: '',
        custo: 0,
        descricao: '',
        value: ''
      }
    ]

    return desvantangens
  }

  export function listarDesvantagensCombo () {
    const combo: IComboBox[] = listarDesvantagens().map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
