'use babel'

export function check_wcs(operator) {
    if (!operator.match(/G5[4-7]/) && !operator.match(/G50[5-9]/)) {
        return
    }
    let return_value = {
        type: 'wcs_point'
    }
    if (operator.match(/G5[4-7]/)) {
        return_value.number = operator.substring(2) - 3
    } else {
        return_value.number = parseInt(operator.substring(2))
    }
    return return_value
}