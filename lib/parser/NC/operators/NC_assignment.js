'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";

export function assignment_replace(assignment) {
    state.vars.used.push(assignment.var_num)
    let replace = replace_math(assignment.value)

    return {
        string: `E${30 + assignment.var_num}=${replace.string}`,
        errors: replace.errors
    }
}