import React from 'react';
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from 'react-table';

import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

const math = require('remark-math');
const rehypeKatex = require('rehype-katex');
const highlight = require('rehype-highlight');
const emoji = require('remark-emoji');
const externalLinks = require('remark-external-links');
const toc = require('remark-toc');
const footnotes = require('remark-footnotes');
const slug = require('remark-slug');

var processor = unified()
  .use(parse)
  .use(slug)
  .use(toc, { maxDepth: 6 })
  .use(externalLinks)
  .use(footnotes, { inlineNotes: true })
  .use(remark2rehype)
  .use(math)
  .use(rehypeKatex)
  .use(highlight, { ignoreMissing: true })
  .use(emoji)
  .use(rehype2react, { createElement: React.createElement });

function Table({ entries }) {
  /*const data = React.useMemo(
      () => entries,
      []
    );*/

  const data = entries;

  const columns = React.useMemo(
    () => [
      {
        Header: 'Side 1',
        accessor: 'side1', // accessor is the "key" in the data
        Cell: ({ cell: { value }, row: { original } }) =>
          processor.processSync(value).result,
      },
      {
        Header: 'Side 2',
        accessor: 'side2',
        Cell: ({ cell: { value }, row: { original } }) =>
          processor.processSync(value).result,
      },
      {
        Header: 'Side 3',
        accessor: 'side3',
        Cell: ({ cell: { value }, row: { original } }) =>
          processor.processSync(value).result,
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({ cell: { value }, row: { original } }) =>
          processor.processSync(value).result,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()} style={{}} className={'cardTable'}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{
                  fontWeight: 'bold',
                }}
                className="TableHeader"
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                    }}
                    className="TableCell"
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
