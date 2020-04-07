import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';

import ConfirmDialog from './ConfirmDialog';
import DataErrorAlert from './DataErrorAlert';
import EditEntry from './EditEntry';

import { ViewCards } from './ViewCards';
import ViewStudyMode from './ViewStudyMode';
import HeaderMenu from './HeaderMenu';

const initialState = {
  text: '',
  entries: [],
  parseError: false,
  editCardMode: false,
  show: false,
  flip: false,
  studyFlip: false,
  studyShow: false,
  studyCardList: [], //list of IDS
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

  /*cardsList = () => {
    let cardsList = this.state.entries.filter(entry => this.state.entries.indexOf(entry) > 0);
    this.setState({
      studyCards: cardsList
    })
  }*/

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

  // shuffle cards with the Fisher-Yates (aka Knuth) Shuffle. See http://bost.ocks.org/mike/shuffle/
  shuffleCards = () => {
    var currentIndex = this.state.entries.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = this.state.entries[currentIndex];
      this.state.entries[currentIndex] = this.state.entries[randomIndex];
      this.state.entries[randomIndex] = temporaryValue;
      this.editEntry({ randomIndex, temporaryValue });
    }
  }

  randomizeStudyList = () => {
    this.onFlip;/*
    var temporaryList = Array.from(Array(this.state.entries.length - 1).keys())
    var currentIndex = temporaryList.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = temporaryList[currentIndex];
      temporaryList[currentIndex] = temporaryList[randomIndex];
      temporaryList[randomIndex] = temporaryValue;

      // add the swap to the state
      //temporaryList.push(this.state.entries[randomIndex].id)
    }
    this.setState({
      studyCardList: temporaryList
    })
    */
  }

  onNextCard = () => {
    const newID = this.state.studyCardID + 1
  //  this.setState({
 //     studyCardID: newID
  //  })
    // the last ID should be one less than the length because IDs start at zero
    // if the id is one less than the length, then start over with a randomized list
    if (this.state.studyCardID == this.state.entries.length - 1 ) { 
      //this.randomizeStudyList;
      //const randomNewID = this.state.studyCardList[0]
      this.setState({
        studyCardID: 0,
      })
    }
    //otherwise, add one add one and continue
    else {
      //var newID = this.state.studyCardList[newID]
      this.setState({
        studyCardID: newID,
      })
    }
    this.onFlip();
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
    //let cardsList = this.state.entries.filter(entry => this.state.entries.indexOf(entry) > 0);
    return (
      <div className="sn-component">
        {this.state.parseError && <DataErrorAlert />}
        <div id="header">
        <div className="sk-button-group">
            <div className="sk-button info">
              {this.state.entries.length > 0 ? ( // if cardsList is empty, button doesn't do anything
                <div className="sk-label" onClick={this.onStudyFlip}> Study Flip </div>
              ) : (
                <div className="sk-label"> Study Flip </div>
              )}
            </div>
            <div className="sk-button info">
              {this.state.entries.length > 0 ? ( // if cardsList is empty, button doesn't do anything
                <div className="sk-label" onClick={this.onStudyShow}> Study Show </div>
              ) : (
                <div className="sk-label"> Study Show </div>
              )}
            </div>
            <div className="sk-button info" onClick={this.onFlip}>
              {!this.state.flip && ( // if show mode is false
                <div className="sk-label" >Flip All</div>
              )}
              {this.state.flip && ( // if  show mode is true 
                <div className="sk-label" >Flip Back All</div>
              )}
            </div>
            <div className="sk-button info" onClick={this.onShow}>
              {!this.state.show && ( // if show mode is false
                <div className="sk-label" >Show All</div>
              )}
              {this.state.show && ( // if  show mode is true 
                <div className="sk-label" >Hide All</div>
              )}
            </div>
            <div className="sk-button info" onClick={this.onAddNew}>
              <div className="sk-label">Add New</div>
            </div>
            <div className="sk-button info" onClick={this.randomizeStudyList}>
              <div className="sk-label">Settings</div>
            </div>
            <div className="sk-button info" onClick={this.shuffleCards}>
              <div className="sk-label">Shuffle</div>
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
