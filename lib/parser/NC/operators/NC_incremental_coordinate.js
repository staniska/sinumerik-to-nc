'use babel'

import {state} from "../../../panel/body";
import {replace_math} from "../NC_replacers";

export const replace_incremental_coordinate = (operator) => {

    const replacement = (replace_math(state.targetPosition[operator.name]))

    const temp_var = `E${30 + state.vars.getTemp()}`

    return {
        string: `${operator.name}${temp_var}`,
        additions: [`${temp_var}=${replacement.string}`],
        errors: replacement.errors
    }
}