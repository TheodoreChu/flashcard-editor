import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';

import ConfirmDialog from './ConfirmDialog';
import DataErrorAlert from './DataErrorAlert';
import EditEntry from './EditEntry';

import ViewPartCards from './ViewPartCards';
import ViewFullCards from './ViewFullCards';
import StudyShowMode from './StudyShowMode';
import StudyFlipMode from './StudyFlipMode';

const initialState = {
  text: '',
  entries: [],
  parseError: false,
  editCardMode: false,
  hideMode: false,
  studyFlipMode: false,
  studyShowMode: false,
  editEntry: null,
  confirmRemove: false
};

export default class Flashcards extends React.Component {
  constructor(props) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  configureEditorKit() {
    let delegate = new EditorKitDelegate({
      setEditorRawText: text => {
        let parseError = false;
        let entries = [];

        if (text) {
          try {
            entries = JSON.parse(text);
          } catch (e) {
            // Couldn't parse the content
            parseError = true;
            this.setState({
              parseError: true
            });
          }
        }

        this.setState({
          ...initialState,
          text,
          parseError,
          entries
        });
      },
      generateCustomPreview: text => {
        let entries = [];
        try {
          entries = JSON.parse(text);
        } finally {
          return {
            html: `<div><strong>${entries.length}</strong> Flashcards </div>`,
            plain: `${entries.length} Flashcards`,
          };
        }
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => []
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'json',
      supportsFilesafe: false
    });
  }

  saveNote(entries) {
    this.editorKit.onEditorValueChanged(JSON.stringify(entries, null, 2));
  }

  // Entry operations
  addEntry = entry => {
    this.setState(state => {
      const entries = state.entries.concat([entry]);
      this.saveNote(entries);

      return {
        editCardMode: false,
        hideMode: false,
        editEntry: null,
        entries
      };
    });
  };

  editEntry = ({ id, entry }) => {
    this.setState(state => {
      const entries = update(state.entries, { [id]: { $set: entry } });
      this.saveNote(entries);

      return {
        editCardMode: false,
        hideMode: false,
        editEntry: null,
        entries
      };
    });
  };

  removeEntry = id => {
    this.setState(state => {
      const entries = update(state.entries, { $splice: [[id, 1]] });
      this.saveNote(entries);

      return {
        confirmRemove: false,
        editEntry: null,
        entries
      };
    });
  };

  // Event Handlers
  onAddNew = () => {
    this.setState({
      hideMode: false,
      editCardMode: true,
      editEntry: null
    });
  };

  onEdit = id => {
    this.setState(state => ({
      hideMode: false,
      editCardMode: true,
      editEntry: {
        id,
        entry: state.entries[id]
      }
    }));
  };

  onCancel = () => {
    this.setState({
      confirmRemove: false,
      editCardMode: false,
      editEntry: null
    });
  };

  onRemove = id => {
    this.setState(state => ({
      confirmRemove: true,
      editEntry: {
        id,
        entry: state.entries[id]
      }
    }));
  };

  onSave = ({ id, entry }) => {
    // If there's no ID it's a new note
    if (id != null) {
      this.editEntry({ id, entry });
    } else {
      this.addEntry(entry);
    }
  };

  onhideMode = () => {
    if (this.state.hideMode) {
      this.setState({
        hideMode: false,
        editCardMode: false,
        editEntry: null
      });
    }
    else {
      this.setState({
        hideMode: true,
        editCardMode: false,
        editEntry: null
      });
    }
  };

  // check if each card is hidden or shown (doesn't work yet)
  checkHideMode = () => {
    if (this.state.hideMode) {
      state.entries.forEach((entry) => 
        {return true})
    }
  }

  render() {
    const editEntry = this.state.editEntry || {};
    return (
      <div className="sn-component">
        {this.state.parseError && <DataErrorAlert />}
        <div id="header">
          <div className="sk-button-group">
          <div className="sk-button info">
              <div className="sk-label"> Flip Mode</div>
            </div>
            <div className="sk-button info">
              <div className="sk-label"> Show Mode</div>
            </div>
            <div className="sk-button info">
              {this.state.hideMode && (
                <div onClick={this.onhideMode} className="sk-label">Show All</div>
              )}
              {!this.state.hideMode && (
                <div onClick={this.onhideMode} className="sk-label">Hide All</div>
              )}
            </div>
            <div onClick={this.onAddNew} className="sk-button info">
              <div className="sk-label">Add New</div>
            </div>
            <div className="sk-button info">
              <div className="sk-label">Settings</div>
            </div>
          </div>
        </div>

        <div id="content">
          {this.state.studyFlipMode && ( // if study Flip Mode is on
            <StudyFlipMode
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {this.state.studyFlipMode && ( // if study Show Mode is on
            <StudyShowMode
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {this.state.hideMode && ( // if hide mode is on
            <ViewPartCards
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {!this.state.hideMode && !this.state.editCardMode && ( // if hide mode is off and edit mode if off
            <ViewFullCards
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {this.state.editCardMode && (
            <EditEntry
              id={editEntry.id}
              entry={editEntry.entry}
              onSave={this.onSave}
              onCancel={this.onCancel}
            />
          )}
          {this.state.confirmRemove && (
            <ConfirmDialog
              title={`Remove ${editEntry.entry.front}`}
              message="Are you sure you want to remove this card?"
              onConfirm={() => this.removeEntry(editEntry.id)}
              onCancel={this.onCancel}
            />
          )}
        </div>
      </div>
    );
  }
}
