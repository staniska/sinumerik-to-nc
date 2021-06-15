'use babel'

import {sinumerik_maths} from "../sinumerik/replacers";
import {state} from "../../panel/body";


export function replace_math(string) {

}

export function check_math(string) {
    //TODO помимо -+ обрабатывать sinumerik_maths и создать аналогичный массив для NC для замещений
    if (string.match(/[+\-*\/]/)) {
        return 'MATH!!!'
    }

    //TODO отдавать имя временной переменной и строчку с присвоением ей в additions
    return 0
}

export function check_var(string) {
    state.vars.getTemp()
    //TODO отдавать замененное имя переменной
    if (string.match(/R[0-9]+/) && string.match(/R[0-9]+/)[0] === string) {
        return 'VAR!!!'
    }
    return 0
}

