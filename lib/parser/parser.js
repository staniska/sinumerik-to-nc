'use babel'

import {errors} from "./errors/list";
import {state} from "../panel/body";
import {create_element} from "../panel/main_panel";
import App from "../sinumerik-to-nc";

export function parse(row, index, parser) {

    let resp_row = document.createElement('li')
    resp_row.className = 'stnc_li'

    resp_row.id = index

    resp_row.text = document.createElement('div')
    resp_row.text.innerText = row ? row : '\n'
    resp_row.appendChild(resp_row.text)

    let row_data = {rows: []}
    if (row.length) {
        resp_row.text.classList.add('stnc_li_text_with_details')
        let onClickHandler = onClick.bind(resp_row)
        resp_row.text.addEventListener('click', function () {
            onClickHandler()
        })

        // resp_row.title = row
        row_data = rowParse(row, parser, resp_row)

        if (row_data.inform) {
            resp_row.classList.add('stnc_li__info')
        }

        if (row_data.err) {
            resp_row.classList.add('stnc_li__error')
        }

        // Вставка элементов в li

        if (row_data.rows) {
            resp_row.text.innerText = ''
            row_data.rows.forEach(row => {
                let row_text = document.createElement('div')
                row_text.innerText = row
                resp_row.text.appendChild(row_text)
            })
        }

        resp_row.details = document.createElement('details')
        resp_row.details.className = 'stnc_details'
        resp_row.details.appendChild(row_data.list)
        resp_row.details.summary = document.createElement('summary')
        resp_row.details.appendChild(resp_row.details.summary)

        resp_row.appendChild(resp_row.details)
    }
    return {div: resp_row, text_rows: row_data.rows}
}

function rowParse(row, parser) {
    let resp_list = document.createElement('div')
    let resp_rows = []
    let err = 0
    let info = 0
    resp_list.className = 'stnc_details-block'

    //Comment
    let comment = null
    if (row.match(';')) {
        let row_with_comment = row.split(';')
        row = row_with_comment[0]
        comment = parser.comment.prefix + row_with_comment[1] + parser.comment.postfix
        if (parser.comment.separation) {
            resp_rows.push(comment)
            comment = null
        }
    }
    if (!row.length && !!comment) {
        return {list: resp_list, rows: [comment]}
    }
    if (!row.length) {
        return {list: resp_list, rows: resp_rows}
    }

    //Первая пустая строка
    resp_rows.push('')

    let split_row = row.trim().replace(/\s+/, ' ').split(' ')

    //Конструкция try-catch только для прерывания forEach
    try {
        split_row.forEach((operator, idx) => {
            let operator_block = document.createElement('div')
            operator_block.className = 'stnc_operator-block'
            operator_block.data = parser.operatorParse(operator, row)

            if (operator_block.data.place === 'line') {
                resp_rows[resp_rows.length - 1] += operator_block.data.operator + ' '
            }

            // Исходный оператор
            operator_block.origin = document.createElement('div')
            operator_block.origin.className = 'stnc_operator-block__origin-operator'
            operator_block.origin.innerText = operator
            operator_block.appendChild(operator_block.origin)

            // Стрелочка вправо
            operator_block.rarr = document.createElement('div')
            operator_block.rarr.className = 'icon-arrow-right stnc_operator-block__origin-operator'
            operator_block.appendChild(operator_block.rarr)

            // Преобразованный оператор
            operator_block.received = document.createElement('div')
            operator_block.received.className = 'stnc_operator-block__received-operator'
            operator_block.received.innerText = operator_block.data.operator
            operator_block.appendChild(operator_block.received)

            // Добавленные строчки
            if (operator_block.data.additions.length) {
                operator_block.additions = create_element(["stnc_operator-block__received-additions"], operator_block, '', 'ul')
                operator_block.additions.data = []
                operator_block.data.additions
                    .forEach((addition, idx) => {
                            operator_block.additions.data[idx] =
                                create_element(
                                    ["stnc_operator-block__received-additions"],
                                    operator_block.additions,
                                    addition,
                                    'li')
                        }
                    )
                operator_block.data.additions.reverse().forEach(addition => {
                        resp_rows.unshift(addition)
                    }
                )
            }

            if (operator_block.data.info.length) {
                operator_block.info = create_element(["stnc_operator-block__received-info"], operator_block, '', 'ul')
                operator_block.info.data = []
                operator_block.data.info
                    .forEach((info, idx) => {
                            operator_block.info.data[idx] =
                                create_element(
                                    ["stnc_operator-block__received-info"],
                                    operator_block.info,
                                    info,
                                    'li')
                        }
                    )
                info = 1
            }

            //Ошибки
            operator_block.errors = document.createElement('ul')
            operator_block.errors.className = 'stnc_operator-block__errors'
            if (operator_block.data.errors.length) {
                err = 1
            }
            operator_block.data.errors.forEach(error => {
                let err_text = errors[error]
                let err_li = document.createElement('li')
                err_li.innerText = err_text
                operator_block.errors.appendChild(err_li)
            })
            operator_block.appendChild(operator_block.errors)

            resp_list.appendChild(operator_block)
            if (operator_block.data.row_parsed) {
                throw (new Error('Строка полностью разобрана'))
            }
        })
    } catch (e) {
        if (e.message.match('Строка полностью разобрана')) {
            // console.log('Строка полностью разобрана')
        } else {
            console.log(e)

        }
    }

    if (comment) {
        resp_rows[0] += ' ' + comment
    }

    state.vars.clearTemp()

    return {list: resp_list, rows: resp_rows, err: err, inform: info}
}

function onClick() {
    this.details.open = !this.details.open
    let opened_li = document.getElementsByClassName('stnc_li_open')
    while (opened_li.length) {
        opened_li[0].details.open = false
        opened_li[0].classList.remove('stnc_li_open')
        let opened_details = document.getElementsByClassName('stnc_details_open')
        while (opened_details.length) {
            opened_details[0].classList.remove('stnc_details_open')
        }
    }
    if (this.details.open) {
        this.classList.add("stnc_li_open")
        this.details.classList.add("stnc_details_open")
    } else {
        this.classList.remove("stnc_li_open")
        this.details.classList.remove("stnc_details_open")
    }
}