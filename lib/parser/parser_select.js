'use babel'

import {NC_operatorParse} from "./NC/NC_operator_parse";
import {NC_PREFIX} from "./NC/NC_comment";
import {F31T_POSTFIX, F31T_PREFIX} from "./FANUC_31i_lathe/F31T_comment";
import {F31L_operatorParse} from "./FANUC_31i_lathe/F31T_operator_parse";

export function select_parser(lang) {
    if (lang === 'NC') {
        return {
            operatorParse: NC_operatorParse,
            comment:{
                prefix: NC_PREFIX,
                postfix: '',
            }
        }
    }

    if (lang === 'FANUC_31i_lathe') {
        return {
            operatorParse: F31L_operatorParse,
            comment: {
                prefix: F31T_PREFIX,
                postfix: F31T_POSTFIX
            }
        }
    }
}