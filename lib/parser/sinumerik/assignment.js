'use babel'

import {change_var} from "./replacers";

export function check_assignment(str) {
    if (!str.match('=')) {
        return
    }
    let match = str.match('=')
    let left = str.substring(0, match.index)

    if (change_var(left)) {
        return {
            type: 'assignment',
            ...change_var(left),
            value: str.substring(match.index + 1)
        }
    }
}