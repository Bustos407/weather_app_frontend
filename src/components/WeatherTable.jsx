// WeatherTable.jsx
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
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full">
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[500px]"> {/* Ancho mínimo para evitar pixelación */}
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[35%] px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Ciudad
                </th>
                <th className="w-[25%] px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase hidden sm:table-cell">
                  Temp (°C/°F)
                </th>
                <th className="w-[15%] px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase hidden md:table-cell">
                  Humedad
                </th>
                <th className="w-[25%] px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase">
                  Viento
                </th>
                <th className="w-[15%] px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item, index) => {
                const [city, country] = item.city.split(',').map(s => s.trim());
                return (
                  <tr 
                    key={index}
                    onClick={() => handleRowClick({ name: city, country })}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="w-[35%] px-2 sm:px-4 py-1.5 sm:py-3 text-sm sm:text-base text-gray-900">
                      <div className="flex flex-col">
                        <span className="truncate">{city}</span>
                        {country && (
                          <span className="text-xs sm:text-sm text-gray-500 truncate">
                            {country}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="w-[25%] px-2 sm:px-4 py-1.5 sm:py-3 text-sm sm:text-base text-gray-900 hidden sm:table-cell">
                      {item.temperature?.celsius}°C / {item.temperature?.fahrenheit}°F
                    </td>
                    <td className="w-[15%] px-2 sm:px-4 py-1.5 sm:py-3 text-sm sm:text-base text-gray-900 hidden md:table-cell">
                      {item.humidity}%
                    </td>
                    <td className="w-[25%] px-2 sm:px-4 py-1.5 sm:py-3 text-sm sm:text-base text-gray-900">
                      <div className="flex items-center gap-1">
                        <span>{item.windSpeed} km/h</span>
                        <span className="hidden xs:inline text-xs text-gray-500">
                          {item.windDirection}
                        </span>
                      </div>
                    </td>
                    <td className="w-[15%] px-2 sm:px-4 py-1.5 sm:py-3 text-sm sm:text-base text-gray-900 hidden lg:table-cell">
                      {new Date(item.localTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 pb-4 px-2 sm:px-0">
          <div className="flex justify-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`min-w-[1.75rem] px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherTable;