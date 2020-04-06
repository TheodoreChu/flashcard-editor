import React from 'react';
import CardMenu from '../CardMenu';

export default class CardShowPartNoFlip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        show: this.props.show,
        flip: this.props.flip,
      };
  }

  onToggleShow = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
      // get next card
    var { front, back, notes } = this.props.entry;
    var { id, onEdit, onRemove, show, flip } = this.props;
    //var { show, flip } = this.props.state;

    return (
        <div className="sk-notification sk-base" onClick={this.onToggleShow}>
        <div className="card-entry">
          <div className="card-details">
            <div className="card-info">
              { flip && (
                <div className="card-section-title">Back: </div>
              )}
              { !flip && (
                <div className="card-section-title">Front:</div>
              )}
              { !flip && (
              <div className="card-front">{front}<br></br><br></br></div>
              )}
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
  }
}
