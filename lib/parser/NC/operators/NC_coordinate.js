'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";
import {check_tempVar} from "./check_temp_vars";

export function coordinate_replace(operator) {
    let responce = {
        string:'JOPA',
        additions: [],
        errors: []
    }

    let replace = replace_math(operator.value)
    responce.errors.push(...replace.errors)

    //Если возвращается число или одна переменная
    if (!check_tempVar(replace.string)) {

        responce.string = `${operator.name}${replace.string}`
        return responce
    }

    let temp_var = `E${30+state.vars.getTemp()}`

    responce.additions.push(`${temp_var}=${replace.string}`)
    responce.string = `${operator.name}${temp_var}`
    return responce
}