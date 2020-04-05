import React from 'react';
import CardEntry from './CardEntry';

const ViewEntries = ({ entries, onEdit, onRemove }) => (
  <div className="card-list">
    {entries.map((entry, idx) => (
      <CardEntry
        key={idx}
        id={idx}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export default ViewEntries;
