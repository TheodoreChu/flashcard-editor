import React from 'react';
import ViewCards from './ViewCards';

const ViewMode = ({ entries, onEdit, onRemove, show, flip, studyShow, studyFlip, viewMode }) => (
  <div className="card-list">
    {entries.map((entry, id) => (
      <ViewCards
        show={show}
        flip={flip}
        studyShow={studyShow}
        studyFlip={studyFlip}
        id={id}
        entry={entry}
        viewMode={viewMode}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default ViewMode;