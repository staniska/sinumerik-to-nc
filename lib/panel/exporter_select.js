'use babel'

import {exportTextNC} from "../parser/NC/NC_export";
import {exportTextF} from "../parser/FANUC/F_export";

export function exporter_select(lang) {
    if (lang === 'NC') {
        return {
            exporter: exportTextNC,
        }
    }

    if (lang.match(/FANUC/)) {
        return {
            exporter: exportTextF,
        }
    }
}