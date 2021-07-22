'use babel'

import {errors} from "../../errors/list";
import {wcs_replace} from "./NC_wcs_point";
import {operator_parse} from "../../sinumerik/operators";
import {replace_math} from "../NC_replacers";
import {check_var} from "../NC_replacers";
import {assignment_replace} from "./NC_assignment";
import {if_goto_replace} from "./NC_if_goto";
import {coordinate_replace} from "./NC_coordinate";
import {if_else_replace} from "./NC_if_endif";

export function NC_operator_replace(operator, state) {
    //Надо вернуть замену, ошибки, добавленные строчки и флаг before
    let resp = {
        replace: '',
        errors: [],
        additions: [],
        place: 'line',
        row_parsed: 0
    }
    if (operator.row_parsed === 1) {
        resp.row_parsed = 1
    }

    if (operator.errors) {
        operator.errors.forEach(err => {
            resp.errors.push(err)
            return resp
        })
    }

    if (operator.type === null || !operator.type) {
        resp.errors.push(1)
        return resp
    }

    if (operator.type === 'if_goto') {
        let replace = if_goto_replace(operator)
        resp.replace = replace.string
        resp.additions.push(...replace.additions)
        resp.errors.push(...replace.errors)
    }

    if (operator.type === 'if_endif') {
        let replace = if_else_replace(operator)
        resp.replace = replace.string
        resp.additions.push(...replace.additions)
        resp.errors.push(...replace.errors)
    }


    if (operator.type === 'assignment') {
        let replace = assignment_replace(operator)
        resp.replace = replace.string
        resp.errors.push(...replace.errors)
    }

    if (operator.type === 'wcs_point') {
        resp.replace = wcs_replace(operator)
    }

    if (operator.type === 'coordinate') {
        let replace = coordinate_replace(operator)
        resp.replace = replace.string
        resp.additions.push(...replace.additions)
        resp.errors.push(...replace.errors)
    }

    if (operator.type === 'rapid') {
        resp.replace = 'G0'
    }

    if (operator.type === 'line_interpolation') {
        resp.replace = 'G1'
    }

    if (operator.type === 'macro') {
        resp.replace = 'M' + operator.value
    }

    if (operator.type === 'target') {
        resp.replace = '"' + operator.name + '"'
    }




    return resp
}