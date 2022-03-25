'use babel'

import {state} from "../../../panel/body";
import {replace_math} from "../../FANUC/F_replacers";

export const replace_incremental_coordinate = (operator) => {

    if ((state.fanuc_type === 'A' || state.fanuc_type === null) && operator.name.match(/[XYZ]/)) {
        const name_replacements = {X: 'U', Z: 'W', Y: 'V', C: 'H'}
        const replacement = replace_math(operator.value)

        if (replacement.string !== operator.value) {
            replacement.string = `[${replacement.string}]`
        }

        if (state.fanuc_type === null) {
            replacement.errors.push(15)
        }

        return {
            string: `${name_replacements[operator.name]}${replacement.string}`,
            errors: replacement.errors
        }
    }

    const replacement = (replace_math(state.targetPosition[operator.name]))

    return {
        string: `${operator.name}[${replacement.string}]`,
        errors: replacement.errors
    }
}