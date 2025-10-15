import { IComboBox } from 'src/interfaces/combobox-interface'
import { IKit } from 'src/interfaces/kit-interface'

export namespace KitsLib {

  export function listarKits () {
    const vantangens: IKit[] = [
      {
        nome: '',
        custo: 0,
        restricoes: '',
        vantagens: [],
        desvantagens: [],
        pv: '',
        pm: '',
        value: ''
      }
    ]

    return vantangens
  }

  export function listarKitsCombo () {
    const combo: IComboBox[] = listarKits().map(item => ({ label: item.nome, value: item.value }))

    return combo
  }
}
