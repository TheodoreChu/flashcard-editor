import React from 'react';
import CardPartView from './CardPartView';

const ViewPartCards = ({ entries, onEdit, onRemove }) => (
  <div className="card-list">
    {entries.map((entry, idx) => (
      <CardPartView
        key={idx}
        id={idx}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default ViewPartCards;
