import React from 'react';
//import StudyMode from './StudyMode'
import ViewMode from './ViewMode';

const ViewViewMode = ({ entries, onEdit, onRemove, show, flip, studyShow, studyFlip }) => (
  <div className="card-list">
    {entries.map((entry, id) => (
      <ViewMode
        show={show}
        flip={flip}
        studyShow={studyShow}
        studyFlip={studyFlip}
        //key={idx}
        id={id}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default ViewViewMode;
/*
export default class ViewStudyMode extends React.Component {
  constructor(props) {
  super(props);
  

//const ViewStudyMode = ({ entries, onEdit, onRemove, show, flip, studyShow, studyFlip }) => (
  entries.array.forEach(element => {
    
  });
  render() {
    const { entries, onEdit, onRemove, show, flip, studyShow, studyFlip } = this.props
    // get next card
    const { front, back, notes } = this.props.entry;
    const { id, onEdit, onRemove } = this.props;

  return (
    <div className="card-list">
      <StudyMode
        show={show}
        flip={flip}
        studyShow={studyShow}
        studyFlip={studyFlip}
        //key={idx}
        id={idx}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    //))
  </div>
  );

const ViewStudyMode = ({ entries, onEdit, onRemove, show, flip, studyShow, studyFlip }) => (
  <div className="card-list">
      <StudyMode
        show={show}
        flip={flip}
        studyShow={studyShow}
        studyFlip={studyFlip}
        //key={idx}
        id={0}
        entry={entries[0]}
        onEdit={onEdit}
        onRemove={onRemove}
      />
  </div>
);

export { ViewStudyMode };*/