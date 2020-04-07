import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';

import ConfirmDialog from './ConfirmDialog';
import DataErrorAlert from './DataErrorAlert';
import EditEntry from './EditEntry';

import { ViewCards } from './ViewCards';
import ViewStudyMode from './ViewStudyMode'

const initialState = {
  text: '',
  entries: [],
  parseError: false,
  editCardMode: false,
  show: false,
  flip: false,
  studyFlip: false,
  studyShow: false,
  studyCardID: 0,
  viewMode: true,
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
      editCardMode: !this.state.editCardMode,
      editEntry: null
    });
  };

  onEdit = id => {
    this.setState(state => ({
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

  onFlip = () => {
    this.setState({
      flip: !this.state.flip,
      studyFlip: false,
      studyShow: false,
      viewMode: true,
      editCardMode: false,
      editEntry: null
    });
  };

  onShow = () => {
    this.setState({
      show: !this.state.show,
      studyFlip: false,
      studyShow: false,
      viewMode: true,
      editCardMode: false,
      editEntry: null
    });
  };
  onStudyFlip = () => {
    // if studyFlip is turned on, then turn it off and turn on viewMode
    if (this.state.studyFlip) {
      this.setState({
        studyFlip: false,
        studyShow: false,
        viewMode: true,
        editCardMode: false,
        editEntry: null
      });
    }
    // if studyFlip is turned off, then turn it on and turn off viewMode
    else if (!this.state.studyFlip) {
      this.setState({
        studyFlip: true,
        studyShow: false,
        viewMode: false,
        editCardMode: false,
        editEntry: null
      });
    }
  };

  onStudyShow = () => {
    // if studyShow is turned on, then turn it off and turn on viewMode
    if (this.state.studyShow) {
      this.setState({
        studyFlip: false,
        studyShow: false,
        viewMode: true, 
        editCardMode: false,
        editEntry: null
      });
    }
    // if studyShow is turned off, then turn it on and turn off viewMode
    else if (!this.state.studyShow) {
      this.setState({
        studyFlip: false,
        studyShow: true,
        viewMode: false,
        editCardMode: false,
        editEntry: null
      });
    }
  };

  onNextCard = () => {
    var newID = this.state.studyCardID + 1
    this.setState({
    studyCardID: newID,
    });
  }

  // check if each card is hidden or shown (doesn't work yet)
  checkHideMode = () => {
    if (this.state.show) {
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
              <div className="sk-label" onClick={this.onStudyFlip}> Study Flip </div>
            </div>
            <div className="sk-button info">
              <div className="sk-label" onClick={this.onStudyShow}> Study Show </div>
            </div>
            <div className="sk-button info">
              {!this.state.flip && ( // if show mode is false
                <div className="sk-label" onClick={this.onFlip}>Flip All</div>
              )}
              {this.state.flip && ( // if  show mode is true 
                <div className="sk-label" onClick={this.onFlip}>Flip Back All</div>
              )}
            </div>
            <div className="sk-button info">
              {!this.state.show && ( // if show mode is false
                <div className="sk-label" onClick={this.onShow}>Show All</div>
              )}
              {this.state.show && ( // if  show mode is true 
                <div className="sk-label" onClick={this.onShow}>Hide All</div>
              )}
            </div>
            <div className="sk-button info" onClick={this.onAddNew}>
              <div className="sk-label">Add New</div>
            </div>
            <div className="sk-button info">
              <div className="sk-label">Settings</div>
            </div>
          </div>
        </div>

        <div id="content">
        {this.state.studyFlip && !this.state.editCardMode && ( // if show mode is on and flip mode is off
            <ViewStudyMode
              id={this.state.studyCardID}
              onNextCard={this.onNextCard}
              flip={this.state.flip}
              show={this.state.show}
              studyFlip={this.state.studyFlip}
              studyShow={this.state.studyShow}
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {this.state.studyShow && !this.state.editCardMode && ( // if show mode is on and flip mode is off
            <ViewStudyMode
              id={this.state.studyCardID}
              onNextCard={this.onNextCard}
              flip={this.state.flip}
              show={this.state.show}
              studyFlip={this.state.studyFlip}
              studyShow={this.state.studyShow}
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {this.state.show && !this.state.flip && !this.state.editCardMode && this.state.viewMode && ( // if show mode is on and flip mode is off
            <ViewCards
              flip={this.state.flip}
              show={this.state.show}
              studyFlip={this.state.studyFlip}
              studyShow={this.state.studyShow}
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {this.state.show && this.state.flip && !this.state.editCardMode && this.state.viewMode &&( // if show mode is on and flip mode is on
            <ViewCards
              flip={this.state.flip}
              show={this.state.show}
              studyFlip={this.state.studyFlip}
              studyShow={this.state.studyShow}
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {!this.state.show && !this.state.flip && !this.state.editCardMode && this.state.viewMode &&( // if show mode is off and flip mode is off
            <ViewCards
              flip={this.state.flip}
              show={this.state.show}
              studyFlip={this.state.studyFlip}
              studyShow={this.state.studyShow}
              entries={this.state.entries}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          )}
          {!this.state.show && this.state.flip && !this.state.editCardMode && this.state.viewMode &&( // if show mode is off and flip mode is on 
            <ViewCards
              flip={this.state.flip}
              show={this.state.show}
              studyFlip={this.state.studyFlip}
              studyShow={this.state.studyShow}
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
