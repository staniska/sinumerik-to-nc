'use babel'

import {NC_operator_replace} from "./operators/NC_operators";
import {operator_parse} from "../sinumerik/operators";
import {handle_parse_value} from "../same_operators";

export function NC_operatorParse(operator, row) {

    let parse_value = NC_operator_replace(operator_parse(operator, row))

    return handle_parse_value(parse_value, operator)
}
