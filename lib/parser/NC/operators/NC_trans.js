'use babel'

import {coordinate_replace} from "./NC_coordinate";
import {state} from "../../../panel/body";

export const replace_trans = (operator) => {

    let resp = {
        string: '',
        errors: [],
        additions: []
    }

    let coordString = ''

    operator.coords.forEach(coord => {
        const replace = coordinate_replace(coord)
        resp.errors.push(...replace.errors)
        resp.additions.push(...replace.additions)
        coordString += `,${replace.string}`
    })

    resp.string = `(UOT,${state.wcs_point}${coordString})`

    return resp
}