import React from 'react';

let keyMap = new Map();

export default class EditCard extends React.Component {
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

  // this is the default behavior for 'input' boxes but not 'textarea'
  // we want it to be control + enter
  onKeyDown = (e) => {
    keyMap.set(e.key, true);
    //const submit = document.querySelector('#submit');
    console.log("keydown control: " + keyMap.get('Control') + "enter: " + keyMap.get('Enter'));
    if (keyMap.get('Control') && keyMap.get('Enter')) {
      e.preventDefault();
      keyMap.set('Control', false);
      keyMap.set('Enter', false);
      this.onSave(e);
      //submit.click();
      //alert('You pressed Control and Enter');
    }
    else if (keyMap.get('Control') && keyMap.get('s')) {
      e.preventDefault();
      keyMap.set('Control', false);
      keyMap.set('s', false);
      this.onSave(e);
    }
    else if (keyMap.get('Escape')) {
      e.preventDefault();
      keyMap.set('Escape', false);
      this.props.onCancel();
    }
  }

  onKeyUp = (e) => {
    keyMap.set(e.key, false);
  }

  render() {
    const { id, entry } = this.state;

    return (
      <div className="card-edit sk-panel main">
        <div className="sk-panel-content">
          <div className="sk-panel-section">
            <div className="sk-panel-section-title sk-panel-row">
              {id != null ? 'Edit card' : 'Add new card'}
            </div>
            <form onSubmit={this.onSave}>
              Side 1:
              <textarea
                name="side1"
                className="sk-input contrast textarea"
                placeholder="Front"
                value={entry.side1}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                type="text"
                rows="3"
              />
              Side 2:
              <textarea
                name="side2"
                className="sk-input contrast textarea"
                placeholder="Back"
                value={entry.side2}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                type="text"
                rows="3"
              />
              Side 3:
              <textarea
                name="side3"
                className="sk-input contrast textarea"
                placeholder="Side 3"
                value={entry.side3}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                type="text"
                rows="3"
              />
              Notes
              <textarea
                name="notes"
                className="sk-input contrast textarea"
                placeholder="Additional Notes"
                value={entry.notes}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                type="text"
                rows="3"
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
                  <button type="submit" className="sk-button info" id="submit">
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
