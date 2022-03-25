'use babel'

const fs = require('fs')

import {find_if} from "./find_if";

class CStateArray extends Array {
    push(element) {
        if (!this.find(el => {
            return el === element
        })) {
            Array.prototype.push.call(this, element)
        }
    }
}

export function lib(state) {

    const Editor = atom.workspace.getActiveTextEditor()
    const fileName = Editor.getTitle().replace('.', '_').toUpperCase()
    const filePath = Editor.getPath()
    let dirPathSlicer = '/';
    if (filePath[1] === ':') {
        dirPathSlicer = '\\';
    }
    const dirPath = filePath.slice(0, filePath.lastIndexOf(dirPathSlicer));


    state.find_endif = find_if
    state.vars = {
        used: new CStateArray(),
        temp: []
    }

    state.prevPosition = {
        X: undefined,
        Y: undefined,
        Z: undefined,
        A: undefined,
        B: undefined,
        C: undefined,
        W: undefined,
    }

    state.targetPosition = {}

    state.updatePosition = () => {
        if (!Object.keys(state.targetPosition).length) return

        state.prevPosition = {...state.prevPosition, ...state.targetPosition}
        state.targetPosition = {}
    }

    state.wcs_point = 1

    state.moveGroup = 'G0'

    state.plane = 'G17'

    state.sinumerikHighlightView = atom.packages.getActivePackage('sinumerik-highlight')

    if (state.waitForSinumerikHighlightActivate === undefined) {
        state.waitForSinumerikHighlightActivate = 0
    }

    if (state.sinumerikHighlightView) {
        state.sinumerikHighlightView = state.sinumerikHighlightView.mainModule.sinumerikView
        if (state.waitForSinumerikHighlightActivate) {
            state.waitForSinumerikHighlightActivate.dispose()
            state.waitForSinumerikHighlightActivate = 0
            console.log('sinumerik-highlight disposed')
        }
    } else {
        if (!state.waitForSinumerikHighlightActivate) {
            state.waitForSinumerikHighlightActivate = atom.packages.onDidActivatePackage(pack => {
                if (pack.name === 'sinumerik-highlight') {
                    state.sinumerikHighlightView = pack.mainModule.sinumerikView
                    //Crutch for sinumerik-highlight collect data
                    setTimeout(() => {
                        get_programData(state, fileName)
                        find_machine_subroutines(state, dirPathSlicer)
                    }, 1000)
                }
            })
        }
    }

    if (state.sinumerikHighlightView) {
        state.plane = state.sinumerikHighlightView
            .programmData[atom.workspace.getActiveTextEditor().getTitle().replace(/\./g, '_').toUpperCase()]
            .machine.machineType === 'Mill' ?
            'G17' : 'G18'
    }

    get_programData(state, fileName)

    if (!state.subroutines) {
        state.subroutines = new CSubroutinesArray()

        find_local_subroutines(state, dirPath, fileName)
        find_machine_subroutines(state, dirPathSlicer)
        atom.workspace.onDidChangeActiveTextEditor(() => {
            state.subroutines.clear()
            find_local_subroutines(state, dirPath, fileName)
            find_machine_subroutines(state, dirPathSlicer)
        })
    }

    state.vars.getTemp = () => {
        let resp_num = 1
        while (state.vars.used.includes(resp_num) || state.vars.temp.includes(resp_num)) {
            resp_num++
        }
        state.vars.temp.push(resp_num)
        return resp_num
    }

    state.vars.clearTemp = () => {
        while (state.vars.temp.length) {
            state.vars.temp.shift()
        }
    }

    state.parse = {
        row_num: 0,
        replaced: {
            endif: 0,
            targets: [],
            getTargetLine: (targetName) => {
                const targets = state.parse.replaced.targets
                const resp = {
                    line_num: 0,
                    errors: []
                }
                const saved_target = targets.filter(target => target.name === targetName)
                if (saved_target.length) {
                    resp.line_num = saved_target[0].lineNum
                    resp.errors = saved_target[0].errors
                } else {
                    const newTarget = {
                        name: targetName,
                        lineNum: 400 + targets.length + 1,
                        errors: state.parse.findTargetRowNum(targetName)
                    }
                    targets.push(newTarget)
                    resp.line_num = newTarget.lineNum
                    resp.errors = newTarget.errors
                }
                return resp
            },
            add_endif: () => {
                state.parse.replaced.endif++
                return state.parse.replaced.endif
            },
        }
    }

    state.parse.findTargetRowNum = (target) => {

        const errors = []
        const targetRowNums = state.text.map((row, idx) => {
            return {
                text: row,
                idx
            }
        }).filter(row => {
            return row.text === target + ':'
        })

        if (targetRowNums.length === 0) {
            errors.push(11)
        }

        if (targetRowNums.length > 1) {
            errors.push(12)
        }

        return errors
    }

    state.parse.find_endif = () => {
        let level = 0;
        let endif_row = 0;
        let row = state.parse.row_num + 1
        while (!endif_row && row < state.text.length) {
            if (state.text[row] === 'ENDIF' && level === 0) {
                endif_row = row
            }
            if (state.text[row].match(/^(IF)/)) {
                level++
            }
            if (state.text[row].match(/^(ENDIF)/)) {
                level--
            }
            row++
        }
        return endif_row
    }

    state.parse.find_else = () => {
        let level = 0;
        let else_row = 0;
        let row = state.parse.row_num + 1
        while (!else_row && row < state.text.length) {
            if (state.text[row] === 'ELSE' && level === 0) {
                else_row = row
            }
            if (state.text[row].match(/^(IF)/)) {
                level++
            }
            if (state.text[row].match(/^(ENDIF)/)) {
                level--
            }
            row++
        }
        return else_row
    }

    return state
}

