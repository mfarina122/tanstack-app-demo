import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch data from JSONPlaceholder
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Calculate start and end based on pagination
        const start = pagination.pageIndex * pagination.pageSize;
        
        // Fetch total count first
        const totalCountResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
        const totalData = await totalCountResponse.json();
        setPageCount(Math.ceil(totalData.length / pagination.pageSize));

        // Then fetch paginated data
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/comments?_start=${start}&_limit=${pagination.pageSize}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 100,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      size: 250,
    },
    {
      header: 'Nome',
      accessorKey: 'name',
      size: 300,
    },
    {
      header: 'Commento',
      accessorKey: 'body',
      size: 400,
    },
  ];

  const [columnResizing, setColumnResizing] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnResizing,
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    onColumnResizingChange: setColumnResizing,
    columnResizeMode: 'onChange',
  });

  return (
    <div className="App">
      <h1>Demo Tanstack Table - Paginazione Server-side</h1>

      <div className="table-container">
        {loading ? (
          <div className="loading">Caricamento...</div>
        ) : (
          <>
            <table style={{ width: table.getCenterTotalSize() }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        style={{
                          padding: '12px',
                          background: '#f4f4f4',
                          position: 'relative',
                          width: header.getSize(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
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

            <div className="pagination">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <span>
                Pagina{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} di {pageCount}
                </strong>
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Mostra {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
