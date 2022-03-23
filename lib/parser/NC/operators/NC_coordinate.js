'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";
import {check_tempVar} from "../../check_temp_vars";

export function coordinate_replace(operator) {
    let response = {
        string:'JOPA',
        additions: [],
        errors: []
    }

    let replace = replace_math(operator.value)
    response.errors.push(...replace.errors)

    //Если возвращается число или одна переменная
    if (!check_tempVar(replace.string, 'E')) {

        response.string = `${operator.name}${replace.string}`
        return response
    }

    let temp_var = `E${30+state.vars.getTemp()}`

    response.additions.push(`${temp_var}=${replace.string}`)
    response.string = `${operator.name}${temp_var}`
    return response
}