'use babel'

import {replace_math} from "../F_replacers";

export const replace_conditions_math = (conditions, errors, additions) => {
    return conditions.map(condition => {
        let parts = ['left', 'right']
        parts.forEach(partName => {
            const replacement = replace_math(condition[partName])
            condition[partName] = replacement.string
            errors.push(...replacement.errors)
            additions.push(...replacement.additions)
        })
        return condition
    })
}