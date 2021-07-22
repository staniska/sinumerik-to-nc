'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";

export function coordinate_replace(operator) {
    let responce = {
        string:'JOPA',
        additions: [],
        errors: []
    }

    let replace = replace_math(operator.value)
    responce.errors.push(...replace.errors)

    //Если возвращается число или одна переменная
    if ((replace.string.match(/[\d.]+/) && (replace.string.match(/[\d.]+/)[0] === replace.string)) ||
        ((replace.string.match(/E[0-9]+/)) && (replace.string.match(/E[0-9]+/)[0] === replace.string))) {

        responce.string = `${operator.name}${replace.string}`
        return responce
    }

    let temp_var = `E${30+state.vars.getTemp()}`

    responce.additions.push(`${temp_var}=${replace.string}`)
    responce.string = `${operator.name}${temp_var}`
    return responce
}