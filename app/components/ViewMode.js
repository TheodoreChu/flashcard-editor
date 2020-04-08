import React from 'react';
import CardMenu from './CardMenu';

export default class ViewMode extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    show: this.props.show,
    flip: this.props.flip,
    studyShow: this.props.studyShow,
    studyFlip: this.props.studyFlip,
    };
  }

  onToggleShow = () => {
    this.setState({
      show: !this.state.show
    });
  };

  onToggleFlip = () => {
    this.setState({
      flip: !this.state.flip
    });
  };

  render() {
      // get next card
    const { front, back, notes } = this.props.entry;
    const { id, onEdit, onRemove } = this.props;
    
    return (
      <div className="sk-notification sk-base">
      <div className="card-entry">
        <div className="card-details">
          <div className="card-info" onClick={this.onToggleShow}>

            { this.state.flip && (
              <div className="card-section-title">Back: </div>
            )}
            { this.state.flip && (
            <div className="card-back">{back}<br></br><br></br></div>
            )}
            { this.state.flip && (
              <div className="card-section-title">Front:</div>
            )}
            { this.state.flip && this.state.show && (
            <div className="card-back">{front}<br></br><br></br></div>
              )}
            
            { !this.state.flip && (
              <div className="card-section-title">Front:</div>
            )}
            { !this.state.flip && (
            <div className="card-front">{front}<br></br><br></br></div>
            )}
            { !this.state.flip && (
              <div className="card-section-title">Back: </div>
            )}
            { !this.state.flip && this.state.show && ([
            <div className="card-back">{back}<br></br><br></br></div>
              ])}
            {!this.state.show && (
              <div className="hidden-text">
                <br></br>••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
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
              onFlip={this.onToggleFlip}
              onEdit={onEdit.bind(this, id)}
              onRemove={onRemove.bind(this, id)}
            />
        </div>
      </div>
    </div>
  );
  }
}
