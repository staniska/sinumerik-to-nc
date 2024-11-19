'use babel'

export function check_target(operator) {
    let match = operator.match(/^[_A-Z][_A-Z]\w*(?=:)/)
    if (match) {
        const resp = {
            type: 'target',
            name: match[0],
            subtype: 'simple',
            value: ''
        }
        if (operator.match(/(?<=ELSE)\d+(?=:)/)) {
            resp.subtype = 'else'
            resp.value = operator.match(/(?<=ELSE)\d+(?=:)/)[0]
        }
        return resp
    }
}