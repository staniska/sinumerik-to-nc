'use babel'

import {state} from "../../../panel/body";

export function goto_replace(operator) {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    const {line_num, errors} = state.parse.replaced.getTargetLine(operator.target)
    resp.errors.push(...errors)

    resp.string = `GOTO ${line_num}`

    return resp
}