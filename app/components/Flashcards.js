import React from 'react';
import update from 'immutability-helper';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';

import ConfirmDialog from './ConfirmDialog';
import DataErrorAlert from './DataErrorAlert';
import EditCard from './EditCard';

import ViewMode from './ViewMode';
import StudyMode from './StudyMode';
import Table from './Table';

const initialState = {
  text: '',
  entries: [],
  parseError: false,
  confirmRemove: false,
  confirmRestart: false,
  editEntry: null,
  editCardMode: false,
  flip: false,
  show: false,
  studyFlip: false,
  studyShow: false,
  randomCardList: [], //list of IDs for random study mode
  randomCardID: 0, // the ID of the study card (which is not necessarily its corresponding index in the study card list)
  spacedCardList: [], //list of IDs for random study mode
  spacedCardID: 0, // the ID of the study card (which is not necessarily its corresponding index in the study card list)
  viewMode: true,
  tableMode: false,
};

let keyMap = new Map();

export default class Flashcards extends React.Component {
  constructor(props) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  configureEditorKit() {
    let delegate = new EditorKitDelegate({
      setEditorRawText: (text) => {
        let parseError = false;
        let entries = [];

        if (text) {
          try {
            entries = JSON.parse(text);
          } catch (e) {
            // Couldn't parse the content
            parseError = true;
            this.setState({
              parseError: true,
            });
          }
        }

        this.setState({
          ...initialState,
          text,
          parseError,
          entries,
        });
      },
      generateCustomPreview: (text) => {
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
      getElementsBySelector: () => [],
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'json',
      supportsFilesafe: false,
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
  addEntry = (entry) => {
    this.setState((state) => {
      const entries = state.entries.concat([entry]);
      this.saveNote(entries);
      console.log('finished adding entry');
      return {
        editCardMode: false,
        editEntry: null,
        entries,
      };
    });
  };

  editEntry = ({ id, entry }) => {
    this.setState((state) => {
      const entries = update(state.entries, { [id]: { $set: entry } });
      this.saveNote(entries);
      console.log('finished editing entry');
      return {
        editCardMode: false,
        editEntry: null,
        entries,
      };
    });
  };

  removeEntry = (id) => {
    this.setState((state) => {
      const entries = update(state.entries, { $splice: [[id, 1]] });
      this.saveNote(entries);

      return {
        confirmRemove: false,
        editEntry: null,
        entries,
      };
    });
  };

  // Event Handlers
  onAddNew = () => {
    this.setState({
      editCardMode: !this.state.editCardMode,
      editEntry: null,
    });
  };

  onEdit = (id) => {
    this.setState((state) => ({
      editCardMode: true,
      editEntry: {
        id,
        entry: state.entries[id],
      },
    }));
  };

  onCancel = () => {
    this.setState({
      confirmRemove: false,
      editCardMode: false,
      editEntry: null,
    });
  };

  onRemove = (id) => {
    this.setState((state) => ({
      confirmRemove: true,
      editEntry: {
        id,
        entry: state.entries[id],
      },
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
      tableMode: false,
      studyFlip: false,
      studyShow: false,
      viewMode: true,
      editCardMode: false,
      editEntry: null,
    });
  };

  onShow = () => {
    this.setState({
      show: !this.state.show,
      tableMode: false,
      studyFlip: false,
      studyShow: false,
      viewMode: true,
      editCardMode: false,
      editEntry: null,
    });
  };

  onHide = () => {
    this.setState({
      show: false,
      tableMode: false,
      studyFlip: false,
      studyShow: false,
      viewMode: true,
      editCardMode: false,
      editEntry: null,
    });
  };

  onListMode = () => {
    this.setState({
      tableMode: false,
      show: false,
      studyFlip: false,
      studyShow: false,
      viewMode: !this.state.viewMode,
      editCardMode: false,
      editEntry: null,
    });
  };

  onTableMode = () => {
    this.setState({
      tableMode: !this.state.tableMode,
      show: false,
      studyFlip: false,
      studyShow: false,
      viewMode: false,
      editCardMode: false,
      editEntry: null,
    });
  };

  onStudyFlip = () => {
    if (
      this.state.randomCardList.length === 0 &&
      this.state.entries.length > 0
    ) {
      this.getRandomCardList();
    }
    if (this.state.entries.length > 0) {
      // if studyFlip is turned on, then turn it off and turn on viewMode
      if (this.state.studyFlip) {
        this.setState({
          studyFlip: false,
          studyShow: false,
          viewMode: true,
          editCardMode: false,
          editEntry: null,
        });
      }
      // if studyFlip is turned off, then turn it on and turn off viewMode
      else if (!this.state.studyFlip) {
        this.setState({
          tableMode: false,
          studyFlip: true,
          studyShow: false,
          viewMode: false,
          editCardMode: false,
          editEntry: null,
        });
      }
    }
  };

  onStudyShow = () => {
    if (
      this.state.randomCardList.length === 0 &&
      this.state.entries.length > 0
    ) {
      this.getRandomCardList();
    }
    if (this.state.entries.length > 0) {
      // if studyShow is turned on, then turn it off and turn on viewMode
      if (this.state.studyShow) {
        this.setState({
          studyFlip: false,
          studyShow: false,
          viewMode: true,
          editCardMode: false,
          editEntry: null,
        });
      }
      // if studyShow is turned off, then turn it on and turn off viewMode
      else if (!this.state.studyShow) {
        this.setState({
          studyFlip: false,
          tableMode: false,
          studyShow: true,
          viewMode: false,
          editCardMode: false,
          editEntry: null,
        });
      }
    }
  };

  // shuffle cards with the Fisher-Yates (aka Knuth) Shuffle. See http://bost.ocks.org/mike/shuffle/
  onShuffleCards = () => {
    var currentIndex = this.state.entries.length,
      temporaryValue,
      randomIndex;

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
  };

  // this isn't working!!!
  getRandomCardList = () => {
    if (this.state.entries != 0) {
      var temporaryList = [];
      for (var i = 0; i < this.state.entries.length; i++) {
        temporaryList.push(i);
      }
      //this.onShow();

      //var temporaryList = Array.from(Array(this.state.entries.length - 1).keys())
      var currentIndex = temporaryList.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = temporaryList[currentIndex];
        temporaryList[currentIndex] = temporaryList[randomIndex];
        temporaryList[randomIndex] = temporaryValue;
      }
      const firstID = Number(temporaryList[0]);
      this.setState({
        randomCardList: temporaryList,
        randomCardID: firstID,
      });
    }
  };

  // this is the basic version, without randomness
  onNextCardOld = () => {
    //const newIDCounter = this.state.randomCardID + 1
    // the last ID should be one less than the length because IDs start at zero
    // if the id is one less than the length, then start over with a randomized list
    if (this.state.randomCardID === this.state.entries.length - 1) {
      //const newID = this.randomCardList[0]
      //const temporaryList = this.getRandomCardList; // which is equal to this.state.randomCardList
      //const randomNewID = this.state.randomCardList[0]
      const newID = 0;
      this.setState({
        randomCardID: newID,
        confirmRestart: true,
      });
    }
    //otherwise, add one add one and continue
    else {
      const newID = this.state.randomCardID + 1;
      //const newID = this.state.randomCardList[newIDCounter]
      this.setState({
        randomCardID: newID,
      });
    }
    //this.onShow();
  };

  onNextCard = () => {
    // the last ID is the
    //if (this.state.randomCardID == this.state.entries.length - 1 ) {
    const currentIndex = this.state.randomCardList.indexOf(
      this.state.randomCardID
    );
    const lastIndex = this.state.randomCardList.length - 1; // last index of randomCardList
    if (currentIndex === lastIndex) {
      this.getRandomCardList();
      this.setState({
        confirmRestart: true, // if all cards studied, ask if you want to start over
      });
    }

    //otherwise, add one add one and continue
    else {
      const nextIndex = currentIndex + 1;
      const nextCardID = this.state.randomCardList[nextIndex];
      this.setState({
        randomCardID: nextCardID,
      });
    }
  };

  onStudyMore = () => {
    this.setState({
      confirmRestart: false,
    });
  };

  onStopStudy = () => {
    this.onHide();
    this.setState({
      confirmRestart: false,
    });
  };

  // check if each card is hidden or shown (doesn't work yet)
  checkHideMode = () => {
    if (this.state.show) {
      state.entries.forEach((entry) => {
        return true;
      });
    }
  };

  /*
  <div>{this.state.randomCardList}<br></br><br></br>
  <br></br>zero: {this.state.randomCardList[0]}, one: {this.state.randomCardList[1]}, two: {this.state.randomCardList[2]}, three: {this.state.randomCardList[3]}<br></br>
  <br></br>studyCard: {this.state.randomCardList[this.state.randomCardID]}
  <br></br>randomCardID: {this.state.randomCardID}
  <br></br>next card: {this.state.randomCardList[this.state.randomCardID + 1]}
  <br></br>next id: {this.state.randomCardID + 1}
  </div>
  */

  // Need both content and appendix for mobile
  scrollToBottom = () => {
    var content = document.getElementById('content');
    var appendix = document.getElementById('appendix');
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    }); // Bottom
    appendix.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    }); // Bottom
  };

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToBottom = () => {
    var content = document.getElementById('content');
    var appendix = document.getElementById('appendix');
    document.body.scrollTop = 10000000; // for Safari
    content.scrollIntoView({
      behavior: 'auto',
      block: 'end',
      inline: 'nearest',
    }); // Bottom
    appendix.scrollIntoView({
      behavior: 'auto',
      block: 'end',
      inline: 'nearest',
    }); // Bottom
  };

