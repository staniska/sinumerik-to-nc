'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";

export function if_goto_replace(operator) {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    operator.conditions = operator.conditions.map(condition => {
        let parts = ['left', 'right']
        parts.forEach(partName => {
            let replace = replace_math(condition[partName])
            condition[partName] = replace.string
            resp.errors.push(...replace.errors)
        })
        return condition
    })


    if (operator.conditions.length === 1) {
        let condition = operator.conditions[0]

        let parts = {
            left: '',
            right: ''
        }

        Object.keys(parts).forEach(key => {
            if (!(condition[key].match(/E[0-9]+/) &&
                condition[key].match(/E[0-9]+/)[0] === condition[key]) &&
                !(key === 'right' && condition[key].match(/[\d.]+/) && condition[key].match(/[\d.]+/)[0] === condition[key])) {
                parts[key] = `E${30+state.vars.getTemp()}`

                let replace = replace_math(condition[key])
                resp.errors.push(...replace.errors)
                resp.additions.push(`${parts[key]}=${condition[key]}`)
            } else {
                parts[key] = condition[key]
            }
        })

        resp.string = `(B${condition.comparison},${parts.left},${parts.right},"${operator.target}")`

        return resp
    }

    resp = if_goto_replace({...operator, conditions: [operator.conditions[0]]})
    let resp_2 = if_goto_replace({...operator, conditions: [operator.conditions[1]]})
    resp.additions.push(...resp_2.additions)
    resp.errors.push(...resp_2.errors)

    if (operator.conditions[1].bool === 'OR') {
        resp.additions.push(resp.string)
        resp.additions.push(resp_2.string)
        resp.string = ' '

        return resp
    }
    if (operator.conditions[1].bool === 'AND') {
        resp.additions.push(resp.string.substring(0, resp.string.length - 4) + 'TT")')
        resp.additions.push(`(BNC,"${operator.target.substring(0,operator.target.length - 2)}FF")`)
        resp.additions.push(`"${operator.target.substring(0,operator.target.length - 2)}TT"`)
        resp.additions.push(resp_2.string)
        resp.additions.push(`"${operator.target.substring(0,operator.target.length - 2)}FF"`)
        resp.string = ' '
        return resp
    }

    return {
        string: '',
        errors: [4],
        additions: []
    }
}