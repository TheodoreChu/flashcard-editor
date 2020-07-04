import React from 'react';

export default class CardMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  onToggle = () => {
    this.setState({
      show: !this.state.show,
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
    const { onFlip } = this.props;

    return (
      <div className="card-menu">
        <div className="sk-button" onClick={this.onToggle}>
          <div className="sk-label">•••</div>
        </div>
        {this.state.show && [
          //<div className="card-overlay" onClick={this.onToggle} />,
          <div className="sk-menu-panel">
            <div className="sk-menu-panel-row">
              <div className="sk-label">Mark</div>
            </div>
            <div className="sk-menu-panel-row" onClick={onFlip}>
              <div className="sk-label">Flip</div>
            </div>
            <div className="sk-menu-panel-row" onClick={this.onEdit}>
              <div className="sk-label">Edit</div>
            </div>
            <div className="sk-menu-panel-row" onClick={this.onRemove}>
              <div className="sk-label">Remove</div>
            </div>
          </div>,
        ]}
      </div>
    );
  }
}
