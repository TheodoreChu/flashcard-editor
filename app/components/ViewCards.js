import React from 'react';
import CardShowAllNoFlip from './CardShowAllNoFlip';
import CardShowAllYesFlip from './CardShowAllYesFlip';
import CardShowPartNoFlip from './CardShowPartNoFlip';
import CardShowPartYesFlip from './CardShowPartYesFlip';

const ViewCardShowAllNoFlip = ({ entries, onEdit, onRemove }) => (
  <div className="card-list">
    {entries.map((entry, idx) => (
      <CardShowAllNoFlip
        key={idx}
        id={idx}
        entry={entry}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    ))}
  </div>
);

export { ViewCardShowAllNoFlip };

const ViewCardShowAllYesFlip = ({ entries, onEdit, onRemove }) => (
    <div className="card-list">
      {entries.map((entry, idx) => (
        <CardShowAllYesFlip
          key={idx}
          id={idx}
          entry={entry}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
  
  export { ViewCardShowAllYesFlip };

const ViewCardShowPartNoFlip = ({ entries, onEdit, onRemove }) => (
    <div className="card-list">
      {entries.map((entry, idx) => (
        <CardShowPartNoFlip
          key={idx}
          id={idx}
          entry={entry}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );

export { ViewCardShowPartNoFlip };

const ViewCardShowPartYesFlip = ({ entries, onEdit, onRemove }) => (
    <div className="card-list">
      {entries.map((entry, idx) => (
        <CardShowPartYesFlip
          key={idx}
          id={idx}
          entry={entry}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );

export { ViewCardShowPartYesFlip };
