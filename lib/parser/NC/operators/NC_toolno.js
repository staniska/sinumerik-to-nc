'use babel'

export function replace_toolno(operator) {
    return {
        string: `T${operator.value}`,
        errors: []
    }
}