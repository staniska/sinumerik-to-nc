'use babel'

export function replace_d_num(operator) {
    if (operator.toolno) {
        return {
            string: ' ',
            errors: []
        }
    }

    return {
        string: `;__D${operator.value}__`,
        errors: [8]
    }
}