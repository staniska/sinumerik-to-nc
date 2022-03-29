'use babel'

import {replace_math} from '../F_replacers'
import {state} from '../../../panel/body'
import {check_tempVar} from "../../check_temp_vars";
import {add_dot} from "../decimalDot";

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
        if (!check_tempVar(replace.string, '#')) {
            const value_with_dot = add_dot(replace)
            resp.string = `R${value_with_dot.string}`
            resp.errors.push(...value_with_dot.errors)
            return resp
        }

        resp.string = `R[${replace.string}]`
    }

    if (operator.center) {

        const value = operator.center.increment
        let replace = replace_math(value)

        let math_value
        try {
            eval(`math_value = ${replace.string}`)
            replace.string = math_value.toString()
        } catch (e) {
            // console.log('Замена координаты центра на число не удалась')
        }

        resp.errors.push(...replace.errors)

        if (operator.center.source === 'AC') {
            resp.info.push('Warning! AC parsing is experimental feature')
        }

        // Если возвращается число или одна переменная
        if (!check_tempVar(replace.string, '#')) {
            const value_with_dot = add_dot(replace)
            resp.string = `${operator.center.name}${value_with_dot.string}`
            resp.errors.push(...value_with_dot.errors)
            return resp
        }

        resp.string = `${axis}[${replace.string}]`
    }

    // if (operator.pitch) {
    //     const value = operator.pitch.toFixed(4).toString()
    //     const fixedValue = value.substring(
    //         0,value.lastIndexOf(
    //             value.match(/[1-9.]/g)
    //                 [value.match(/[1-9.]/g).length - 1]
    //         ))
    //     resp.string = `K${fixedValue}`
    // }

    return resp
}