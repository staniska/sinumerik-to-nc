'use babel'

import {check_coords} from "./coords";

export const check_rot = (row) => {
    if (!row.match(/(?<=\s|^)ROT(?=\s|$)/)) {
        return
    }

    const coords = row.split(' ').filter(operator => {
        return operator.match(/(?<=^)[XYZ](?=\d|=)/)
    }).map(coord => {
        return check_coords(coord, row)
    })

    return {
        type: 'rot',
        coords: coords,
        row_parsed: 1
    }
}