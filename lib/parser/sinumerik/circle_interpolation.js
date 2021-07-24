'use babel'

export function check_circle(row, operator) {
    if (!row.match(/G[23](?=\s)/) ||
        (operator.match(/[XYZABCWV]/) &&
            !operator.match(/AC/) &&
            !operator.match(/CR/))) {
        return
    }

    let resp = {
        type: 'circle',
        errors: [],
    }

    if (operator.match(/G[23]/)) {
        resp.general = operator
    }

    if (operator.match(/CR=/)) {
        resp.rnd = operator.substring(operator.indexOf('=') + 1)
    }

    if (operator.match(/[IJK]=?\d+.*/)) {
        resp.errors.push(7)
        return resp
    }

    if (operator.match(/[IJK]=AC\(/)) {
        resp.center = {}
        resp.center.name = operator.match(/[IJK]/)[0]
        resp.center.value = operator.substring(operator.indexOf('=') + 1)
    }
    return resp
}