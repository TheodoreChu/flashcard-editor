import React from 'react';
import CardMenu from './CardMenu';

export default class CardEntry extends React.Component {
  constructor(props) {
    super(props);
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

  render() {
    const { front, back, notes } = this.props.entry;
    const { id, onEdit, onRemove } = this.props;

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
  }
}
