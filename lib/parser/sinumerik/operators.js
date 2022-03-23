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
import {check_circle} from "./circle_interpolation";
import {check_tool} from "./tool";
import {check_offn} from "./offn";
import {check_feedrate} from "./feedrate";
import {check_spindle} from "./spindle";
import {check_plane} from "./plane";
import {check_trans} from "./trans";
import {check_goto} from "./goto";
import {check_subroutine} from "./subroutine";

export function operator_parse(operator, row) {
    let result = {type: null}

    //Сначала прогоняем функции, которые могут распарсить всю строку сразу
    //IF - GOTO
    check(check_if_goto, row)
    check(check_if_endif, row)
    check(check_goto, row)
    check(check_subroutine, row)

    //Assignment. Присвоения вида R__=...
    check(check_assignment, row)
    //TRANS
    check(check_trans, row)
    //feedrate
    check(check_feedrate, operator)
    // circle
    check(check_circle,row, operator)
    //WCS
    check(check_wcs, operator)
     //Coordinate
    check(check_coords, operator, row)
    //G0
    check(check_rapid, operator)
    //M-func
    check(check_macros, operator)
    //Target (GOTO)
    check(check_target, operator)
    //Line interpolation
    check(check_line_interpolation, operator)
    //Toolno
    check(check_tool, operator, row)
    //OFFN
    check(check_offn, operator)
    //spindle
    check(check_spindle, operator)
    //plane G17/18/19
    check(check_plane, operator)


    return result

    function check(checker, ...args) {
        if (result.type !== null) {
            return
        }

        const res = checker(...args)
        if (res) {
            result = res
        }
    }
}