'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";

export const replace_feedrate = (operator) => {

    const value_replacement = replace_math(operator.value)
    // console.log(value_replacement)

    if (value_replacement.string === operator.value && !operator.value.match(/[()+\-*\/]/)) {
        return {...value_replacement, string: `F${value_replacement.string}`}
    }

    let temp_var = `E${30+state.vars.getTemp()}`

    value_replacement.additions = [`${temp_var}=${value_replacement.string}`]

    return {...value_replacement, string: `F${temp_var}`}
}