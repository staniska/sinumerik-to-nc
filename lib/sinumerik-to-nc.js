'use babel';

import SinumerikToNcView from './sinumerik-to-nc-view';
import { CompositeDisposable } from 'atom';
import { change_position } from "./panel/body";

export default {

  sinumerikToNcView: null,
  rightPanel: null,
  subscriptions: null,

  activate(state) {
    this.sinumerikToNcView = new SinumerikToNcView(state.sinumerikToNcViewState);
    this.rightPanel = atom.workspace.addRightPanel({
      item: this.sinumerikToNcView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sinumerik-to-nc:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.rightPanel.destroy();
    this.subscriptions.dispose();
    this.sinumerikToNcView.destroy();
  },

  serialize() {
    return {
      sinumerikToNcViewState: this.sinumerikToNcView.serialize()
    };
  },

  toggle() {
    if (this.rightPanel.isVisible()) {

      return this.rightPanel.hide()
    } else {
      let editor = atom.workspace.getActiveTextEditor()
      editor.onDidStopChanging(() => {
        this.sinumerikToNcView.setState({text: editor.getText()})
      })

      //Тут мы собирались сделать функцию перемотки и все такое
      // editor.onDidChangeCursorPosition(() => {
      //   change_position()
      // })
      this.sinumerikToNcView.setState({text: editor.getText()})
      return this.rightPanel.show()
    }
  }

};
