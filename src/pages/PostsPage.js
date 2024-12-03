import { useState, useEffect, useCallback } from 'react';
import Table from '../components/Table';

function PostsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 100,
    },
    {
      header: 'Titolo',
      accessorKey: 'title',
      size: 300,
    },
    {
      header: 'Contenuto',
      accessorKey: 'body',
      size: 500,
    },
    {
      header: 'Utente ID',
      accessorKey: 'userId',
      size: 100,
    }
  ];

  const fetchData = useCallback(async (pagination) => {
    if (!pagination) return;
    
    const { pageIndex, pageSize } = pagination;
    setLoading(true);
    
    try {
      // Fetch total count and calculate pages
      const totalCountResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
      const totalData = await totalCountResponse.json();
      const totalCount = totalData.length;
      const newPageCount = Math.ceil(totalCount / pageSize);
      setPageCount(newPageCount);

      // Calculate start index
      const start = pageIndex * pageSize;

      // Fetch paginated data
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${pageSize}`
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

  // Initial data fetch
  useEffect(() => {
    fetchData({ pageIndex: 0, pageSize: 10 });
  }, [fetchData]);

  return (
    <div className="page">
      <h1>Posts</h1>
      
      <Table
        data={data}
        columns={columns}
        pageCount={pageCount}
        isLoading={loading}
        onPaginationChange={fetchData}
        initialPageSize={10}
        pageSizeOptions={[10, 20, 30, 40, 50]}
      />
    </div>
  );
}

export default PostsPage;
