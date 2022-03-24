'use babel'

export function check_feedrate(operator) {
    let check = check_feedrate_value(operator)
    if (!check) {
        check = check_feedrate_general(operator)
    }
    return check
}

function check_feedrate_value(operator) {
    if (operator.match(/F[0-9.]+/) && operator.match(/F[0-9.]+/)[0] === operator) {
        return {
            type: 'feedrate_value',
            value: operator.substring(1)
        }
    }
    if (operator.match(/(?=^)F=/)) {
        return {
            type: 'feedrate_value',
            value: operator.substring(2)
        }
    }
}

function check_feedrate_general(operator) {
    const return_value = {
        type: 'feedrate_general',
        value: 0
    }
    if (operator === 'G95' || operator === 'G94') {
        return {...return_value, value: operator.substring(1)}
    }
}

