'use babel'

import {sinumerik_maths} from "../sinumerik/replacers";
import {state} from "../../panel/body";


export function replace_math(string) {

    let errors = []

    //TODO помимо -+ обрабатывать sinumerik_maths и создать аналогичный массив для NC для замещений
    sinumerik_maths.forEach((math, idx) => {
        let regExp = new RegExp(`(?<=\\W|^)${math}(?=\\W)`, 'g')

        if (string.match(regExp)) {
            if (NC_maths[idx] === undefined) {
                errors.push(3)
                return
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

export function check_var(string) {
    state.vars.getTemp()
    //TODO отдавать замененное имя переменной
    if (string.match(/R[0-9]+/) && string.match(/R[0-9]+/)[0] === string) {
        return 'VAR!!!'
    }
    return 0
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
    'ABS'// 'ABS'
    // 'POT'
    // 'ROUND'
]

