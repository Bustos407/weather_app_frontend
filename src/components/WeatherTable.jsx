import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function WeatherTable({ cities }) {
  const [weatherData, setWeatherData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const validCities = cities
          .filter(c => typeof c === 'string')
          .map(c => c.trim())
          .filter(c => c !== '');

        const uniqueCities = [...new Set(validCities)];
        
        if (uniqueCities.length === 0) return;
        
        const { data } = await api.post('/weather/bulk', { 
          cities: uniqueCities,
          _: Date.now()
        });
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching bulk data:', error);
      }
    };
    fetchData();
  }, [cities]);

  const handleRowClick = (cityData) => {
    navigate('/home', { 
      state: { selectedCity: cityData },
      replace: true
    });
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(weatherData.length / itemsPerPage);
  const currentItems = weatherData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="overflow-x-auto h-full w-full">
      <table className="min-w-full divide-y divide-gray-200 ">
        <thead className="bg-gray-50 hidden sm:table-header-group">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp (°C/°F)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Humedad</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Viento</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((item, index) => {
            const [city, country] = item.city.split(',').map(s => s.trim());
            return (
              <tr 
                key={index}
                onClick={() => handleRowClick({ name: city, country })}
                className="hover:bg-gray-50 cursor-pointer transition-colors flex flex-col sm:table-row mb-2 sm:mb-0"
              >
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 font-bold sm:font-normal">
                  {city}{country && `, ${country}`}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 font-bold sm:font-normal">
                  {item.temperature?.celsius}°C / {item.temperature?.fahrenheit}°F
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 font-bold sm:font-normal">{item.humidity}%</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 font-bold sm:font-normal">{item.windSpeed} km/h</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 font-bold sm:font-normal">
                  {new Date(item.localTime).toLocaleTimeString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherTable;