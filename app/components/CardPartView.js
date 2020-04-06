import React from 'react';
import CardMenu from './CardMenu';

export default class CardPartView extends React.Component {
  static defaultProps = {
    entry: {}
  };

  constructor(props) {
    super(props);

    this.state = {
        show: false
      };
  }

  handleInputChange = event => {
    const target = event.target;
    const name = target.name;

    this.props.onEntryChange({
      id: this.props.id,
      name,
      value: target.value
    });
  };

  onShow = () => {
    this.onToggle();
  };

  onToggle = () => {
    this.setState({
      show: !this.state.show
    });
    return true
  };

  onNextCard = (id) => {
    return id+=1
  }

  render() {
      // get next card
    var { front, back, notes } = this.props.entry;
    var { id, onEdit, onRemove } = this.props;

    return (
        <div className="sk-notification sk-base" onClick={this.onToggle}>
        <div className="card-entry">
          <div className="card-details">
            <div className="card-info">
              <div className="card-section-title">Front: </div>
              <div className="card-front">{front}<br></br><br></br></div>
              <div className="card-section-title">Back: </div>
              {this.state.show ? ([
              <div className="card-back">{back}<br></br><br></br></div>
                ]) : (
                <div className="hidden-text">
                  <br></br>••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
                  <br></br>••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
                  <br></br>
                </div>
                )}
              {this.state.show && notes && (
                <div className="card-notes-row">
                  <div className="card-section-title">Notes </div>
                  <div className="card-notes">{notes}</div>
                </div>
                )}
            </div>
          </div>
            <div className="card-options">
              <CardMenu
                onEdit={onEdit.bind(this, id)}
                onRemove={onRemove.bind(this, id)}
              />
            </div>
        </div>
      </div>
    );
  }/*
  render() {    
    const ViewEntries = ({ entries, onEdit, onRemove }) => (
        <div className="card-list">
          {entries.map((entry, idx) => (
            <CardEntry
              key={idx}
              id={idx}
              entry={entry}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </div>
      );
      
    return (
      <div className="sk-notification sk-base">
        <div className="card-entry">
          <div className="card-details">
            <div className="card-info">
              <div className="card-section-title">Front: </div>
              <div className="card-front">{front}</div>
              <br></br>
              <div className="card-section-title">Back: </div>
              <div className="card-back">{back}</div>
            </div>
          </div>
          <div className="card-options">
            <CardMenu
              onEdit={onEdit.bind(this, id)}
              onRemove={onRemove.bind(this, id)}
            />
          </div>
        </div>
        {notes && (
          <div className="card-notes-row">
            <div className="card-section-title">Notes </div>
            <div className="card-notes">{notes}</div>
          </div>
        )}
      </div>
    );
  }*/
}