const find_local_subroutines = (state, dirPath, fileName) => {
    const files = fs.readdirSync(dirPath).map(file => {
        return file.replace(/\./g, '_').toUpperCase()
    })
    state.subroutines.push(...files
        .filter(file => {
            return file.substring(file.length - 3).match(/[MS]PF/)
        })
        .filter(file => {
            return file.replace(/\./g,'_').toUpperCase() !== fileName
        })
        .map(file => {
            return {
                type: 'local',
                name: file
            }
        })
    )
}

const find_machine_subroutines = (state, dirPathSlicer) => {
    if (!state.programData) return
    try {
        state.subroutines.push(
            ...state.sinumerikHighlightView.machineData.subroutines[state.programData.machine.machineName]
                .map(path => {
                    return fs.readdirSync(path)
                        .filter(file => file.toUpperCase().match(/SPF/))
                        .map(subroutine => {
                            return {
                                type: 'cycle',
                                name: subroutine.replace(/\./g,'_').toUpperCase(),
                                replacements: [
                                    fs.readFileSync(path + dirPathSlicer + subroutine, 'utf8')
                                        .split('\n')
                                        .filter(str => {
                                            return str.substring(0, 17) === ';stnc_replacement'
                                        })
                                        .map(replacement => {
                                            return JSON.parse(replacement.substring(18).trim())
                                        })
                                ]
                            }
                        })
                })
                .flat()
        )
    } catch (e) {
        console.log('Error getting machine subroutines')
    }
}

const get_programData = (state, fileName) => {
    state.fanuc_type = null
    if (state.sinumerikHighlightView) {
        if (state.sinumerikHighlightView.programmData && state.sinumerikHighlightView.programmData[fileName]) {
            state.programData = state.sinumerikHighlightView.programmData[fileName]
            if (state.programData.machine && state.programData.machine.cnc) {
                if (state.programData.machine.cnc.substring(0,5) === 'FANUC') {
                    state.fanuc_type =
                        state.programData.machine.cnc.substring(
                            state.programData.machine.cnc.indexOf('(') + 1,
                            state.programData.machine.cnc.lastIndexOf(')'),
                        )
                }
            }
        }
    }
}


class CSubroutinesArray extends Array {
    push(element, ...elements) {
        const allElements = [element]
        if (elements.length) {
            allElements.push(...elements)
        }
        allElements.forEach(newEl => {
            if (this.find(el => el.name === newEl.name)) {
                return null
            }
            Array.prototype.push.call(this, newEl)
        })
    }

    clear() {
        while (this.length) {
            this.pop()
        }
    }
}
