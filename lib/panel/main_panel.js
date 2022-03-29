'use babel';

import {footer} from "./footer";
import View from '../sinumerik-to-nc'
import {save_settings} from "../settings/settings";


export default function panel() {
    //Панель
    const panel = create_element(['stnc_main_panel'])

    //region Resize panel functions
    //боковая планка для изменения размера
    let resizer = create_element(
        ['stnc_panel_resize'],
        panel)
    resizer.addEventListener('mousedown', (e) => {
        initDrag(e)
    })

    let startX, startWidth;

    function initDrag(e) {
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(e) {
        panel.style.width = (startWidth - e.clientX + startX) + 'px';
    }

    function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
    //endregion

    const container = create_element(['stnc_panel_container'], panel)

    panel.header = create_element(['stnc_panel','stnc_header'], container,'Sinumerik to ')
    panel.header_select = create_element(['stnc_header-select'], panel.header, '', 'select')
    panel.header_select.nc = create_element(['stnc_header-select'], panel.header_select, 'NC', 'option')
    panel.header_select.fanuc = create_element(['stnc_header-select'], panel.header_select, 'FANUC_31i_lathe', 'option')
    panel.header_select.addEventListener('change', event => {
        let editor = atom.workspace.getActiveTextEditor()
        View.sinumerikToNcView.setState({text: editor.getText()})
        View.sinumerikToNcView.settings.saved_parser = event.target.value
        save_settings()
    });

    panel.body = create_element(['stnc_panel','stnc_body'],  container)
    panel.ul = create_element(['stnc_ul'], panel.body,'','ul')
    panel.footer = footer(container)

    return panel
}

export function create_element(classes, parent, text, tag) {
    if (!tag) {
        tag = 'div'
    }
    let element = document.createElement(tag)
    classes.forEach(single_class => {
        element.classList.add(single_class)
    })
    if (text && text.length > 0) {
        element.innerText = text
    }
    if (parent) {
        parent.appendChild(element)
    }
    return element
}

