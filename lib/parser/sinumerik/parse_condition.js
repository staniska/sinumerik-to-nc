'use babel'

import {remove_parentheses} from "./filters";
import {replace_comparison} from "./replacers";

export function parse_condition(expression) {
    let bool
    let expressions_arr = []

    //condition = {
    //     left: val,
    //     right: val,
    //     comparison: enum[EQ, BE, LE ...]
    //     bool: AND | OR
    // }

    //Сделать массив условий.
    // Пока делаем только 2 условия.
    // Иначе придется обрабатывать их вложенность
    if (expression.match(/(?<=\s)(OR)|(AND)(?=\s)/)) {
        let match = expression.match(/(?<=\s)(OR)|(AND)(?=\s)/)
        bool = match[0]
        expressions_arr[0] = expression.substring(0, match.index).trim()
        expressions_arr[1] = expression.substring(match.index + match[0].length).trim()
    } else {
        expressions_arr[0] = expression
    }

    //check invalid bool
    if (!bool && expression.match(/[<>=]+/g).length > 1) {
        bool = 'Err'
        expressions_arr[1] = '<>'  //crutch for invalid bool handling
    }

    expressions_arr = expressions_arr.map((expr) => {
        return remove_parentheses(expr)
    }).map((expr, index) => {
        let match = expr.match(/[<>=]+/)
        let parts = [
            expr.substring(0, match.index).trim(),
            expr.substring(match.index + match[0].length).trim()
        ].map(expr => {
            return remove_parentheses(expr)
        })
        return {
            left: parts[0],
            right: parts[1],
            comparison: replace_comparison(match[0]),
            bool: index ? bool : ''
        }
    })
    return expressions_arr
}
