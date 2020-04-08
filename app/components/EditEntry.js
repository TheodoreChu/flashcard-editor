import React from 'react';

export default class EditEntry extends React.Component {
  static defaultProps = {
    entry: {
      forward: true,
      reverse: true,
      timeLeft: 0,
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      entry: this.props.entry
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value

    this.setState(state => ({
      entry: { ...state.entry, [name]: value }
    }));
  };

  onSave = e => {
    e.preventDefault();
    const { id, entry } = this.state;
    this.props.onSave({ id, entry });
  };

  render() {
    const { id, entry } = this.state;

    return (
      <div className="card-edit sk-panel">
        <div className="sk-panel-content">
          <div className="sk-panel-section">
            <div className="sk-panel-section-title sk-panel-row">
              {id != null ? 'Edit card' : 'Add new card'}
            </div>
            <form onSubmit={this.onSave}>
              Front:
              <textarea
                name="front"
                className="sk-input contrast textarea"
                placeholder="Front"
                value={entry.front}
                onChange={this.handleInputChange}
                type="text"
              />
              Back:
              <textarea
                name="back"
                className="sk-input contrast textarea"
                placeholder="Back"
                value={entry.back}
                onChange={this.handleInputChange}
                type="text"
              />
              Notes
              <textarea
                name="notes"
                className="sk-input contrast textarea"
                placeholder="Notes"
                value={entry.notes}
                onChange={this.handleInputChange}
                type="text"
              />
              <div className="sk-panel-row">
                <div className="sk-button-group stretch">
                  <button
                    type="button"
                    onClick={this.props.onCancel}
                    className="sk-button neutral"
                  >
                    <div className="sk-label">Cancel</div>
                  </button>
                  <button type="submit" className="sk-button info">
                    <div className="sk-label">
                      {id != null ? 'Save' : 'Create'}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
