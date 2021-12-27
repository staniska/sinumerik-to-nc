'use babel'

import {check_coords} from "./coords";

export const check_trans = (row) => {
    if (!row.match(/(?<=\s|^)TRANS(?=\s)/)) {
        return
    }

    const coords = row.split(' ').filter(operator => {
        return operator.match(/(?<=^)[XYZ](?=\d|=)/)
    }).map(coord => {
        return check_coords(coord, row)
    })

    return {
        type: 'trans',
        coords: coords,
        row_parsed: 1
    }
}