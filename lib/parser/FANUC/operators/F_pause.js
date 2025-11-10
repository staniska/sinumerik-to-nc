'use babel'

export const replace_pause = (operator) => {
    const resp = {
        string: `G4 X${operator.value}`
    }
    if (operator.valueType === 'revolutions') {
        resp.info = ['Revolutions type value not supported. Replaced by seconds']
    }
    return resp
}