'use babel'

const encoding = require('encoding')

export function exportTextNC(text, path) {
    return encoding.convert(text, 'ibm866', 'utf-8')
}