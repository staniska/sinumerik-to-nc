'use babel'

import {state} from "../../panel/body";

export const check_subroutine = (row) => {
    if (row.match(/[:\s=;]/)) {
        return
    }

    let subroutine_name

    if (row.match(/[()]/)) {
        subroutine_name = row.trim().substring(0, row.indexOf('('))
    } else {
        subroutine_name = row.trim()
    }

    if (state.subroutines
        .find(subroutine => subroutine.name.substring(0, subroutine.name.lastIndexOf('_')) === subroutine_name)) {

        const variables = []

        if (row.match(/\(/) && row.match(/\)/)) {
            variables.push(
                ...row
                    .substring(row.indexOf('(') + 1, row.lastIndexOf(')'))
                    .split(',')
            )
        }

        return {
            type: 'subroutine',
            name: subroutine_name,
            variables
        }
    }
}