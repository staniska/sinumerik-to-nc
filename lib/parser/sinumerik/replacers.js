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

export const sinumerik_maths = [
    'SIN',
    'COS',
    'TAN',
    'SQRT',
    'POT',
    'ASIN',
    'ACOS',
    'ATAN2',
    'ROUND',
    'TRUNC',
    'ABS'
]