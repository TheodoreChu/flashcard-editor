import React from 'react';
import CardFullView from './CardFullView';

const ViewFullCards = ({ entries, onEdit, onRemove }) => (
  <div className="card-list">
    {entries.map((entry, idx) => (
      <CardFullView
        key={idx}
        id={idx}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default ViewFullCards;
