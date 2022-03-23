'use babel';

import panel from "./panel/main_panel";
import {change_text} from "./panel/body";
import {load_settings} from "./settings/settings";

export default class SinumerikToNcView {

    constructor(serializedState) {
        // Create root element
        this.state = {text: 'jopa'}
        this.element = panel();
        this.element.classList.add('sinumerik-to-nc');
        this.loadSettings()
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {
    }

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    loadSettings() {
        load_settings()
            .then((data) => {
                this.settings = data
                const {saved_parser} = this.settings
                Array.from(this.element.header_select.querySelectorAll('option')).forEach(option => {
                    if (option.innerText === saved_parser) {
                        option.selected = true;
                    }
                })
            })
            .then(() => {
                const Change = new Event('change')
                this.element.header_select.dispatchEvent(Change)
            })
    }

    getState() {
        return this.state;
    }

    setState(stateObj) {
        this.state = {...this.state, ...stateObj}
        change_text()
    }
}
