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
  onFiltersChange,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
}) => {
  const [columnResizing, setColumnResizing] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [filters, setFilters] = useState({});

  // Reset page quando cambia il numero totale di pagine
  useEffect(() => {
    if (pagination.pageIndex >= controlledPageCount) {
      const newPagination = {
        ...pagination,
        pageIndex: Math.max(0, controlledPageCount - 1),
      };
      setPagination(newPagination);
      onPaginationChange?.(newPagination, filters);
    }
  }, [controlledPageCount, pagination.pageIndex, pagination.pageSize, onPaginationChange, filters]);

  const handlePaginationChange = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(newPagination);
    onPaginationChange?.(newPagination, filters);
  };

  const handleSearch = () => {
    // Reset to first page and trigger search
    const newPagination = { ...pagination, pageIndex: 0 };
    setPagination(newPagination);
    onPaginationChange?.(newPagination, filters);
    onFiltersChange?.(filters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
                        <div className="th-content">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="resizer"
                          />
                        </div>
                        <div className="th-filter">
                          <div className="filter-group">
                            <input
                              type="text"
                              placeholder={`Filtra ${header.column.columnDef.header}`}
                              value={filters[header.column.columnDef.accessorKey] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFilters(prev => ({
                                  ...prev,
                                  [header.column.columnDef.accessorKey]: value || undefined
                                }));
                              }}
                              onKeyPress={handleKeyPress}
                              className="filter-input"
                            />
                            <button 
                              className="search-button"
                              onClick={handleSearch}
                              title="Cerca"
                            >
                              🔍
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
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
            <div className="pagination-controls">
              <button
                onClick={() => handlePaginationChange(old => ({ ...old, pageIndex: 0 }))}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                onClick={() => handlePaginationChange(old => ({ ...old, pageIndex: old.pageIndex - 1 }))}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <span className="page-input-group">
                Pagina{' '}
                <input
                  type="number"
                  min={1}
                  max={controlledPageCount}
                  value={pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    handlePaginationChange(old => ({
                      ...old,
                      pageIndex: Math.min(Math.max(0, page), controlledPageCount - 1),
                    }));
                  }}
                  className="page-input"
                />
                {' '}di {controlledPageCount}
              </span>
              <button
                onClick={() => handlePaginationChange(old => ({ ...old, pageIndex: old.pageIndex + 1 }))}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                onClick={() => handlePaginationChange(old => ({ ...old, pageIndex: controlledPageCount - 1 }))}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
            </div>
            <select
              value={pagination.pageSize}
              onChange={e => {
                handlePaginationChange(old => ({
                  ...old,
                  pageSize: Number(e.target.value),
                }));
              }}
              className="page-size-select"
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
