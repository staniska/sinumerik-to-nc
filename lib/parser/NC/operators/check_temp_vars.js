'use babel'

export function check_tempVar (string) {
    if ((string.match(/[\d.]+/) && (string.match(/[\d.]+/)[0] === string)) ||
        ((string.match(/E[0-9]+/)) && (string.match(/E[0-9]+/)[0] === string))) {
        return 0
    }
    return 1
}