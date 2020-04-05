import React from 'react';

export default class EditEntry extends React.Component {
  static defaultProps = {
    entry: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      entry: this.props.entry
    };
  }

  formatSecret(secret) {
    return secret.replace(/\s/g, '').toUpperCase();
  }

  handleInputChange = event => {
    const target = event.target;
    const name = target.name;

    const value =
      name === 'secret' ? this.formatSecret(target.value) : target.value;

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
              {id != null ? 'Edit entry' : 'Add new card'}
            </div>
            <form onSubmit={this.onSave}>
              <input
                name="front"
                className="sk-input contrast"
                placeholder="Front"
                value={entry.front}
                onChange={this.handleInputChange}
                type="text"
              />
              <input
                name="back"
                className="sk-input contrast"
                placeholder="Back"
                value={entry.back}
                onChange={this.handleInputChange}
                type="text"
              />
              <input
                name="notes"
                className="sk-input contrast"
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
