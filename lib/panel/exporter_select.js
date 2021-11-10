'use babel'

import {exportTextNC} from "../parser/NC/export";

export function exporter_select(lang) {
    if (lang === 'NC') {
        return {
            exporter: exportTextNC,
        }
    }
}