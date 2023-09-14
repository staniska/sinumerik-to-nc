'use babel'

import {sinumerik_maths} from "../sinumerik/replacers";
import {atan2_replace, pot_replace} from "../same_operators";

export function replace_math(string) {

    const errors = []
    const additions = []

    sinumerik_maths.forEach((math, idx) => {
        let regExp = new RegExp(`(?<=\\W|^)${math}(?=\\W)`, 'g')

        if (string.match(regExp)) {
            if (F_maths[idx] === undefined) {
                errors.push(3)
                return
            }

            if (math === 'TRUNC') {
                additions.push('(TRUNC is equal FIX for positive values only !!!)')
            }

            if (math === 'ATAN2') {
                string = atan2_replace(string)
            }

            if (math === 'POT') {
                string = pot_replace(string)
            }

            string = string.replace(regExp, F_maths[idx])
        }
    })

    while (string.match(/(?<=\W|^)R[0-9]+(?=\W|$)/)) {
        string = string
            .replace(
                /(?<=\W|^)R[0-9]+(?=\W|$)/,
                '#' + (parseInt(string.match(/(?<=\W|^)R[0-9]+(?=\W|$)/)[0].substring(1)) + 100)
            )
    }
    while (string.match(/[()]/)) {
        string = string.replace('(', '[')
        string = string.replace(')', ']')
    }

    return {
        string,
        errors,
        additions
    }
}

export const F_maths = [
    'SIN',// 'SIN'
    'COS',// 'COS'
    'TAN',// 'TAN'
    'SQRT',// 'SQRT'
    'ASIN',// 'ASIN'
    'ACOS',// 'ACOS'
    'ATAN',// 'ATAN2'
    'FIX',// 'TRUNC'
    'ABS',// 'ABS'
    'ROUND',// 'ROUND'
    'POT',// 'POT'
]

