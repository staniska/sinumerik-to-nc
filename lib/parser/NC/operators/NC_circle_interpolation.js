'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";
import {check_tempVar} from "./check_temp_vars";

export function circle_replace(operator) {
    let resp = {
        string:'JOPA',
        additions: [],
        errors: []
    }

    if (operator.general) {
        resp.string = operator.general
    }

    if (operator.rnd) {
        let replace = replace_math(operator.rnd)
        resp.errors.push(...replace.errors)

        //Если возвращается число или одна переменная
        if (!check_tempVar(replace.string)) {

            resp.string = `R${replace.string}`
            return resp
        }

        let temp_var = `E${30+state.vars.getTemp()}`

        resp.additions.push(`${temp_var}=${replace.string}`)
        resp.string = `R${temp_var}`
        return resp
    }

    if (operator.center) {
        let value
        if (operator.center.value.match(/AC\(/)) {
            value = operator.center.value.substring(
                operator.center.value.indexOf('(') + 1,
                operator.center.value.length - 1)
        }
        let replace = replace_math(value)

        resp.errors.push(...replace.errors)

        // Если возвращается число или одна переменная
        if (!check_tempVar(replace.string)) {

            resp.string = `${operator.center.name}${replace.string}`
            return resp
        }

        let temp_var = `E${30+state.vars.getTemp()}`

        resp.additions.push(`${temp_var}=${replace.string}`)
        resp.string = `${operator.center.name}${temp_var}`
        return resp
    }



    return resp
}