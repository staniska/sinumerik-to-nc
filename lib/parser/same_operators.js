'use babel'

export const operator_errors = (operator, resp) => {
    let error = false

    if (operator.errors && operator.errors.length) {
        operator.errors.forEach(err => {
            resp.errors.push(err)
        })
        error = true
    }

    if (operator.type === null || !operator.type) {
        resp.errors.push(1)
        error = true
    }

    return {
        resp,
        error
    }
}

export const handle_parse_value = (parse_value, operator) => {
    const errors = []
    let place = 'line'
    let replace = operator
    let row_parsed = 0

    if (!parse_value) {
        errors.push(0)
    }

    if (parse_value.replacement.length) {
        replace = parse_value.replacement
    }

    if (parse_value.errors.length) {
        parse_value.errors.forEach(err => {
            errors.push(err)
        })
    }

    if (parse_value.row_parsed) {
        row_parsed = 1
    }
    if (parse_value.place) {
        place = parse_value.place
    }

    const additions = [...parse_value.additions]
    const additionsEnd = (parse_value.additionsEnd && parse_value.additionsEnd.length) ? parse_value.additionsEnd : []

    const info = [...parse_value.info]


    return {
        operator: replace,
        additions,
        additionsEnd,
        errors,
        place,
        row_parsed,
        info
    }
}

export const atan2_replace = (string) => {
    const atanIndex = string.indexOf('ATAN2') + 5
    if (atanIndex) {
        const commaIndex = string.indexOf(',', atanIndex)
        const closeBracketIdx = findCloseBracketIdx(string, atanIndex + 4)
        if (commaIndex > 0) {
            string = string.substring(0, atanIndex + 1) + '(' +
                string.substring(atanIndex + 1, commaIndex) + ')' +
                '/(' + string.substring(commaIndex + 1, closeBracketIdx) +
                ')' + string.substring(closeBracketIdx)
        }
    }
    return string
}

//TODO clear code

export const pot_replace = (string) => {
    while (string.match(/(?<=\W|^)POT(?=\W)/)) {
        const openBracketIdx = string.match(/(?<=\W|^)POT(?=\W)/).index + 3
        let closeBracketIdx = null
        let i = openBracketIdx + 1
        let level = 0;
        while (!closeBracketIdx && i < string.length) {
            if (string[i] === ')' && level === 0) {
                closeBracketIdx = i
            }
            if (string[i] === '(') level++
            if (string[i] === ')') level--
            i++
        }

        const arg = string.substring(openBracketIdx + 1, closeBracketIdx)
        string = string.replace(`POT(${arg})`, `(${arg})*(${arg})`)
    }
    return string
}

export const findCloseBracketIdx = (string, openBracketIdx) => {
    let closeBracketIdx = null
    let i = openBracketIdx + 1
    let level = 0;
    while (!closeBracketIdx && i < string.length) {
        if (string[i] === ')' && level === 0) {
            closeBracketIdx = i
        }
        if (string[i] === '(') level++
        if (string[i] === ')') level--
        i++
    }
    return closeBracketIdx
}

export const resp_merge = (resp, replacements) => {
    resp.replacement = replacements.string
    if (replacements.errors) {
        resp.errors.push(...replacements.errors)
    }
    if (replacements.additions) {
        resp.additions.push(...replacements.additions)
    }
    if (replacements.additionsEnd) {
        resp.additionsEnd.push(...replacements.additionsEnd)
    }
    if (replacements.info) {
        resp.info.push(...replacements.info)
    }
}

export const replace_same = (operator) => {
    if (operator.type === 'rapid') {
        return 'G0'
    }

    if (operator.type === 'line_interpolation') {
        return 'G1'
    }

    if (operator.type === 'macro') {
        return ('M' + operator.value)
    }

    return null
}

export function replace_d_num(operator) {
    if (operator.toolno) {
        return {
            string: ' ',
            errors: []
        }
    }

    return {
        string: `;__D${operator.value}__`,
        errors: [8]
    }
}