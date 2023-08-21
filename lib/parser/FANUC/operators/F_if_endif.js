'use babel'

import {state} from "../../../panel/body";
import {replace_conditions_math} from "./same";

export function if_else_replace(operator, if_num) {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    operator.conditions = replace_conditions_math(operator.conditions, resp.errors, resp.additions)

    if (if_num === undefined) {
        if_num = state.parse.replaced.add_endif()
    }

    state.text[operator.endif_row] = `N${300 + if_num} (ENDIF)`
    if (operator.else_row) {
        state.text[operator.else_row] = `N${200 + if_num} (ELSE)`
    }

    resp.additions.push(`(__${operator.origin.split('').filter(s => !s.match(/[()]/)).join('').toUpperCase()}__)`)

    if (operator.conditions.length === 1) {
        let condition = operator.conditions[0]
        resp.additions.push(`IF[${condition.left}${condition.comparison}${condition.right}] GOTO ${100 + if_num}`)
    } else {
        const resp_conditions = operator.conditions.map(condition => {
            return `[${condition.left}${condition.comparison}${condition.right}]`
        })
        resp.additions.push(`IF[${resp_conditions[0]}${operator.conditions[1].bool}${resp_conditions[1]}] GOTO ${100 + if_num}`)
    }

    resp.additions.push(`GOTO ${200 + if_num + (operator.else_row ? 0 : 100)}`)
    resp.additions.push(`N${100 + if_num}`)
    resp.string = ' '
    return resp


    // resp = if_else_replace({...operator, conditions: [operator.conditions[0]]}, if_num)
    // let resp_2 = if_else_replace({...operator, conditions: [operator.conditions[1]]}, if_num)
    // resp.errors.push(...resp_2.errors)

    // let full_resp = {
    //     ...resp,
    //     additions: [
    //         ...resp.additions.filter(addition => {
    //             return (addition.indexOf('(') !== 0 &&
    //                 addition.indexOf('"IF') !== 0)
    //         }),
    //         ...resp_2.additions.filter(addition => {
    //             return (addition.indexOf('(') !== 0 &&
    //                 addition.indexOf(';if') !== 0) &&
    //                 addition.indexOf('"IF') !== 0
    //         })
    //     ]
    // }
    //
    //
    // if (operator.conditions[1].bool !== 'OR' &&
    //     operator.conditions[1].bool !== 'AND') {
    //
    //     return {
    //         string: '',
    //         errors: [4],
    //         additions: []
    //     }
    // }
    //
    // if (operator.conditions[1].bool === 'OR') {
    //     full_resp.additions.push(resp.additions[resp.additions.findIndex(addition => {
    //             return addition.indexOf('(') === 0
    //         })])
    //     full_resp.additions.push(resp_2.additions[resp_2.additions.findIndex(addition => {
    //         return addition.indexOf('(') === 0
    //         })])
    //     if (!operator.else_row) {
    //         full_resp.additions.push(`(BNC,ENDIF${if_num})`)
    //     } else {
    //         full_resp.additions.push(`(BNC,ELSE${if_num})`)
    //     }
    //     full_resp.additions.push(`"IF${if_num}"`)
    // }
    //
    // if (operator.conditions[1].bool === 'AND') {
    //     full_resp.additions.push(resp.additions[
    //         resp.additions.findIndex(addition => {
    //             return addition.indexOf('(') === 0
    //         })].replace('IF','IF2D')
    //     )
    //     full_resp.additions.push(`(BNC,ENDIF${if_num})`) //FFF ?
    //     full_resp.additions.push(`"IF2D${if_num}"`)
    //     full_resp.additions.push(resp_2.additions[
    //         resp_2.additions.findIndex(addition => {
    //             return addition.indexOf('(') === 0
    //         })]
    //     )
    //     // full_resp.additions.push(`"FFF${if_num}"`)  //Рудимент (vestige)
    //     if (!operator.else_row) {
    //         full_resp.additions.push(`(BNC,ENDIF${if_num})`)
    //     } else {
    //         full_resp.additions.push(`(BNC,ELSE${if_num})`)
    //     }
    //     full_resp.additions.push(`"IF${if_num}"`)
    //     // return full_resp
    // }
    //
    // full_resp.additions.shift()
    // return full_resp
}