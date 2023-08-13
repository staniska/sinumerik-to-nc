'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";
import {check_tempVar} from "../../check_temp_vars";

export function circle_replace(operator) {

    let resp = {
        string:'JOPA',
        additions: [],
        errors: [],
        info: []
    }

    if (operator.general) {
        resp.string = operator.general
    }

    if (operator.rnd) {
        let replace = replace_math(operator.rnd)
        resp.errors.push(...replace.errors)

        //Если возвращается число или одна переменная
        if (!check_tempVar(replace.string, 'E')) {
            resp.string = `R${replace.string}`
            return resp
        }

        let temp_var = `E${30+state.vars.getTemp()}`

        resp.additions.push(`${temp_var}=${replace.string}`)
        resp.string = `R${temp_var}`
    }

    if (operator.center) {
        const axis = replaceCenterAxis(operator.center.name, state)

        const value = operator.center.value
        let replace = replace_math(value)

        let math_value
        try {
            eval(`math_value = ${replace.string}`)
            replace.string = math_value.toString()
        } catch (e) {
            // console.log('Замена координаты центра на число не удалась')
        }

        resp.errors.push(...replace.errors)

        if (operator.center.source === 'IC') {
            resp.info.push('Warning! IC parsing is experimental feature')
        }

        // Если возвращается число или одна переменная
        if (!check_tempVar(replace.string, 'E')) {

            resp.string = `${axis}${replace.string}`
            return resp
        }

        let temp_var = `E${30+state.vars.getTemp()}`

        resp.additions.push(`${temp_var}=${replace.string}`)

        resp.string = `${axis}${temp_var}`
    }

    if (operator.pitch) {
        const value = operator.pitch.toFixed(4).toString()
        const fixedValue = value.substring(
            0, value.lastIndexOf(
                value.match(/[1-9.]/g)
                    [value.match(/[1-9.]/g).length - 1]
            ) + 1)
        resp.string = `K${fixedValue}`
    }

    if (resp.string === 'JOPA') {
        resp.errors.push(16)
    }

    return resp
}

const replaceCenterAxis = (axis, state) => {
    if (state.plane === 'G17') {
        return axis
    }
    if (state.plane === 'G18') {
        if (axis === 'I') {
            return 'J'
        }
        return 'I'
    }
    if (axis === 'J') {
        return 'I'
    }
    return 'J'
}