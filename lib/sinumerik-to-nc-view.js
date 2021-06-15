'use babel';

import panel from "./panel/main_panel";
import {change_text} from "./panel/body";

export default class SinumerikToNcView {

  constructor(serializedState) {
    // Create root element
    this.state = {text: 'jopa'}
    this.element = panel();
    this.element.classList.add('sinumerik-to-nc');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getState() {
    return this.state;
  }
  setState(stateObj) {
    this.state = {...this.state, ...stateObj}
    change_text()
  }
}
