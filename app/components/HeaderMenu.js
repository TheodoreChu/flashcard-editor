import React from 'react';

export default class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  onToggle = () => {
    this.setState({
      show: !this.state.show
    });
  };

  onEdit = () => {
    this.onToggle();
    this.props.onEdit();
  };

  onRemove = () => {
    this.onToggle();
    this.props.onRemove();
  };

  render() {
    //const {entries, onStudyFlip, onStudyShow, onFlip, onShow, onAddNew, shuffleCards} = this.props

    return (
      <div className="card-menu" onClick={this.onToggle}>
        <div className="sk-button info" onClick={this.onToggle}>
          <div className="sk-label">•••</div>
        </div>
        {this.state.show && [
          <div className="card-overlay" onClick={this.onToggle} />,
          <div className="sk-menu-panel">
            <div className="sk-menu-panel-row">
              <div className="sk-label">Flip</div>
            </div>
            <div className="sk-menu-panel-row">
              <div className="sk-label">Edit</div>
            </div>
            <div className="sk-menu-panel-row">
              <div className="sk-label">Remove</div>
            </div>
          </div>
        ]}
      </div>
    );
    /*return (
      <div className="sk-button-group">
        <div className="sk-button info">
          {entries.length > 0 ? ( // if cardsList is empty, button doesn't do anything
            <div className="sk-label" onClick={onStudyFlip}> Study Flip </div>
          ) : (
            <div className="sk-label"> Study Flip </div>
          )}
        </div>
        <div className="sk-button info">
          {entries.length > 0 ? ( // if cardsList is empty, button doesn't do anything
            <div className="sk-label" onClick={onStudyShow}> Study Show </div>
          ) : (
            <div className="sk-label"> Study Show </div>
          )}
        </div>
        <div className="sk-button info">
          {!flip && ( // if show mode is false
            <div className="sk-label" onClick={onFlip}>Flip All</div>
          )}
          {flip && ( // if  show mode is true 
            <div className="sk-label" onClick={onFlip}>Flip Back All</div>
          )}
        </div>
        <div className="sk-button info">
          {!show && ( // if show mode is false
            <div className="sk-label" onClick={onShow}>Show All</div>
          )}
          {show && ( // if  show mode is true 
            <div className="sk-label" onClick={onShow}>Hide All</div>
          )}
        </div>
        <div className="sk-button info" onClick={onAddNew}>
          <div className="sk-label">Add New</div>
        </div>
        <div className="sk-button info">
          <div className="sk-label">Settings</div>
        </div>
        <div className="sk-button info" onClick={shuffleCards}>
          <div className="sk-label">Shuffle</div>
        </div>
      </div>
    );*/
  }
}
/*
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
    <div className="sk-button info" onClick={this.shuffleCards}>
      <div className="sk-label">Shuffle</div>
    </div>
  </div>
*/