  // Need both content and appendix for mobile
  scrollToTop = () => {
    var content = document.getElementById('content');
    var header = document.getElementById('header');
    document.body.scrollTop = 0; // for Safari
    content.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    }); // Top
    header.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    }); // Top
  };

  // Need both content and appendix for mobile
  // Skip to Bottom is fast "auto" behavior instead of "smooth" behavior
  skipToTop = () => {
    var content = document.getElementById('content');
    var header = document.getElementById('header');
    document.body.scrollTop = 0; // for Safari
    content.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    }); // Top
    header.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    }); // Top
  };

  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    if (keyMap.get('Control') && keyMap.get('{')) {
      e.preventDefault();
      this.scrollToTop();
    } else if (keyMap.get('Control') && keyMap.get('}')) {
      e.preventDefault();
      this.scrollToBottom();
    } else if (keyMap.get('Control') && keyMap.get('[')) {
      e.preventDefault();
      this.skipToTop();
    } else if (keyMap.get('Control') && keyMap.get(']')) {
      e.preventDefault();
      this.skipToBottom();
    }
    console.log('');
    // TODO: If you close it with Ctrl + W and open it again, the Ctrl event key isn't set to false
    // So, if you have minimize to tray on, then it'll open with Ctrl still down
  };

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  };

  render() {
    const editEntry = this.state.editEntry || {};

    //this.getRandomCardList();
    //let cardsList = this.state.entries.filter(entry => this.state.entries.indexOf(entry) > 0);
    return (
      <div
        tabIndex="0"
        className="sn-component"
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      >
        {this.state.parseError && <DataErrorAlert />}
        <div id="header">
          <div className="sk-button-group">
            <button
              onClick={this.onStudyShow}
              className={
                'sk-button info ' + (this.state.studyShow ? 'on' : 'off')
              }
            >
              <div className="sk-label"> Study </div>
            </button>
            {this.state.entries.length > 0 && (
              <button
                onClick={this.onShow}
                className={'sk-button info ' + (this.state.show ? 'on' : 'off')}
              >
                {
                  !this.state.show && <div className="sk-label">Show All</div> // if show mode is false
                }
                {
                  this.state.show && <div className="sk-label">Hide All</div> // if  show mode is true
                }
              </button>
            )}
            <button
              onClick={this.onListMode}
              className={
                'sk-button info ' + (this.state.viewMode ? 'on' : 'off')
              }
            >
              <div className="sk-label">List</div>
            </button>
            <button
              onClick={this.onTableMode}
              className={
                'sk-button info ' + (this.state.tableMode ? 'on' : 'off')
              }
            >
              <div className="sk-label">Table</div>
            </button>
            <button onClick={this.onAddNew} className={'sk-button'}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1668 10.0001C14.1668 10.4603 13.7937 10.8334 13.3334 10.8334H10.8334V13.3334C10.8334 13.7937 10.4603 14.1668 10.0001 14.1668C9.53985 14.1668 9.16675 13.7937 9.16675 13.3334V10.8334H6.66675C6.20651 10.8334 5.83342 10.4603 5.83342 10.0001C5.83342 9.53985 6.20651 9.16675 6.66675 9.16675H9.16675V6.66675C9.16675 6.20651 9.53985 5.83342 10.0001 5.83342C10.4603 5.83342 10.8334 6.20651 10.8334 6.66675V9.16675H13.3334C13.7937 9.16675 14.1668 9.53985 14.1668 10.0001ZM10.0001 1.66675C8.90573 1.66675 7.8221 1.8823 6.81105 2.30109C5.80001 2.71987 4.88135 3.3337 4.10753 4.10753C2.54472 5.67033 1.66675 7.78995 1.66675 10.0001C1.66675 12.2102 2.54472 14.3298 4.10753 15.8926C4.88135 16.6665 5.80001 17.2803 6.81105 17.6991C7.8221 18.1179 8.90573 18.3334 10.0001 18.3334C12.2102 18.3334 14.3298 17.4554 15.8926 15.8926C17.4554 14.3298 18.3334 12.2102 18.3334 10.0001C18.3334 8.90573 18.1179 7.8221 17.6991 6.81105C17.2803 5.80001 16.6665 4.88135 15.8926 4.10753C15.1188 3.3337 14.2002 2.71987 13.1891 2.30109C12.1781 1.8823 11.0944 1.66675 10.0001 1.66675Z"
                  fill={
                    this.state.editCardMode
                      ? 'var(--sn-stylekit-info-color)'
                      : 'var(--sn-stylekit-foreground-color)'
                  }
                />
              </svg>
            </button>
            <button
              type="button"
              id="helpButton"
              onClick={this.onToggleShowHelp}
              title="Help"
              className={'sk-button'}
            >
              <div className="sk-label">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.16675 15.0001H10.8334V13.3334H9.16675V15.0001ZM10.0001 1.66675C8.90573 1.66675 7.8221 1.8823 6.81105 2.30109C5.80001 2.71987 4.88135 3.3337 4.10753 4.10753C2.54472 5.67033 1.66675 7.78995 1.66675 10.0001C1.66675 12.2102 2.54472 14.3298 4.10753 15.8926C4.88135 16.6665 5.80001 17.2803 6.81105 17.6991C7.8221 18.1179 8.90573 18.3334 10.0001 18.3334C12.2102 18.3334 14.3298 17.4554 15.8926 15.8926C17.4554 14.3298 18.3334 12.2102 18.3334 10.0001C18.3334 8.90573 18.1179 7.8221 17.6991 6.81105C17.2803 5.80001 16.6665 4.88135 15.8926 4.10753C15.1188 3.3337 14.2002 2.71987 13.1891 2.30109C12.1781 1.8823 11.0944 1.66675 10.0001 1.66675ZM10.0001 16.6668C6.32508 16.6668 3.33342 13.6751 3.33342 10.0001C3.33342 6.32508 6.32508 3.33342 10.0001 3.33342C13.6751 3.33342 16.6668 6.32508 16.6668 10.0001C16.6668 13.6751 13.6751 16.6668 10.0001 16.6668ZM10.0001 5.00008C9.11603 5.00008 8.26818 5.35127 7.64306 5.97639C7.01794 6.60151 6.66675 7.44936 6.66675 8.33342H8.33342C8.33342 7.89139 8.50901 7.46747 8.82157 7.1549C9.13413 6.84234 9.55806 6.66675 10.0001 6.66675C10.4421 6.66675 10.866 6.84234 11.1786 7.1549C11.4912 7.46747 11.6667 7.89139 11.6667 8.33342C11.6667 10.0001 9.16675 9.79175 9.16675 12.5001H10.8334C10.8334 10.6251 13.3334 10.4167 13.3334 8.33342C13.3334 7.44936 12.9822 6.60151 12.3571 5.97639C11.732 5.35127 10.8841 5.00008 10.0001 5.00008Z"
                    fill={
                      this.state.showHelp
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
              </div>
            </button>
            <button
              type="button"
              id="settingsButton"
              onClick={(this.onToggleShowSettings, this.getRandomCardList)}
              title="Settings"
              className={'sk-button'}
            >
              <div className="sk-label">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0001 6.66675C10.8842 6.66675 11.732 7.01794 12.3571 7.64306C12.9823 8.26818 13.3334 9.11603 13.3334 10.0001C13.3334 10.8841 12.9823 11.732 12.3571 12.3571C11.732 12.9822 10.8842 13.3334 10.0001 13.3334C9.11606 13.3334 8.26821 12.9822 7.64309 12.3571C7.01797 11.732 6.66678 10.8841 6.66678 10.0001C6.66678 9.11603 7.01797 8.26818 7.64309 7.64306C8.26821 7.01794 9.11606 6.66675 10.0001 6.66675ZM10.0001 8.33342C9.55808 8.33342 9.13416 8.50901 8.8216 8.82157C8.50904 9.13413 8.33344 9.55805 8.33344 10.0001C8.33344 10.4421 8.50904 10.866 8.8216 11.1786C9.13416 11.4912 9.55808 11.6667 10.0001 11.6667C10.4421 11.6667 10.8661 11.4912 11.1786 11.1786C11.4912 10.866 11.6668 10.4421 11.6668 10.0001C11.6668 9.55805 11.4912 9.13413 11.1786 8.82157C10.8661 8.50901 10.4421 8.33342 10.0001 8.33342ZM8.33344 18.3334C8.12511 18.3334 7.95011 18.1834 7.91678 17.9834L7.60844 15.7751C7.08344 15.5667 6.63344 15.2834 6.20011 14.9501L4.12511 15.7917C3.94178 15.8584 3.71678 15.7917 3.61678 15.6084L1.95011 12.7251C1.84178 12.5417 1.89178 12.3167 2.05011 12.1917L3.80844 10.8084L3.75011 10.0001L3.80844 9.16675L2.05011 7.80841C1.89178 7.68341 1.84178 7.45841 1.95011 7.27508L3.61678 4.39175C3.71678 4.20841 3.94178 4.13341 4.12511 4.20842L6.20011 5.04175C6.63344 4.71675 7.08344 4.43341 7.60844 4.22508L7.91678 2.01675C7.95011 1.81675 8.12511 1.66675 8.33344 1.66675H11.6668C11.8751 1.66675 12.0501 1.81675 12.0834 2.01675L12.3918 4.22508C12.9168 4.43341 13.3668 4.71675 13.8001 5.04175L15.8751 4.20842C16.0584 4.13341 16.2834 4.20841 16.3834 4.39175L18.0501 7.27508C18.1584 7.45841 18.1084 7.68341 17.9501 7.80841L16.1918 9.16675L16.2501 10.0001L16.1918 10.8334L17.9501 12.1917C18.1084 12.3167 18.1584 12.5417 18.0501 12.7251L16.3834 15.6084C16.2834 15.7917 16.0584 15.8667 15.8751 15.7917L13.8001 14.9584C13.3668 15.2834 12.9168 15.5667 12.3918 15.7751L12.0834 17.9834C12.0501 18.1834 11.8751 18.3334 11.6668 18.3334H8.33344ZM9.37511 3.33341L9.06678 5.50841C8.06678 5.71675 7.18344 6.25008 6.54178 6.99175L4.53344 6.12508L3.90844 7.20841L5.66678 8.50008C5.33344 9.47508 5.33344 10.5334 5.66678 11.5001L3.90011 12.8001L4.52511 13.8834L6.55011 13.0167C7.19178 13.7501 8.06678 14.2834 9.05844 14.4834L9.36678 16.6667H10.6334L10.9418 14.4917C11.9334 14.2834 12.8084 13.7501 13.4501 13.0167L15.4751 13.8834L16.1001 12.8001L14.3334 11.5084C14.6668 10.5334 14.6668 9.47508 14.3334 8.50008L16.0918 7.20841L15.4668 6.12508L13.4584 6.99175C12.8168 6.25008 11.9334 5.71675 10.9334 5.51675L10.6251 3.33341H9.37511Z"
                    fill={
                      this.state.showSettings
                        ? 'var(--sn-stylekit-info-color)'
                        : 'var(--sn-stylekit-foreground-color)'
                    }
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div id="content">
          {this.state.tableMode && [<Table entries={this.state.entries} />]}
          {this.state.studyFlip &&
          !this.state.editCardMode && ( // if show mode is on and flip mode is off
              <StudyMode
                id={this.state.randomCardID}
                onNextCard={this.onNextCard}
                flip={this.state.flip}
                show={this.state.show}
                studyFlip={this.state.studyFlip}
                studyShow={this.state.studyShow}
                entries={this.state.entries}
                viewMode={this.state.viewMode}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
              />
            )}
          {this.state.studyShow &&
          !this.state.editCardMode && ( // if show mode is on and flip mode is off
              <StudyMode
                id={this.state.randomCardID}
                onNextCard={this.onNextCard}
                flip={this.state.flip}
                show={this.state.show}
                studyFlip={this.state.studyFlip}
                studyShow={this.state.studyShow}
                entries={this.state.entries}
                viewMode={this.state.viewMode}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
              />
            )}
          {this.state.show &&
          !this.state.flip &&
          !this.state.editCardMode &&
          this.state.viewMode && ( // if show mode is on and flip mode is off
              <ViewMode
                flip={this.state.flip}
                show={this.state.show}
                studyFlip={this.state.studyFlip}
                studyShow={this.state.studyShow}
                entries={this.state.entries}
                viewMode={this.state.viewMode}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
                editEntry={editEntry}
                onSave={this.onSave}
                onCancel={this.onCancel}
              />
            )}
          {this.state.show &&
          this.state.flip &&
          !this.state.editCardMode &&
          this.state.viewMode && ( // if show mode is on and flip mode is on
              <ViewMode
                flip={this.state.flip}
                show={this.state.show}
                studyFlip={this.state.studyFlip}
                studyShow={this.state.studyShow}
                entries={this.state.entries}
                viewMode={this.state.viewMode}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
                editEntry={editEntry}
                onSave={this.onSave}
                onCancel={this.onCancel}
              />
            )}
          {!this.state.show &&
          !this.state.flip &&
          !this.state.editCardMode &&
          this.state.viewMode && ( // if show mode is off and flip mode is off
              <ViewMode
                flip={this.state.flip}
                show={this.state.show}
                studyFlip={this.state.studyFlip}
                studyShow={this.state.studyShow}
                entries={this.state.entries}
                viewMode={this.state.viewMode}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
                editEntry={editEntry}
                onSave={this.onSave}
                onCancel={this.onCancel}
              />
            )}
          {!this.state.show &&
          this.state.flip &&
          !this.state.editCardMode &&
          this.state.viewMode && ( // if show mode is off and flip mode is on
              <ViewMode
                flip={this.state.flip}
                show={this.state.show}
                studyFlip={this.state.studyFlip}
                studyShow={this.state.studyShow}
                entries={this.state.entries}
                viewMode={this.state.viewMode}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
                editEntry={editEntry}
                onSave={this.onSave}
                onCancel={this.onCancel}
              />
            )}
          {this.state.editCardMode && (
            <EditCard
              id={editEntry.id}
              entry={editEntry.entry}
              onSave={this.onSave}
              onCancel={this.onCancel}
            />
          )}
          {this.state.confirmRemove && (
            <ConfirmDialog
              title={`Remove ${editEntry.entry.side1}`}
              message="Are you sure you want to remove this card?"
              onConfirm={() => this.removeEntry(editEntry.id)}
              onCancel={this.onCancel}
            />
          )}
          {this.state.confirmRestart && (
            <ConfirmDialog
              title={`You studied all the cards.`}
              message="Would you like to start over?"
              onConfirm={this.onStudyMore}
              onCancel={this.onStopStudy}
            />
          )}
        </div>
        <div
          id="appendix"
          className={
            'appendix ' +
            (this.state.printMode ? 'printModeOn' : 'printModeOff')
          }
        >
          <button
            type="button"
            id="scrollToTopButton"
            onClick={this.scrollToTop}
            className="sk-button info"
          >
            <div className="sk-label"> ▲ </div>
          </button>
          <button
            type="button"
            id="scrollToBottomButton"
            onClick={this.scrollToBottom}
            className="sk-button info"
          >
            <div className="sk-label"> ▼ </div>
          </button>
        </div>
      </div>
    );
  }
}
