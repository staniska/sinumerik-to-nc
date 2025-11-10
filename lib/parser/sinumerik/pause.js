'use babel'

export function check_pause(str) {
    if (str.match(/(?<=\s|^)G4/)) {
        let value = str.match(/(?<=\s)([SF])(=?)(\d)/)
        if (!value) {
            return {
                type: 'pause',
                errors: [19],
                row_parsed: 1
            }
        }
        const valueType = value[1] === 'F'? 'seconds' : 'revolutions'
        return {
            type: 'pause',
            valueType,
            value: value[3],
            row_parsed: 1
        }
    }
}