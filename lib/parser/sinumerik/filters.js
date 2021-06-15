'use babel'

export function remove_parentheses(expr) {
    let open_nums = expr.match(/\(/g) ? expr.match(/\(/g).length : 0
    let close_nums = expr.match(/\)/g) ? expr.match(/\)/g).length : 0
    if (open_nums === close_nums) {
        return expr
    }
    if (open_nums > close_nums) {
        return expr.substring(1)
    }
    return (expr.substring(0, expr.length - 1))
}
