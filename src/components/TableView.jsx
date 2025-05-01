import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Corregido: añadir useNavigate
import api from '../api/api';
import WeatherTable from './WeatherTable';

function TableView() {
  const { type } = useParams();
  const navigate = useNavigate(); // Añadido el hook
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        
        const validCities = data.filter(c => typeof c === 'string');
        setCities(validCities);

        if (validCities.length > 0) {
          const { data: weather } = await api.post('/weather/bulk', { 
            cities: validCities,
            _: Date.now()
          });
          setWeatherData(weather);
        }
        
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
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 bg-gray-100">
      <div className="mb-4 space-y-2">
        <Link 
          to="/home" 
          className="text-blue-500 hover:underline inline-block text-sm sm:text-base"
        >
          &larr; Volver al clima actual
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {type === 'history' ? 'Historial Completo' : 'Tus Favoritos'}
        </h2>
      </div>
      
      {isMobile ? (
        <div className="grid gap-3">
          {weatherData.map((item, index) => {
            const [city, country] = item.city.split(',').map(s => s.trim());
            return (
              <div 
                key={index}
                className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  navigate('/home', { 
                    state: { selectedCity: { name: city, country } },
                    replace: true
                  });
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{city}</h3>
                    {country && <p className="text-gray-500 text-sm">{country}</p>}
                  </div>
                  <span className="text-xl">
                    {item.temperature?.celsius}°C
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>Humedad: {item.humidity}%</div>
                  <div>Viento: {item.windSpeed} km/h</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <WeatherTable cities={cities} />
        </div>
      )}
    </div>
  );
}

export default TableView;