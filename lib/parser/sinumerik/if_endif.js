'use babel'


import {state} from "../../panel/body";
import {parse_condition} from "./parse_condition";


export function check_if_endif(row) {
    if (!row.match(/^IF\s/) || row.match('GOTO')) {
        return
    }

    let resp = {
        type: 'if_endif',
        else_row: state.parse.find_else(),
        errors: [],
        row_parsed: 1,
        origin: row
    }

    let endif_row = state.parse.find_endif()
    if (!endif_row) {
        resp.errors.push(6)
    }

    try {
        resp.conditions = parse_condition(row.substring(2).trim())
        resp.endif_row = endif_row
        return resp
    } catch (e) {
        resp.errors.push(5)
        return resp
    }
}