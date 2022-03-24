'use babel'

import {vars} from "../../vars";
import {operator_errors, replace_same, resp_merge} from "../../same_operators";
import {coordinate_replace} from "./F31T_coordinate";
import {assignment_replace} from "../../FANUC/operators/F_assignment";
import {if_else_replace} from "../../FANUC/operators/F_if_endif";
import {if_goto_replace} from "../../FANUC/operators/F_if_goto";
import {replace_target} from "../../FANUC/operators/F_target";
import {goto_replace} from "../../FANUC/operators/F_goto";
import {replace_toolno} from "../../FANUC/operators/F_toolno";
import {replace_d_num} from "../../same_operators";
import {add_dot} from "../../FANUC/decimalDot";
import {replace_feedrate} from "../../FANUC/operators/F_feed";

export function F31T_operator_replace(operator) {
    //Надо вернуть замену, ошибки, добавленные строчки и флаг before
    const resp = vars.resp()

    if (operator.row_parsed === 1) {
        resp.row_parsed = 1
    }

    if (operator_errors(operator, resp).error) {
        return resp
    }

    if (operator.type === 'target') {
        resp_merge(resp, replace_target(operator))
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
    //
    // if (operator.type === 'wcs_point') {
    //     state.wcs_point = operator.number
    //     resp.replace = wcs_replace(operator)
    // }
    //
    if (operator.type === 'coordinate') {
        resp_merge(resp, coordinate_replace(operator))
    }

    //
    // if (operator.type === 'target') {
    //     resp.replace = '"' + operator.name + '"'
    // }
    //
    // if (operator.type === 'circle') {
    //     let replace = circle_replace(operator)
    //     resp.replace = replace.string
    //     resp.errors.push(...replace.errors)
    //     resp.additions.push(...replace.additions)
    // }
    //
    if (operator.type === 'toolno') {
        resp_merge(resp, replace_toolno(operator))
    }
    if (operator.type === 'd_num') {
        resp_merge(resp, replace_d_num(operator))
    }
    //
    // if (operator.type === 'offn') {
    //     let replace = replace_offn(operator)
    //     resp.replace = replace.string
    //     resp.errors.push(...replace.errors)
    // }
    //
    if (operator.type === 'feedrate_value') {
        resp_merge(resp, replace_feedrate(operator))
    }
    //
    // if (operator.type === 'feedrate_general') {
    //     resp.replace = `G${operator.value}`
    // }
    //
    // if (operator.type === 'spindle_speed') {
    //
    //     resp.replace = `S${operator.value}`
    // }
    //
    // if (operator.type === 'plane') {
    //     resp.replace = operator.value
    // }
    //
    // if (operator.type === 'trans') {
    //     const replace = replace_trans(operator)
    //     resp.replace = replace.string
    //     resp.errors.push(...replace.errors)
    //     resp.additions.push(...replace.additions)
    // }

    if (resp.replacement === '') {
        if (replace_same(operator) !== null) {
            resp.replacement = replace_same(operator)
        } else {
            console.error('Replacement not found: ')
            console.log(operator)
            resp.errors.push(13)
        }
    }

    return resp
}