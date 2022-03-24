'use babel'

export function replace_toolno(operator) {
    const t_num = `${operator.value.length > 1 ? '' : '0'}${operator.value}`
    const d_num = operator.d_num ? `${operator.d_num.length > 1 ? '' : 0}${operator.d_num}` : t_num

    return {
        string: `T${t_num}${d_num}`,
        errors: []
    }
}