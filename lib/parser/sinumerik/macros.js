'use babel'

export function check_macros(operator) {
    if (operator.match(/M[0-9]+/) && operator.match(/M[0-9]+/)[0] === operator) {
        return {
            type: 'macro',
            value: operator.substring(1)
        }
    }
}