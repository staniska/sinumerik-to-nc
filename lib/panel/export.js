'use babel'

import App from "../sinumerik-to-nc";
import {exporter_select} from "./exporter_select";

const fs = require('fs')
const {dialog} = require('electron').remote

export function exportText() {
    let {exporter} = exporter_select(App.sinumerikToNcView.element.header_select.value)

    try {
        dialog.showSaveDialog({})
            .then(result => {
                if (!result.canceled && result.filePath.length) {
                    fs.writeFile(result.filePath, exporter(App.sinumerikToNcView.parsedText, result.filePath), err => {
                        if (err) {
                            console.error(err)
                        }
                    })
                }
            }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e);
    }
}