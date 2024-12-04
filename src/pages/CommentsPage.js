import { useState, useEffect, useCallback } from 'react';
import Table from '../components/Table';

function CommentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [currentFilters, setCurrentFilters] = useState({});

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

  const fetchData = useCallback(async (pagination, filters = {}) => {
    if (!pagination) return;
    
    const { pageIndex, pageSize } = pagination;
    setLoading(true);
    
    try {
      // Costruiamo i parametri di query includendo i filtri
      const queryParams = new URLSearchParams();
      
      // Aggiungiamo i filtri alla query
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(`${key}_like`, value);
        }
      });

      // Prima otteniamo il conteggio totale con gli stessi filtri
      const totalCountResponse = await fetch(
        `https://jsonplaceholder.typicode.com/comments?${queryParams.toString()}`
      );
      const totalData = await totalCountResponse.json();
      const totalCount = totalData.length;
      const newPageCount = Math.ceil(totalCount / pageSize);
      setPageCount(newPageCount);

      // Aggiungiamo i parametri di paginazione per il fetch dei dati
      queryParams.append('_start', pageIndex * pageSize);
      queryParams.append('_limit', pageSize);

      // Fetch dei dati paginati con gli stessi filtri
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?${queryParams.toString()}`
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePaginationChange = useCallback((newPagination, filters) => {
    setCurrentFilters(filters); // Salviamo i filtri correnti
    fetchData(newPagination, filters);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData({ pageIndex: 0, pageSize: 10 }, {});
  }, [fetchData]);

  return (
    <div className="page">
      <h1>Commenti</h1>
      
      <Table
        data={data}
        columns={columns}
        pageCount={pageCount}
        isLoading={loading}
        onPaginationChange={handlePaginationChange}
        initialPageSize={10}
        pageSizeOptions={[10, 20, 30, 40, 50]}
      />
    </div>
  );
}

export default CommentsPage;
