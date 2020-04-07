import React from 'react';
import StudyMode from './StudyMode'

export default class ViewStudyMode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      test: true,
      id: 0,
    }
  }

  getNextCard = () => {
    this.state.id +=1
  }

  render () {
    const { entries, onEdit, onRemove, show, flip, studyShow, studyFlip, id, onNextCard} = this.props

    return (
      <div className="card-list">
        <StudyMode
          onNextCard={onNextCard}
          show={show}
          flip={flip}
          studyShow={studyShow}
          studyFlip={studyFlip}
          //key={idx}
          id={id}
          entry={entries[id]}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    );
  }
}
