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

    return {
        operator: replace,
        additions: additions,
        errors: errors,
        place: place,
        row_parsed: row_parsed
    }
}

export const atan2_replace = (string) => {
    const atanIndex = string.indexOf('ATAN2')+1

    if (atanIndex) {
        const commaIndex = string.indexOf(',', atanIndex)
        if (commaIndex > 0) {
            string = string.substring(0, commaIndex) + '/' + string.substring(commaIndex + 1)
        }
    }
    return string
}

export const resp_merge = (resp, replacements) => {
    resp.replacement = replacements.string
    if (replacements.errors) {
        resp.errors.push(...replacements.errors)
    }
    if (replacements.additions) {
        resp.additions.push(...replacements.additions)
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