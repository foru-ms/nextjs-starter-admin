// pages/[model].js
import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Navbar from '../components/Navbar';
import { fetchData } from '../utils/api';

const ModelPage = ({ model }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetchData(model);
        console.log('Fetched data:', response);
        
        setData(response);
        
        if (response.length > 0) {
          const columns = Object.keys(response[0]).map((key) => ({
            Header: key,
            accessor: key,
            Cell: ({ value }) => typeof value === 'object' && value !== null
              ? <button onClick={() => openModal(value)}>View JSON</button>
              : value,
          }));
          console.log('Columns:', columns);
          setColumns(columns);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchModelData();
  }, [model]);

  return (
    <>
      <Navbar models={['thread', 'post', 'user']} />
      <DataTable columns={columns} data={data} model={model} />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { model } = params;
  return {
    props: {
      model,
    },
  };
}

export default ModelPage;
