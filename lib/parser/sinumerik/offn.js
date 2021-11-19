'use babel'

export function check_offn(str) {
    if (str.match(/(?<=\s|^)(OFFN=)/)) {
        return {
            type: 'offn',
            value: str.substr(str.indexOf('=') + 1)
        }
    }
}