'use babel'

import {replace_math} from "../F_replacers";
import {add_dot} from "../decimalDot";
import {state} from "../../../panel/body";

export const replace_feedrate = (operator) => {

    const value_replacement = replace_math(operator.value)
    if (value_replacement.string === operator.value && !operator.value.match(/[()+\-*\/]/)) {
        return {...value_replacement, string: `F${add_dot(value_replacement).string}`}
    }
    if (value_replacement.string[0] !== '[' || value_replacement.string[value_replacement.string.length - 1] !== ']') {
        value_replacement.string = `[${value_replacement.string}]`
    }

    return {...value_replacement, string: `F${value_replacement.string}`}
}

export const replace_feedrate_general = (operator) => {
    let gCode_type = 'A'

    const resp = {
        string: '',
        errors: []
    }

    if (state.fanuc_type === null) {
        resp.errors.push(15)
    } else {
        gCode_type = state.fanuc_type
    }

    resp.string = `G${parseInt(operator.value) + 4 * (gCode_type === 'A')}`

    return resp
}