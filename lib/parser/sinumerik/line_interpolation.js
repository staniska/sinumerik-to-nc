'use babel'

export function check_line_interpolation(operator) {
    if (operator.match(/(?<=^)G1/) && operator.match(/(?<=^)G1/)[0] === operator) {
        return {
            type: 'line_interpolation'
        }
    }
}