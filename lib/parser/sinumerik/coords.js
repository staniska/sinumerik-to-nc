'use babel'

import {state} from "../../panel/body";

const FILTERS = ['TRANS', 'ROT', 'MIRROR']

export function check_coords(operator, row) {
    let match = operator.match(/(?<=^)[XYZABCW](?==|\d|-)/)
    if (!match) return

    let right_index = 1

    if (operator.match('=')) {
        right_index++
    }

    const return_value = {
        type: 'coordinate',
        name: match[0],
        value: operator.substring(right_index)
    }

    if (operator.match(/=IC\(/)) {
        return_value.type = 'incremental_coordinate'
        return_value.value = return_value.value.substring(3, return_value.value.length - 1)
    }

    if (!row.split(' ')
        .filter(operator => {
            return FILTERS.some(filter => {
                return operator.match(filter)
            })
        })
        .length) {
        if (return_value.type !== 'incremental_coordinate') {
            state.targetPosition[return_value.name] = return_value.value
        } else {
            state.targetPosition[return_value.name] =
                state.prevPosition[return_value.name] + (return_value.value[0] === '-' ? '' : '+') + return_value.value
        }
    }

    if (match) {
        return return_value
    }

}