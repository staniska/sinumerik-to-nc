'use babel'

export const check_spindle = (operator) => {
    const check = operator.match(/S[0-9]+/)
    if ( check && check[0] === operator) {
        return {
            type: 'spindle_speed',
            value: operator.substring(1)
        }
    }
}