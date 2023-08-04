'use babel'

import {replace_math} from '../F_replacers'
import {check_tempVar} from "../../check_temp_vars";
import {add_dot} from "../decimalDot";

export function rnd_chr_replace(operator) {

    const replacement = replace_math(operator.value)
    const name = operator.type === 'rnd'? 'R' : 'C'

    // Если возвращается выражение
    if (check_tempVar(replacement.string, '#')) {
        replacement.string = `${name}[${replacement.string}]`
    } else {
        const replacement_with_dot = add_dot(replacement)
        replacement.string = `${name}${replacement_with_dot.string}`
        replacement.errors.push(...replacement_with_dot.errors)
    }

    return replacement
}