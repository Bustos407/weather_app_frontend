import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import WeatherTable from "../components/WeatherTable";
import DetailItem from "../components/DetailItem";

function Weather({
  city,
  weatherData,
  error,
  suggestions,
  handleCityChange,
  handleSearch,
  handleKeyEvents,
  selectedSuggestionIndex,
  onCitySelect,
  onFavoriteUpdate,
  favorites,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isTableView = location.pathname.includes("/table/");

  const handleKeyPress = (e) => {
    handleKeyEvents(e);

    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const selectedCity =
          selectedSuggestionIndex === -1
            ? suggestions[0]
            : suggestions[selectedSuggestionIndex];
        onCitySelect(selectedCity);
      }
      handleSearch(e);
    }
  };

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!weatherData?.city?.trim()) return;

      const cityCountry = weatherData.city.trim().toLowerCase();
      try {
        const res = await api.get("/favorites/check", {
          params: { city: cityCountry },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(res.data.isFavorite);
      } catch (err) {
        setIsFavorite(false);
        console.error("Error verificando favorito:", err.message);
      }
    };

    checkIfFavorite();
  }, [weatherData?.city, favorites, token]);

  const handleFavoriteClick = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    try {
      const exists = isFavorite;
      setIsFavorite(!exists);
      const cityName = weatherData.city.trim().toLowerCase();

      if (exists) {
        const favToDelete = favorites.find(
          (fav) => fav.city.toLowerCase() === cityName
        );
        await api.delete(`/favorites/${favToDelete.id}`, {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(
          "/favorites",
          { city: weatherData.city.trim(), userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      onFavoriteUpdate();
    } catch (err) {
      setIsFavorite((prev) => !prev);
      alert(err.response?.data?.error || "Error al actualizar favoritos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Barra superior con botón de cerrar sesión y búsqueda */}
      <div className="bg-white p-3 sm:p-4 shadow-md fixed w-full top-0 left-0 z-30 h-20 sm:h-24">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white p-2 sm:px-3 sm:py-2 rounded-lg 
                      flex items-center gap-1 transition-colors duration-200 text-xs sm:text-sm
                      flex-shrink-0"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 sm:h-5 sm:w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={city}
                  onChange={handleCityChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Ingrese ciudad"
                  className="w-full p-1.5 sm:p-2 border border-gray-300 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
                />
                
                {/* Sugerencias */}
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={`${suggestion.name}-${suggestion.country}`}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          index === selectedSuggestionIndex ? "bg-blue-50" : ""
                        } text-xs sm:text-sm`}
                        onClick={() => onCitySelect(suggestion)}
                      >
                        {`${suggestion.name}, ${suggestion.region} - ${suggestion.country}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 
                          rounded-md transition duration-300 whitespace-nowrap text-xs sm:text-sm 
                          w-full sm:w-auto"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contenido principal */}
      {!isTableView && (
        <div className="px-2 sm:px-3 flex justify-center pt-20 sm:pt-24">
          <div className="max-w-4xl w-full">
            {error && (
              <p className="text-red-500 mt-2 text-center text-xs sm:text-sm">
                {error}
              </p>
            )}

            {weatherData && (
              <div className="mt-2 sm:mt-4 bg-white p-3 sm:p-4 rounded-lg shadow-md mx-1 sm:mx-0">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="max-w-[calc(100%-60px)]">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                      {weatherData.city}
                    </h1>
                  </div>
                  <button
                    onClick={handleFavoriteClick}
                    className="text-2xl sm:text-3xl transition-transform hover:scale-110 flex-shrink-0"
                  >
                    {isFavorite ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                  <div className="md:col-span-2">
                    <div className="flex flex-col sm:flex-row items-center mb-2 sm:mb-3">
                      <img
                        src={weatherData.conditionIcon}
                        alt={weatherData.condition}
                        className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-0 sm:mr-2"
                      />
                      <div className="text-center sm:text-left">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                          {weatherData.temperature.celsius}°C
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          {weatherData.condition}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <DetailItem
                        title="Sensación"
                        value={`${weatherData.feelslike_c}°C`}
                        compact
                      />
                      <DetailItem
                        title="Humedad"
                        value={`${weatherData.humidity}%`}
                        compact
                      />
                      <DetailItem
                        title="Viento"
                        value={`${weatherData.windSpeed} km/h`}
                        compact
                      />
                      <DetailItem
                        title="Ráfagas"
                        value={`${weatherData.gust_kph} km/h`}
                        compact
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <DetailItem
                      title="Presión"
                      value={`${weatherData.pressure_mb} mb`}
                      compact
                    />
                    <DetailItem
                      title="Visibilidad"
                      value={`${weatherData.vis_km} km`}
                      compact
                    />
                    <DetailItem
                      title="Rocío"
                      value={`${weatherData.dewpoint_c}°C`}
                      compact
                    />
                    <DetailItem
                      title="UV"
                      value={weatherData.uv}
                      warning={weatherData.uv > 5 ? "Alto" : "Moderado"}
                      compact
                    />
                    <DetailItem
                      title="Nubes"
                      value={`${weatherData.cloud}%`}
                      compact
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isTableView && (
        <div className="pt-20 h-[calc(100vh-5rem)] w-full px-0 sm:px-2">
          <WeatherTable cities={[weatherData?.city]} />
        </div>
      )}
    </div>
  );
}

export default Weather;