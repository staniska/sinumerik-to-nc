'use babel'

import {sinumerik_maths} from "../sinumerik/replacers";

//this is crutch for unresolved substring method
// noinspection JSUnresolvedFunction
export function replace_math(string) {

    let errors = []

    sinumerik_maths.forEach((math, idx) => {
        let regExp = new RegExp(`(?<=\\W|^)${math}(?=\\W)`, 'g')

        if (string.match(regExp)) {
            if (NC_maths[idx] === undefined) {
                errors.push(3)
                return
            }
            if (math === 'ATAN2') {
                const atanIndex = string.indexOf(math)+1
                if (atanIndex) {
                    const commaIndex = string.indexOf(',', atanIndex)
                    if (commaIndex) {
                        string = string.substring(0, commaIndex) + '/' + string.substring(commaIndex + 1)
                    }
                }
            }

            string = string.replace(regExp, NC_maths[idx])
        }
    })

    while (string.match(/(?<=\W|^)R[0-9]+(?=\W|$)/)) {
        string = string.replace(/(?<=\W|^)R[0-9]+(?=\W|$)/,'E' + (parseInt(string.match(/(?<=\W|^)R[0-9]+(?=\W|$)/)[0].substring(1)) + 30))
    }

    //TODO отдавать имя временной переменной и строчку с присвоением ей в additions
    return {
        string: string,
        errors: errors
    }
}

export const NC_maths = [
    'SIN',// 'SIN'
    'COS',// 'COS'
    'TAN',// 'TAN'
    'SQR',// 'SQRT'
    'ARS',// 'ASIN'
    'ARC',// 'ACOS'
    'ART',// 'ATAN2'
    'INT',// 'TRUNC'
    'ABS',// 'ABS'
    // 'POT'
    // 'ROUND'
]

