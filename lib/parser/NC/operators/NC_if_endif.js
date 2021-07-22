'use babel'

import {replace_math} from "../NC_replacers";
import {state} from "../../../panel/body";

export function if_else_replace(operator, if_num) {
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

    if (if_num === undefined) {
        if_num = state.parse.replaced.add_endif()
    }
    state.text[operator.endif_row] = `ENDIF${if_num}:`
    if (operator.else_row) {
        state.text[operator.else_row] = `ELSE${if_num}:`
    }

    resp.additions.push(`;${operator.origin.toLowerCase()}`)

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

        resp.additions.push(`(B${condition.comparison},${parts.left},${parts.right},IF${if_num})`)
        if (!operator.else_row) {
            resp.additions.push(`(BNC,ENDIF${if_num})`)
        } else {
            resp.additions.push(`(BNC,ELSE${if_num})`)
        }
        resp.additions.push(`"IF${if_num}"`)
        resp.string = ' '

        return resp
    }

    resp = if_else_replace({...operator, conditions: [operator.conditions[0]]}, if_num)
    let resp_2 = if_else_replace({...operator, conditions: [operator.conditions[1]]}, if_num)
    resp.errors.push(...resp_2.errors)

    let full_resp = {
        ...resp,
        additions: [
            ...resp.additions.filter(addition => {
                return (addition.indexOf('(') !== 0 &&
                    addition.indexOf('"IF') !== 0)
            }),
            ...resp_2.additions.filter(addition => {
                return (addition.indexOf('(') !== 0 &&
                    addition.indexOf(';if') !== 0) &&
                    addition.indexOf('"IF') !== 0
            })
        ]
    }




    if (operator.conditions[1].bool === 'OR') {
        full_resp.additions.push(resp.additions[resp.additions.findIndex(addition => {
                return addition.indexOf('(') === 0
            })])
        full_resp.additions.push(resp_2.additions[resp_2.additions.findIndex(addition => {
            return addition.indexOf('(') === 0
            })])
        if (!operator.else_row) {
            full_resp.additions.push(`(BNC,ENDIF${if_num})`)
        } else {
            full_resp.additions.push(`(BNC,ELSE${if_num})`)
        }
        full_resp.additions.push(`"IF${if_num}"`)
    }

    if (operator.conditions[1].bool === 'AND') {
        full_resp.additions.push(resp.additions[
            resp.additions.findIndex(addition => {
                return addition.indexOf('(') === 0
            })].replace('IF','IF2D')
        )
        full_resp.additions.push(`(BNC,FFF${if_num})`)
        full_resp.additions.push(`"IF2D${if_num}"`)
        full_resp.additions.push(resp_2.additions[
            resp_2.additions.findIndex(addition => {
                return addition.indexOf('(') === 0
            })]
        )
        full_resp.additions.push(`"FFF${if_num}"`)
        if (!operator.else_row) {
            full_resp.additions.push(`(BNC,ENDIF${if_num})`)
        } else {
            full_resp.additions.push(`(BNC,ELSE${if_num})`)
        }
        full_resp.additions.push(`"IF${if_num}"`)
        return full_resp
    }


    return full_resp

    return {
        string: '',
        errors: [4],
        additions: []
    }
}