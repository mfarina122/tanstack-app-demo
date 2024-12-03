import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import './Table.css';

const Table = ({
  data,
  columns,
  pageCount: controlledPageCount,
  isLoading,
  manualPagination = true,
  onPaginationChange,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
}) => {
  const [columnResizing, setColumnResizing] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Reset to first page when pageCount changes
  useEffect(() => {
    if (pagination.pageIndex >= controlledPageCount) {
      const newPagination = {
        pageIndex: Math.max(0, controlledPageCount - 1),
        pageSize: pagination.pageSize,
      };
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    }
  }, [controlledPageCount, pagination.pageIndex, pagination.pageSize, onPaginationChange]);

  const handlePaginationChange = (updater) => {
    // Handle both function updater and direct value
    const newPagination = typeof updater === 'function' 
      ? updater(pagination)
      : updater;

    setPagination(newPagination);
    onPaginationChange?.(newPagination);
  };

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnResizing,
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination,
    pageCount: Math.max(controlledPageCount, 1),
    onColumnResizingChange: setColumnResizing,
    columnResizeMode: 'onChange',
  });

  const currentPageIndex = pagination.pageIndex;
  const currentPageCount = Math.max(controlledPageCount, 1);

  const goToPage = (pageIndex) => {
    const newPagination = {
      ...pagination,
      pageIndex: Math.min(Math.max(0, pageIndex), currentPageCount - 1),
    };
    handlePaginationChange(newPagination);
  };

  const changePageSize = (newPageSize) => {
    const newPagination = {
      pageIndex: 0, // Reset to first page when changing page size
      pageSize: newPageSize,
    };
    handlePaginationChange(newPagination);
  };

  return (
    <div className="table-wrapper">
      {isLoading ? (
        <div className="table-loading">Caricamento...</div>
      ) : (
        <>
          <div className="table-container">
            <table style={{ width: table.getCenterTotalSize() }}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="resizer"
                        />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                      Nessun dato disponibile
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => goToPage(0)}
              disabled={currentPageIndex === 0}
            >
              {'<<'}
            </button>
            <button
              onClick={() => goToPage(currentPageIndex - 1)}
              disabled={currentPageIndex === 0}
            >
              {'<'}
            </button>
            <span>
              Pagina{' '}
              <strong>
                {currentPageIndex + 1} di {currentPageCount}
              </strong>
            </span>
            <button
              onClick={() => goToPage(currentPageIndex + 1)}
              disabled={currentPageIndex >= currentPageCount - 1}
            >
              {'>'}
            </button>
            <button
              onClick={() => goToPage(currentPageCount - 1)}
              disabled={currentPageIndex >= currentPageCount - 1}
            >
              {'>>'}
            </button>
            <select
              value={pagination.pageSize}
              onChange={e => changePageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Mostra {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
