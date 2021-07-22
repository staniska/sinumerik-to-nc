'use babel'

export function check_target(operator) {
    let match = operator.match(/^[_A-Z][_A-Z]\w*(?=:)/)
    if (match) {
        return {
            type: 'target',
            name: match[0]
        }
    }
}