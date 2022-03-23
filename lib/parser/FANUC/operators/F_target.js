'use babel'

import {state} from "../../../panel/body";

export const replace_target = (operator) => {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    const replacement = state.parse.replaced.getTargetLine(operator.name)

    resp.string = `N${replacement.line_num} (${operator.name})`
    resp.errors.push(...replacement.errors)

    return resp
}
