'use babel'

import {wcs_replace} from "./NC_wcs_point";
import {assignment_replace} from "./NC_assignment";
import {if_goto_replace} from "./NC_if_goto";
import {coordinate_replace} from "./NC_coordinate";
import {if_else_replace} from "./NC_if_endif";
import {circle_replace} from "./NC_circle_interpolation";
import {replace_toolno} from "./NC_toolno";
import {replace_d_num} from "../../same_operators";
import {replace_offn} from "./NC_offn";
import {replace_trans} from "./NC_trans";
import {state} from "../../../panel/body";
import {vars} from "../../vars";
import {operator_errors, resp_merge} from "../../same_operators";
import {replace_feedrate} from "./NC_feed";
import {replace_incremental_coordinate} from "./NC_incremental_coordinate";
import {goto_replace} from "./NC_goto";

export function NC_operator_replace(operator) {
    //Надо вернуть замену, ошибки, добавленные строчки и флаг before
    let resp = vars.resp()

    if (operator.row_parsed === 1) {
        resp.row_parsed = 1
    }

    if (operator_errors(operator, resp).error) {
        return resp
    }

    if (operator.type === 'if_goto') {
        resp_merge(resp, if_goto_replace(operator))
    }

    if (operator.type === 'if_endif') {
        resp_merge(resp, if_else_replace(operator))
    }

    if (operator.type === 'goto') {
        resp_merge(resp, goto_replace(operator))
    }

    if (operator.type === 'assignment') {
        resp_merge(resp, assignment_replace(operator))
    }

    if (operator.type === 'wcs_point') {
        state.wcs_point = operator.number
        resp.replacement = wcs_replace(operator)
    }

    if (operator.type === 'coordinate') {
        resp_merge(resp, coordinate_replace(operator))
    }

    if (operator.type === 'rapid') {
        resp.replacement = 'G0'
    }

    if (operator.type === 'line_interpolation') {
        resp.replacement = 'G1'
    }

    if (operator.type === 'macro') {
        resp.replacement = 'M' + operator.value
    }

    if (operator.type === 'target') {
        resp.replacement = '"' + operator.name + '"'
        if (operator.subtype === 'else') {
            resp.additions.push(`(BNC,ENDIF${operator.value})`)
        }
        if (operator.name.length > 6) {
            resp.errors.push(17)
        }
    }

    if (operator.type === 'circle') {
        resp_merge(resp, circle_replace(operator))
    }

    if (operator.type === 'toolno') {
        resp_merge(resp, replace_toolno(operator))
    }

    if (operator.type === 'd_num') {
        resp_merge(resp, replace_d_num(operator))
    }

    if (operator.type === 'offn') {
        resp_merge(resp, replace_offn(operator))
    }

    if (operator.type === 'feedrate_value') {
        resp_merge(resp, replace_feedrate(operator))
    }

    if (operator.type === 'feedrate_general') {
        resp.replacement = `G${operator.value}`
    }

    if (operator.type === 'spindle_speed') {
        resp.replacement = `S${operator.value}`
    }

    if (operator.type === 'spindle_constant_surface_speed') {
        resp.replacement = `G${97 - operator.value}`
    }

    if (operator.type === 'plane') {
        resp.replacement = operator.value
    }

    if (operator.type === 'trans') {
        resp_merge(resp, replace_trans(operator))
    }

    if (operator.type === 'subroutine') {
        resp.replacement = operator.name
        resp.errors.push(14)
    }

    if (operator.type === 'incremental_coordinate') {
        resp_merge(resp, replace_incremental_coordinate(operator))
    }


    if (resp.replacement === '') {
        // console.log(operator)
        resp.errors.push(13)
    }

    return resp
}