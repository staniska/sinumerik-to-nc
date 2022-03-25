'use babel'

export const check_spindle = (operator) => {
    const check = operator.match(/S[0-9]+/)
    if ( check && check[0] === operator) {
        return {
            type: 'spindle_speed',
            value: operator.substring(1)
        }
    }

    if (operator === 'G96' || operator === 'G97') {
        return {
            type: 'spindle_constant_surface_speed',
            value: operator === 'G96'
        }
    }
}