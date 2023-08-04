'use babel'

export function check_rnd_chr(str) {
    if (str.match(/(?<=\s|^)(RND=)/)) {
        return {
            type: 'rnd',
            value: str.substr(str.indexOf('=') + 1)
        }
    }
    if (str.match(/(?<=\s|^)(CHR=)/)) {
        return {
            type: 'chr',
            value: str.substr(str.indexOf('=') + 1)
        }
    }
}