'use babel'

export function goto_replace(operator) {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }
    if (operator.target?.length > 6) {
        resp.errors.push(17)
    }
    resp.string = `(BNC, ${operator.target})`

    return resp
}