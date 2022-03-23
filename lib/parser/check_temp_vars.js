'use babel'

export function check_tempVar (string, varSymbol) {
    const re = RegExp(`${varSymbol}[0-9]+`)

    if ((string.match(/[\d.]+/) && (string.match(/[\d.]+/)[0] === string)) ||
        (string.match(re) && string.match(re)[0] === string) ||
        (string.match(/-[\d.]+/) && string.match(/-[\d.]+/)[0] === string)) {
        return 0
    }
    return 1
}