'use babel'

export function check_ang(str) {
    if (str.match(/(?<=\s|^)(ANG=)/)) {
        return {
            type: 'ang',
            value: str.substr(str.indexOf('=') + 1)
        }
    }
}