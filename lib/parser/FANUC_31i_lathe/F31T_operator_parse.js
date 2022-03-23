'use babel'

import {F31T_operator_replace} from "./operators/F31T_operators";
import {operator_parse} from "../sinumerik/operators";
import {handle_parse_value} from "../same_operators";
import {vars} from "../vars";

export function F31L_operatorParse(operator, row) {

    if (row.match(/^N[0-9]+\s\(\w+\)/)) {
        return handle_parse_value(
            {
                ...vars.resp(),
                row_parsed: true,
                replace: row
            },
            operator)
    }

    const parse_value = F31T_operator_replace(operator_parse(operator, row))

    return handle_parse_value(parse_value, operator)

}