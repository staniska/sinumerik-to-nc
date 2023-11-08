'use babel'

export function goto_replace(operator) {
    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    resp.string = `(BNC, ${operator.target})`

    return resp
}