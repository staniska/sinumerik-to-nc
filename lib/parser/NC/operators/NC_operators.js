'use babel'

import {wcs_replace} from "./NC_wcs_point";
import {assignment_replace} from "./NC_assignment";
import {if_goto_replace} from "./NC_if_goto";
import {coordinate_replace} from "./NC_coordinate";
import {if_else_replace} from "./NC_if_endif";
import {circle_replace} from "./NC_circle_interpolation";
import {replace_toolno} from "./NC_toolno";
import {replace_d_num} from "./NC_d_num";

export function NC_operator_replace(operator) {
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

    if (operator.type === 'circle') {
        let replace = circle_replace(operator)
        resp.replace = replace.string
        resp.errors.push(...replace.errors)
        resp.additions.push(...replace.additions)
    }

    if (operator.type === 'toolno') {
        let replace = replace_toolno(operator)
        resp.replace = replace.string
        resp.errors.push(...replace.errors)
    }
    if (operator.type === 'd_num') {
        let replace = replace_d_num(operator)
        resp.replace = replace.string
        resp.errors.push(...replace.errors)
    }

    return resp
}