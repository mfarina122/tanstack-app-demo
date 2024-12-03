import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnResizer,
} from '@tanstack/react-table';
import './App.css';

function App() {
  // Sample data
  const data = useMemo(
    () => [
      {
        id: 1,
        name: 'Mario Rossi',
        age: 28,
        city: 'Roma',
        occupation: 'Developer',
      },
      {
        id: 2,
        name: 'Luigi Bianchi',
        age: 32,
        city: 'Milano',
        occupation: 'Designer',
      },
      {
        id: 3,
        name: 'Anna Verdi',
        age: 25,
        city: 'Firenze',
        occupation: 'Manager',
      },
      {
        id: 4,
        name: 'Giuseppe Neri',
        age: 35,
        city: 'Napoli',
        occupation: 'Analyst',
      },
      {
        id: 5,
        name: 'Sofia Russo',
        age: 29,
        city: 'Torino',
        occupation: 'Consultant',
      },
    ],
    []
  );

  // Define columns with enableResizing
  const columns = useMemo(
    () => [
      {
        header: 'Nome',
        accessorKey: 'name',
        enableResizing: true,
        size: 200,
      },
      {
        header: 'Età',
        accessorKey: 'age',
        enableResizing: true,
        size: 100,
      },
      {
        header: 'Città',
        accessorKey: 'city',
        enableResizing: true,
        size: 150,
      },
      {
        header: 'Occupazione',
        accessorKey: 'occupation',
        enableResizing: true,
        size: 200,
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnResizing, setColumnResizing] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnResizing,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnResizingChange: setColumnResizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    globalFilterFn: 'includesString',
  });

  return (
    <div className="App">
      <h1>Demo Tanstack Table</h1>
      
      <input
        type="text"
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(String(e.target.value))}
        placeholder="Cerca..."
        style={{
          padding: '8px',
          margin: '1rem 0',
          width: '200px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <div className="table-container">
        <table style={{ width: table.getCenterTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: '12px',
                      background: '#f4f4f4',
                      cursor: 'pointer',
                      userSelect: 'none',
                      position: 'relative',
                      width: header.getSize(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted()] ?? null}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="resizer"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100%',
                        width: '5px',
                        background: header.column.getIsResizing() ? '#2aaae2' : 'transparent',
                        cursor: 'col-resize',
                        userSelect: 'none',
                        touchAction: 'none',
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
