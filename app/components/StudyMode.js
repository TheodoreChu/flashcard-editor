import React from 'react';
import ViewCards from './ViewCards'

export default class StudyMode extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { entries, onEdit, onRemove, show, flip, studyShow, studyFlip, id, onNextCard, viewMode} = this.props

    return (
      <div className="card-list">
        <ViewCards
          onNextCard={onNextCard}
          show={show}
          flip={flip}
          studyShow={studyShow}
          studyFlip={studyFlip}
          id={id}
          entry={entries[id]}
          viewMode={viewMode}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    );
  }
}