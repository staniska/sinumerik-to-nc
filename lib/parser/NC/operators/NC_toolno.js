'use babel'

export function replace_toolno(operator) {
    return {
        string: `T${operator.value}.${operator.d_num ? operator.d_num : operator.value}`,
        errors: []
    }
}