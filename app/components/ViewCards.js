import React from 'react';
import ShowCards from './ShowCards'

const ViewCards = ({ entries, onEdit, onRemove, show, flip }) => (
  <div className="card-list">
    {entries.map((entry, idx) => (
      <ShowCards
        show={show}
        flip={flip}
        key={idx}
        id={idx}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export { ViewCards };