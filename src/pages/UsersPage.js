import { useState, useCallback, useEffect } from 'react';
import Table from '../components/Table/Table';

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Telefono',
    },
    {
      accessorKey: 'website',
      header: 'Sito Web',
    },
    {
      accessorKey: 'company.name',
      header: 'Azienda',
    }
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
        `https://jsonplaceholder.typicode.com/users?${queryParams.toString()}`
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
        `https://jsonplaceholder.typicode.com/users?${queryParams.toString()}`
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
    setCurrentFilters(filters);
    fetchData(newPagination, filters);
  }, [fetchData]);

  useEffect(() => {
    fetchData({ pageIndex: 0, pageSize: 10 }, {});
  }, [fetchData]);

  return (
    <div className="page-container">
      <h1>Utenti</h1>
      <Table
        data={data}
        columns={columns}
        pageCount={pageCount}
        onPaginationChange={handlePaginationChange}
        isLoading={loading}
        initialPageSize={10}
        pageSizeOptions={[10, 20, 30, 40, 50]}
      />
    </div>
  );
};

export default UsersPage;
