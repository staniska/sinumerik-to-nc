'use babel'

import {parse_condition} from "./parse_condition";

export function check_if_goto(row) {
    if (!row.match(/(?<=^|\s)IF(?=\s)/)) {
        return
    }
    if (!row.match(/(?<=\s)GOTO[BF]?(?=\s)/)) {
        return
    }
    if (row.match(/(?<=IF\s)[\S\s]*(?=\sGOTO)/)) {
        try {

            while (row.match(/GOTO[BF]/)) {
                row = row.replace(/GOTO[BF]/, 'GOTO')
            }

            return {
                type: 'if_goto',
                conditions: parse_condition(row.match(/(?<=IF\s)[\S\s]*(?=\sGOTO)/)[0]),
                target: row.match(/(?<=GOTO\s)\w*/)[0],
                row_parsed: 1
            }
        } catch (e) {
            console.log(e)
            return {
                type: 'if_goto',
                errors: [2],
                row_parsed: 1
            }
        }

    }


}