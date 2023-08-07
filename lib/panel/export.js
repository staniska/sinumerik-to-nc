'use babel'

import App from "../sinumerik-to-nc";
import {exporter_select} from "./exporter_select";

const fs = require('fs')
const {dialog} = require('electron').remote

export function exportText() {
    let {exporter} = exporter_select(App.sinumerikToNcView.element.header_select.value)

    let path
    try {
        path = dialog.showSaveDialogSync({});
    } catch (e) {
        path = dialog.showSaveDialog({});
    }

    if (!path) {
        return
    }

    fs.writeFile(path, exporter(App.sinumerikToNcView.parsedText, path), err => {
        if (err) {
            console.error(err)
        }
    })
}