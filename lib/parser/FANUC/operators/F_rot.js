'use babel'

import {replace_math} from '../F_replacers';
import {add_dot} from "../decimalDot";
import {check_tempVar} from "../../check_temp_vars";

export function replace_rot(operator) {
    const resp = {
        string: '',
        errors: [],
        info: ['ROT parsing beta test!']
    }
    if (!operator.coords.length) {
        resp.string = 'G69'
        return resp
    }
    if (operator.coords.length > 1) {
        resp.errors.push(18)
    } else {
        const rot_vect_name = {X: 'I', Y: 'J', Z: 'K'}[`${operator.coords[0].name}`]
        const vectors =
            ['I', 'J', 'K']
                .filter(l => l !== rot_vect_name)
                .map(l => '' + l + '0')
                .toString()
                .replace(',', ' ') + ' ' + rot_vect_name + '1'
        let value = replace_math(operator.coords[0].value)
        // Если возвращается выражение
        if (check_tempVar(value.string, '#')) {
            value = `[${value.string}]`
        } else {
            value = add_dot(value).string
        }

        resp.string = `G68 X0 Y0 Z0 ${vectors} R${value}`
    }
    return resp

}