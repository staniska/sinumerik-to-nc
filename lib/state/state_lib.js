'use babel'
import {find_if} from "./find_if";

export function lib(state) {
    state.find_endif = find_if
    state.vars = {
        used: [],
        temp: []
    }
    //TODO сделать функции гетТемп и  очистки темпов

    state.vars.getTemp = () => {
        console.log('JOPA!!!')
        console.log(this)
    }
    return state
}