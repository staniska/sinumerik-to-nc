'use babel'

import {state} from "../../panel/body";

export function check_circle(row, operator) {

    const checkMoveGroup = row.match(/(?<=\S|^)G[23]/)
    if (checkMoveGroup) {
        state.moveGroup = checkMoveGroup[0]
    }

    if (!state.moveGroup.match(/G[23]/) ||
        !operator.match(/(TURN)|([IJK])|(CR)|(G[23])/) ||
        operator.match(/(?<=^)[XYZ](?=\d|=|-)/)
    ) { // || operator.match(/(?<=^)[XYZABCW](?=\d|=|-)/)
        return
    }

    let resp = {
        type: 'circle',
        errors: [],
    }

    const center_axes = {I: 'X', J: 'Y', K: 'Z'}

    if (operator.match(/G[23]/)) {
        resp.general = operator
    }

    if (operator.match(/CR=/)) {
        resp.rnd = operator.substring(operator.indexOf('=') + 1)
    }

    if (operator.match(/[IJK]=?-?\d+.*/) || operator.match(/[IJK]=IC\(/)) {

        resp.center = {}
        resp.center.name = operator.match(/[IJK]/)[0]

        if (operator.match(/=IC/)) {
            resp.center.increment = operator.substring(operator.indexOf('(') + 1, operator.length - 1)
        } else {
            let value_first_char = 1
            if (operator.match('=')) value_first_char ++

            resp.center.increment = operator.substring(value_first_char)
        }

        resp.center.value =
            state.prevPosition[center_axes[resp.center.name]] +
            (resp.center.increment[0] === '-' ? '' : '+') +
            (resp.center.name === 'I' && state.programData.machine.machineType === 'Lathe' ? `(${resp.center.increment})*2` : resp.center.increment )

        resp.center.source = 'IC'
    }

    if (operator.match(/[IJK]=AC\(/)) {
        resp.center = {}
        resp.center.name = operator.match(/[IJK]/)[0]
        resp.center.value = operator.substring(operator.indexOf('=') + 4, operator.length - 1)

        resp.center.increment = `${resp.center.value} - ${state.prevPosition[center_axes[resp.center.name]]}`
        if (resp.center.name === 'I' && state.programData.machine.machineType === 'Lathe') {
            resp.center.increment = `(${resp.center.increment})/2`
        }
        resp.center.source = 'AC'
    }

    if (operator.match('TURN')) {
        resp.turn = parseInt(operator.substring(5))
        const targetPos = getTargetPosition(row)
        if (checkExpression(targetPos) || checkExpression(state.prevPosition)) {
            resp.errors.push(9)
            return resp
        }
        const applicateAxis = getApplicateAxis(state.plane)
        const arcAng = getArcAng(state, targetPos, applicateAxis, row)
        resp.pitch = calculatePitch(state.prevPosition, targetPos, resp.turn, applicateAxis , arcAng )
    }
    return resp
}

const calculatePitch = (actPos, targetPos, turn, applicateAxis, arcAng) => {
    const applicatePath = Math.abs(targetPos[applicateAxis] - actPos[applicateAxis])

    if (Math.abs(arcAng - 360) < 1e-6) {
        return applicatePath / (turn + 1)
    }

    return applicatePath / ( turn + arcAng / 360 )

}

const checkExpression = (pos) => {
    return Object.values(pos).filter(val => {
        if (!val) {
            return false
        }
        const match = val.match(/(?<=^)[-0-9.]+/)
        if (!match || !match[0] === val) {
            return true
        }
    }).length > 0
}

const getArcAng = (state, targetPos, applicateAxis, row) => {
    const mainAxes = getMainAxes(state.plane)

    if ((Object.keys(targetPos).length === 1 && Object.keys(targetPos)[0] === applicateAxis) ||
        (mainAxes.every(axis => {
                return (targetPos[axis] && targetPos[axis] === state.prevPosition[axis])
            })
        )) {
        return 360
    }

    if (row.match(/(?=\S|^)CR=/)) {
        const crOperator = row.split(' ').filter(operator => operator.match(/(?=^)CR/))[0]
        const crOperatorValue = crOperator.substring(3)
        let arcAng = 2 * Math.asin(getDistance(targetPos, state) / (2 * Math.abs(crOperatorValue))) / Math.PI * 180
        if (crOperatorValue < 0) {
            arcAng = 360 - arcAng
        }
        return arcAng
    }

    const centerValues = getCenterValues(getCenterAxes(mainAxes), row)

    let startAng = Math.atan2(state.prevPosition[mainAxes[1]] - centerValues[mainAxes[1]],
        state.prevPosition[mainAxes[0]] - centerValues[mainAxes[0]]) / Math.PI * 180

    let endAng = Math.atan2(targetPos[mainAxes[1]] - centerValues[mainAxes[1]],
        targetPos[mainAxes[0]] - centerValues[mainAxes[0]]) / Math.PI * 180

    if (startAng < 0) {
        startAng += 360
    }
    if (endAng < 0) {
        endAng += 360
    }

    let circleDirection
    if (row.match(/(?<=\S|^)G[23]/)) {
        circleDirection = row.match(/(?<=\S|^)G[23]/)[0]
    } else {
        circleDirection = state.moveGroup
    }

    let resultAng
    if (circleDirection === 'G3') {
        resultAng = (endAng - startAng)
    } else {
        resultAng = (startAng - endAng)
    }
    if (resultAng < 0) {
        resultAng += 360
    }

    return resultAng
}

const getDistance = (targetPos, state) => {
    return Math.sqrt(getMainAxes(state.plane)
        .map(axis => {
            return (targetPos[axis] - state.prevPosition[axis]) ** 2
        }).reduce((sum, current) => {
            return sum + current
        })
    )
}

export const getCenterAxes = (axes) => {
    return [['X', 'I'], ['Y', 'J'], ['Z', 'K']]
        .filter(arr => axes.includes(arr[0]))
        .map(arr => arr[1])
}

const getCenterValues = (axes, row) => {
    return Object.fromEntries(row.split(' ')
        .filter(operator => {
            const regex = new RegExp(`(?<=^)[${axes[0]}${axes[1]}](?=\=)`)
            return operator.match(regex)
        }).flatMap(str => {
            const axis = str.substring(0, 1)
            const congruentAxis = getCongruentAxis(axis)
            const value = str.substring(str.indexOf('AC(') + 3, str.length - 1)
            return [[axis, value], [congruentAxis, value]]
        }))
}

const getCongruentAxis = (axis) => {
    const mainAxes = ['X', 'Y', 'Z']
    const centerAxes = ['I', 'J', 'K']
    if (mainAxes.some(mAx => mAx === axis)) {
        return centerAxes[mainAxes.findIndex(el => el === axis)]
    }
    if (centerAxes.some(mAx => mAx === axis)) {
        return mainAxes[centerAxes.findIndex(el => el === axis)]
    }
}

const getApplicateAxis = (plane) => {
    return {G17: 'Z', G18: 'Y', G19: 'X'}[plane]
}

export const getMainAxes = (plane) => {
    if (plane === 'G17') {
        return ['X', 'Y']
    }
    if (plane === 'G18') {
        return ['Z', 'X']
    }
    if (plane === 'G19') {
        return ['Y', 'Z']
    }
}

const getTargetPosition = (row) => {
    return Object.fromEntries(
        row.split(' ')
            .filter(operator => {
                return operator.match(/(?<=^)[XYZ](?=\S|=)/)
            })
            .map(axisValue => {
                let valueIndex = 1
                if (axisValue.match('=')) {
                    valueIndex = 2
                }
                return [axisValue.substring(0, 1), axisValue.substring(valueIndex)]
            })
    )
}
