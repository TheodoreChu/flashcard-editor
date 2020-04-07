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
  confirmRemove: false,
  confirmRestart: false,
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
  onShuffleCards = () => {
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
    };
  }

  // this isn't working!!!
  onRandomizeStudyList = () => {
    if (this.state.entries != 0) {
      var temporaryList = [];
      for (var i = 0; i < this.state.entries.length; i++){
        temporaryList.push(i); 
      }
      this.onShow();
      
      //var temporaryList = Array.from(Array(this.state.entries.length - 1).keys())
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
      };
      this.setState({
        studyCardList: temporaryList,
      });
      //const firstID = Number(temporaryList[0]);
      const firstID = this.state.studyCardList[0];
      //const newID = Number(firstID.trim());
      this.setState({
        studyCardID: firstID,
      });
      this.onFlip();
      //return temporaryList
    }
  }

  // to be deleted
  onNextCardOld = () => {
    //const newIDCounter = this.state.studyCardID + 1
    // the last ID should be one less than the length because IDs start at zero
    // if the id is one less than the length, then start over with a randomized list
    if (this.state.studyCardID == this.state.entries.length - 1 ) { 
      //const newID = this.studyCardList[0]
      //const temporaryList = this.randomizeStudyList; // which is equal to this.state.studyCardList
      //const randomNewID = this.state.studyCardList[0]
      const newID = 0;
      this.setState({
        studyCardID: newID,
        confirmRestart: true,
      });
    }
    //otherwise, add one add one and continue
    else {
      const newID = this.state.studyCardID + 1;
      //const newID = this.state.studyCardList[newIDCounter]
      this.setState({
        studyCardID: newID,
      });
    }
    //this.onShow();
  }
  
  onNextCard = () => {
    // the last ID should be one less than the length because IDs start at zero
    // if the id is one less than the length, then start over with a randomized list
    //if (this.state.studyCardID == this.state.entries.length - 1 ) {
    const lastCardID = this.state.studyCardList.length - 1; // last index of studyCardList
    if (this.state.studyCardID === lastCardID) {
      this.onRandomizeStudyList();
      //const newID = this.studyCardList[0];
      //const randomNewID = this.state.studyCardList[0]
      //const newID = 0
      this.setState({
        //studyCardID: newID,
        confirmRestart: true
      });
    }
    //otherwise, add one add one and continue
    else {
      const newIDCounter = this.state.studyCardID + 1;
      const newID = this.state.studyCardList[newIDCounter];
      this.setState({
        studyCardID: newID,
      });
    }
  }

  onStudyMore = () => {
    this.setState({
      confirmRestart: false,
    });
  }

  onStopStudy = () => {
    this.onShow();
    this.setState({
      confirmRestart: false,
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
    const list = [0, 1, 2];
    //this.onRandomizeStudyList();
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
            <div className="sk-button info" onClick={this.onRandomizeStudyList}>
              <div className="sk-label">Settings</div>
            </div>
            <div className="sk-button info" onClick={this.onShuffleCards}>
              <div className="sk-label">Shuffle</div>
            </div>
          </div>
        </div>

        <div id="content">
          <div>{this.state.studyCardList}<br></br><br></br>{list}<br></br>
          <br></br>zero: {this.state.studyCardList[0]}, one: {this.state.studyCardList[1]}, two: {this.state.studyCardList[2]}<br></br>
          <br></br>studyCardID: {this.state.studyCardID}
          </div>
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
          {this.state.confirmRestart && (
            <ConfirmDialog
              title={`You have studied all the cards.`}
              message="Would you like to start over?"
              onConfirm={this.onStudyMore}
              onCancel={this.onStopStudy}
            />
          )}
        </div>
      </div>
    );
  }
}
