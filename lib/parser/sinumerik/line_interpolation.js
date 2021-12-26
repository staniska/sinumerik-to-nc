'use babel'
import {state} from "../../panel/body";

export function check_line_interpolation(operator) {
    if (operator.match(/(?<=^)G1/) && operator.match(/(?<=^)G1/)[0] === operator) {
        state.moveGroup = 'G1'
        return {
            type: 'line_interpolation'
        }
    }
}