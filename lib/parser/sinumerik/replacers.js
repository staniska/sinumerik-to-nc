'use babel'

export function replace_comparison(symbol) {
    if (symbol === '==') {
        return 'EQ'
    }
    if (symbol === '<>') {
        return 'NE'
    }
    if (symbol === '>') {
        return 'GT'
    }
    if (symbol === '<') {
        return 'LT'
    }
    if (symbol === '>=') {
        return 'GE'
    }
    if (symbol === '<=') {
        return 'LE'
    }
}

export function change_var(str) {
    if (!str.match(/R[0-9]+/)) {
        return
    }
    if (str === str.match(/R[0-9]+/)[0]) {
        return {
            var_num: parseInt(str.substring(1))
        }
    }
}

export const sinumerik_maths = [
    'SIN',
    'COS',
    'TAN',
    'SQRT',
    'ASIN',
    'ACOS',
    'ATAN2',
    'TRUNC',
    'ABS',
    'ROUND',
    'POT',
]