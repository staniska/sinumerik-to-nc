'use babel'

export function check_tool(operator, row) {
    if (check_D(operator)) {
        return {
            type: 'd_num',
            value: check_D(operator),
            toolno: check_T(row)
        }
    }

    if (check_T(operator)) {
        return {
            type: 'toolno',
            value: operator.substring(1),
            d_num: check_D(row)
        }
    }

}

function check_D(str) {
    if (str.match(/(?<=^|\s)D\d+(?=$|\s)/)) {
        return str.match(/(?<=^|\s)D\d+(?=$|\s)/)[0].substring(1)
    }
}

function check_T(str) {
    if (str.match(/(?<=^|\s)T\d+(?=$|\s)/)) {
        return str.match(/(?<=^|\s)T\d+(?=$|\s)/)[0].substring(1)
    }
}