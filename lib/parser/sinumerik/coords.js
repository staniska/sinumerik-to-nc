'use babel'

import {change_var} from "./replacers";

export function check_coords(operator) {
    let match = operator.match(/(?<=^)[XYZABCW](?=\=|\d)/)
    if (match) {
        let right_index = 1
        if (operator.match('=')) {
            right_index ++
        }
        return {
            type: 'coordinate',
            name: match[0],
            value: operator.substring(right_index)
        }
    }
}