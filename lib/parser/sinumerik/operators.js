'use babel'

import {check_wcs} from "./wcs_point";
import {check_if_goto} from "./if_goto";
import {check_assignment} from "./assignment";
import {check_coords} from "./coords";
import {check_rapid} from "./rapid";
import {check_macros} from "./macros";
import {check_target} from "./target";
import {check_line_interpolation} from "./line_interpolation";
import {check_if_endif} from "./if_endif";

export function operator_parse(operator, row) {
    let check

    //Сначала прогоняем функции, которые могут распарсить всю строку сразу
    //IF - GOTO
    check = check_if_goto(row)
    if (check) {
        return check
    }

    check = check_if_endif(row)
    if (check) {
        return check
    }

    //Assignment. Присвоения вида R__=...
    check = check_assignment(row)
    if (check) {
        return check
    }

    //WCS
    check = check_wcs(operator)
    if (check) {
        return check
    }

    //Coordinate
    check = check_coords(operator)
    if (check) {
        return check
    }

    //G0
    check = check_rapid(operator)
    if (check) {
        return check
    }

    //M-func
    check = check_macros(operator)
    if (check){
        return check
    }

    //Target (GOTO)
    check = check_target(operator)
    if (check) {
        return check
    }

    //Line interpolation
    check = check_line_interpolation(operator)
    if (check) {
        return check
    }


    return {type: null}
}