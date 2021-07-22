'use babel'

export function check_rapid(operator) {
    if (operator === 'G0' || operator === 'G00') {
        return {
            type: 'rapid'
        }
    }
}