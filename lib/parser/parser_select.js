'use babel'

import {NC_operatorParse} from "./NC/NC_operator_parse";
import {NC_PREFIX} from "./NC/NC_comment";

export function select_parser(lang) {

    if (lang === 'NC') {
        return {
            operatorParse: NC_operatorParse,
            comment_prefix: NC_PREFIX,
        }
    }
}