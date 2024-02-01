'use babel'

import {state} from "../../../panel/body";

export function replace_toolno(operator) {
    if (state.programData.machine.cncOptions === undefined) {
        state.programData.machine.cncOptions = {D_num: false, G43: false}
    }
    const t_num = state.programData.machine.cncOptions.D_num ? `T${operator.value} ` : `T${operator.value.length > 1 ? '' : '0'}${operator.value}`
    const d_num = state.programData.machine.cncOptions.D_num ? (operator.d_num ? `D${operator.d_num}` : `D${operator.value}`) : (operator.d_num ? `${operator.d_num.length > 1 ? '' : 0}${operator.d_num}` : t_num.slice(1))

    const resp =  {
        string: `${t_num}${d_num}`,
        errors: []
    }
    if (state.programData.machine.cncOptions.G43) {
        resp.additionsEnd = [`G43 H${operator.d_num ? operator.d_num : operator.value }`]
    }

    return resp
}