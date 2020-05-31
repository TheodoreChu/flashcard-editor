import React from 'react';
import ViewCards from './ViewCards';
import EditCard from './EditCard';

const ViewMode = ({ entries, onEdit, onRemove, show, flip, studyShow, studyFlip, viewMode, editEntry, onSave, onCancel }) => ([
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
  <EditCard
  id={editEntry.id}
  entry={editEntry.entry}
  onSave={onSave}
  onCancel={onCancel}
  />
  </div>
]);

export default ViewMode;