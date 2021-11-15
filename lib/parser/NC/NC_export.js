'use babel'

const encoding = require('encoding')

export function exportTextNC(text) {
    return encoding.convert(text, 'ibm866', 'utf-8')
}