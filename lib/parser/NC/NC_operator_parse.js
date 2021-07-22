'use babel'

import {NC_operator_replace} from "./operators/NC_operators";
import {operator_parse} from "../sinumerik/operators";

export function NC_operatorParse(operator, row) {

    let additions = []
    let errors = []
    let place = 'line'
    let replace = operator
    let row_parsed = 0

    let parse_value = NC_operator_replace(operator_parse(operator, row))

    if (!parse_value) {
        errors.push(0)
    }

    if (parse_value.replace.length) {
        replace = parse_value.replace
    }

    if (parse_value.errors.length) {
        parse_value.errors.forEach(err => {
            errors.push(err)
        })
    }

    if (parse_value.row_parsed) {
        row_parsed = 1
    }
    if (parse_value.place) {
        place = parse_value.place
    }

    additions = [...parse_value.additions]

    return {
        operator: replace,
        additions: additions,
        errors: errors,
        place: place,
        row_parsed: row_parsed
    }
}
