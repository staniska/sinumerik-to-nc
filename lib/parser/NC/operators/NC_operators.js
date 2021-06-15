'use babel'

import {errors} from "../../errors/list";
import {wcs_replace} from "./NC_wcs_point";
import {operator_parse} from "../../sinumerik/operators";
import {check_math} from "../NC_replacers";
import {check_var} from "../NC_replacers";

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
        })
    }

    if (operator.type === 'null' || !operator.type) {
        resp.errors.push(1)
        return resp
    }

    if (operator.type === 'if_goto') {
        //Если условие одно
        console.log(operator)
        // operator.conditions.forEach((condition) => {
        //
        // })
        if (operator.conditions.length === 1) {
            console.log(check_var(operator.conditions[0].left))
        }
    }

    if (operator.type === 'wcs_point') {
        resp.replace = wcs_replace(operator)
        return resp
    }
    return resp
}