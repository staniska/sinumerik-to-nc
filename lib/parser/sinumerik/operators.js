'use babel'

import {check_wcs} from "./wcs_point";
import {check_if_goto} from "./if";

export function operator_parse(operator, row, index, state) {
    let check

    //Сначала прогоняем функции, которые могут распарсить всю строку сразу
    //IF - GOTO
    check = check_if_goto(operator, row, index, state)
    if (check) {
        return check
    }

    //WCS
    if (check_wcs(operator)) {
        return check_wcs(operator)
    }
    return {type: 'null'}
}