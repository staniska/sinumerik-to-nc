'use babel'

import {state} from "../../panel/body";

export const check_plane = (operator) => {
    const match = operator.match(/(?<=^)G1[789](?<=$)/)
    if (match) {
        state.plane = operator
        return {
            type: 'plane',
            value: match[0]
        }
    }
}