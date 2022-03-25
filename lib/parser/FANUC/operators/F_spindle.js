'use babel'

export const replace_spindle = (operator) => {
    if (operator.type === 'spindle_speed') {
        return {
            string: `S${operator.value}`
        }
    }
    return {
        string: `G${97 - operator.value}`
    }
}