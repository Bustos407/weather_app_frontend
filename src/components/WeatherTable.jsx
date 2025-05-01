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
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[30%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Ciudad
              </th>
              <th className="w-[20%] hidden sm:table-cell px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Temp (°C/°F)
              </th>
              <th className="w-[15%] hidden md:table-cell px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Humedad
              </th>
              <th className="w-[20%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Viento
              </th>
              <th className="w-[15%] hidden lg:table-cell px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
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
                  <td className="w-[30%] px-4 py-3 text-base text-gray-900 font-medium">
                    <div className="flex flex-col">
                      <span className="whitespace-nowrap">{city}</span>
                      {country && (
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {country}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="w-[20%] hidden sm:table-cell px-4 py-3 text-base text-gray-900 whitespace-nowrap">
                    {item.temperature?.celsius}°C / {item.temperature?.fahrenheit}°F
                  </td>
                  <td className="w-[15%] hidden md:table-cell px-4 py-3 text-base text-gray-900">
                    {item.humidity}%
                  </td>
                  <td className="w-[20%] px-4 py-3 text-base text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>{item.windSpeed} km/h</span>
                      <span className="hidden sm:inline text-sm text-gray-500">
                        {item.windDirection}
                      </span>
                    </div>
                  </td>
                  <td className="w-[15%] hidden lg:table-cell px-4 py-3 text-base text-gray-900 whitespace-nowrap">
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

      {/* Paginación (mismo código anterior) */}
    </div>
  );
}

export default WeatherTable;