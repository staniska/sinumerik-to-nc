'use babel'

export function check_goto(row) {
    if (row.match(/(?<=^|\s)IF(?=\s)/)) {
        return
    }

    if (!row.match(/(?<=^)GOTO[BF]?(?=\s)/)) {
        return
    }

    try {

        while (row.match(/GOTO[BF]/)) {
            row = row.replace(/GOTO[BF]/, 'GOTO')
        }

        return {
            type: 'goto',
            target: row.match(/(?<=GOTO\s)\w*/)[0],
            row_parsed: 1
        }
    } catch (e) {
        console.log(e)
        return {
            type: 'goto',
            errors: [2],
            row_parsed: 1
        }
    }
}