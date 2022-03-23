'use babel'

import {state} from "../../../panel/body";
import {replace_conditions_math} from "./same";

export function if_goto_replace(operator) {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    const {line_num, errors} = state.parse.replaced.getTargetLine(operator.target)
    resp.errors.push(...errors)

    operator.conditions = replace_conditions_math(operator.conditions, resp.errors, resp.additions)

    if (operator.conditions.length === 1) {
        let condition = operator.conditions[0]
        resp.string = `IF[${condition.left}${condition.comparison}${condition.right}] GOTO ${line_num}`
    } else {
        const resp_conditions = operator.conditions.map(condition => {
            return `[${condition.left}${condition.comparison}${condition.right}]`
        })
        resp.string = `IF[${resp_conditions[0]}${operator.conditions[1].bool}${resp_conditions[1]}] GOTO ${line_num}`
    }

    return resp
}