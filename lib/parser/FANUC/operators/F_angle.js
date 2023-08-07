'use babel'

import {replace_math} from '../F_replacers'
import {check_tempVar} from "../../check_temp_vars";
import {add_dot} from "../decimalDot";

export function angle_replace(operator) {

    const replacement = replace_math(operator.value)

    // Если возвращается выражение
    if (check_tempVar(replacement.string, '#')) {
        replacement.string = `,A[${replacement.string}]`
    } else {
        const replacement_with_dot = add_dot(replacement)
        replacement.string = `,A${replacement_with_dot.string}`
        replacement.errors.push(...replacement_with_dot.errors)
    }

    return replacement
}