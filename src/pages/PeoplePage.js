import { useState, useCallback, useEffect } from 'react';
import Table from '../components/Table/Table';

const PeoplePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});

  const columns = [
    {
      accessorKey: 'first_name',
      header: 'Nome',
      size: 200,
    },
    {
      accessorKey: 'last_name',
      header: 'Cognome',
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 250,
    },
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      header: 'Nome Completo',
      size: 250,
    }
  ];

  const fetchData = useCallback(async (pagination, filters = {}) => {
    if (!pagination) return;
    
    const { pageIndex, pageSize } = pagination;
    setLoading(true);
    
    try {
      // ReqRes supporta paginazione ma non filtering, quindi facciamo una richiesta più grande
      // e filtriamo lato client
      const response = await fetch(
        `https://reqres.in/api/users?page=${pageIndex + 1}&per_page=${pageSize}`
      );
      const result = await response.json();
      
      let filteredData = result.data;
      
      // Applichiamo i filtri lato client
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filteredData = filteredData.filter(item => {
            // Gestiamo il caso speciale del nome completo
            if (key === 'fullName') {
              const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
              return fullName.includes(value.toLowerCase());
            }
            // Per gli altri campi, filtriamo normalmente
            return String(item[key]).toLowerCase().includes(value.toLowerCase());
          });
        }
      });

      setData(filteredData);
      setPageCount(result.total_pages);
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
      <h1>Persone</h1>
      <Table
        data={data}
        columns={columns}
        pageCount={pageCount}
        onPaginationChange={handlePaginationChange}
        isLoading={loading}
        initialPageSize={10}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        enableColumnResizing={true}
      />
    </div>
  );
};

export default PeoplePage;
