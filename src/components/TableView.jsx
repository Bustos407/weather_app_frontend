import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import WeatherTable from './WeatherTable';

function TableView() {
  const { type } = useParams();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        if (type === 'history') {
          const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
          data = history;
        } else if (type === 'favorites') {
          const response = await api.get('/favorites', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          data = response.data.map(fav => fav.city);
        }
        setCities(data.filter(c => typeof c === 'string'));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error cargando datos');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [type]);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 h-auto sm:h-screen flex flex-col w-full">
      <Link 
        to="/home" 
        className="mb-4 text-sm sm:text-base inline-block text-blue-500 hover:underline"
      >
        &larr; Volver al clima actual
      </Link>
      <h2 className="text-2xl font-bold mb-4">
        {type === 'history' ? 'Historial Completo' : 'Favoritos'}
      </h2>
      <div className="flex-1">
        <WeatherTable cities={cities} />
      </div>
    </div>
  );
}

export default TableView;