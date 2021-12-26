'use babel'

import App from "../sinumerik-to-nc";
import {parse} from "../parser/parser";
import {select_parser} from "../parser/parser_select";
import {lib} from "../state/state_lib";

export let state

export function change_text() {
    state = lib(App.sinumerikToNcView.state)

    //Чтение выбранного языка и сборка парсера
    let parser = select_parser(App.sinumerikToNcView.element.header_select.value)

    const ul = App.sinumerikToNcView.element.ul
    App.sinumerikToNcView.parsedText = ''

    while (ul.lastChild) {
        ul.removeChild(ul.lastChild)
    }

    if (state.text.match('\nM30')) {
        state.text = state.text.substr(0, state.text.match('\nM30').index + 5)
    }

    state.text = state.text.split('\n').map((string) => {
        return string.trim()
    })

    state.text.forEach((row, index) => {
        state.parse.row_num = index
        let parse_resp = parse(row, index, parser)
        state.updatePosition()
        ul.appendChild(parse_resp.div)
        parse_resp.text_rows.forEach(row => {
            App.sinumerikToNcView.parsedText += row + '\n'
        })
        if (!row.length) {
            App.sinumerikToNcView.parsedText += '\n'
        }
   })
}

export function change_position() {
    // console.log('change_position')
}