'use babel'
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
        W: undefined
    }

    state.plane = 'G17'

    state.sinumerikHighlightView = atom.packages.getActivePackage('sinumerik-highlight')

    if (state.sinumerikHighlightView) {
        state.sinumerikHighlightView = state.sinumerikHighlightView.mainModule.sinumerikView
    } else {
        atom.packages.onDidActivatePackage(pack => {
            if (pack.name === 'sinumerik-highlight') {
                state.sinumerikHighlightView = pack.mainModule.sinumerikView
            }
        })
    }

    if (state.sinumerikHighlightView) {
        state.plane = state.sinumerikHighlightView
            .programmData[atom.workspace.getActiveTextEditor().getTitle().replace(/\./g,'_').toUpperCase()]
            .machine.machineType === 'Mill' ?
            'G17' : 'G18'
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
            add_endif: () => {
                state.parse.replaced.endif++
                return state.parse.replaced.endif
            },
            sub_endif: () => {
                state.parse.replaced.endif--
                // return state.parse.replaced.endif
            }
        }
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