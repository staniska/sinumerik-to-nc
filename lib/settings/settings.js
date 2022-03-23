'use babel'

import View from '../sinumerik-to-nc'

const fs = require('fs')
const fsPromises = fs.promises;


const dirPath = atom.packages.getPackageDirPaths()[0] + '/sinumerik-to-nc/userData'
const settingsPath = dirPath + '/settings.json';
const emptySettings = {
    saved_parser: 'FANUC_31i_lathe'
}


export const load_settings = () => {
    return fsPromises
        .readFile(settingsPath, 'utf8')
        .then(data => {
            return JSON.parse(data)
        })
        .catch(err => {
            console.log(err)
            return emptySettings
        })
}

export const save_settings = () => {

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
    }

    fsPromises
        .writeFile(settingsPath, JSON.stringify(View.sinumerikToNcView.settings))
        .catch(e => {
            console.log(e)
        })
}

