'use babel'

import {state} from "../../panel/body";

export function check_rapid(operator) {
    if (operator === 'G0' || operator === 'G00') {
        state.moveGroup = 'G0'
        return {
            type: 'rapid'
        }
    }
}