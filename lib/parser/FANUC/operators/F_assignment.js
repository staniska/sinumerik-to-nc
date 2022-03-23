'use babel'

import {replace_math} from '../F_replacers';
import {state} from "../../../panel/body";

export function assignment_replace(assignment) {
    state.vars.used.push(assignment.var_num)
    let replacement = replace_math(assignment.value)

    return {
        string: `#${100 + assignment.var_num}=${replacement.string}`,
        errors: replacement.errors,
        additions: replacement.additions
    }
}