import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import useWeather from "../hooks/useWeather";
import History from "../components/History";
import Weather from "./Weather";
import Favorites from "../components/Favorites";
import api from "../api/api";

function Home() {
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("weatherHistory")) || []
  );
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState('');
  const [mobileTab, setMobileTab] = useState('history');
  const weather = useWeather();
  const location = useLocation();

  useEffect(() => {
    fetchFavorites();
    if (location.state?.selectedCity) {
      handleCityAction(location.state.selectedCity);
    }
  }, [location.state]);

  const fetchFavorites = useCallback(async () => {
    try {
      setFavoritesLoading(true);
      const { data } = await api.get("/favorites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setFavorites(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setFavoritesError('');
    } catch (err) {
      setFavoritesError(err.response?.data?.error || 'Error cargando favoritos');
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  const handleCityAction = async (cityData) => {
    try {
      const newCity = `${cityData.name},${cityData.country || ''}`.replace(/,\s*$/, '');
      weather.setCity(newCity);
      const success = await weather.handleSearch(null, newCity);

      if (success) {
        const updatedHistory = [
          newCity,
          ...history.filter(item => 
            item.toLowerCase() !== newCity.toLowerCase()
          )
        ].slice(0, 30);
        setHistory(updatedHistory);
        localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Contenido principal con padding superior */}
      <div className="flex-1 min-w-0 pt-24"> {/* Added pt-24 */}
        <Weather 
          {...weather}
          favorites={favorites}
          onCitySelect={handleCityAction}
          onFavoriteUpdate={fetchFavorites}
        />
      </div>

      {/* Panel lateral desktop con margen superior y ajuste de altura */}
      <div className="hidden lg:flex flex-col gap-4 w-80 mt-24 flex-shrink-0 pr-4"> {/* Added mt-24 and pr-4 */}
        <div className="bg-white rounded-xl shadow-lg p-4 h-[calc(100vh-35rem)] flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Historial</h3>
          <div className="flex-1 overflow-y-auto">
            <History history={history} onHistoryClick={handleCityAction} />
          </div>
          <Link 
            to="/table/history"
            className="mt-2 text-blue-500 text-sm hover:underline"
          >
            Ver tabla completa →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 h-[calc(100vh-35rem)] flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Favoritos</h3>
          <div className="flex-1 overflow-y-auto">
            <Favorites 
              favorites={favorites} 
              loading={favoritesLoading}
              error={favoritesError}
              onSelectCity={handleCityAction}
              onUpdate={fetchFavorites}
            />
          </div>
          <Link 
            to="/table/favorites"
            className="mt-2 text-blue-500 text-sm hover:underline"
          >
            Ver tabla completa →
          </Link>
        </div>
      </div>

      {/* Versión móvil/tablet - Sin cambios */}
      <div className="lg:hidden p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex border-b mb-3">
            <button
              onClick={() => setMobileTab('history')}
              className={`px-4 py-2 font-medium ${
                mobileTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Historial
            </button>
            <button
              onClick={() => setMobileTab('favorites')}
              className={`px-4 py-2 font-medium ${
                mobileTab === 'favorites'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Favoritos
            </button>
          </div>

          <div className="h-[40vh] overflow-y-auto">
            {mobileTab === 'history' ? (
              <>
                <History history={history} onHistoryClick={handleCityAction} />
                <Link 
                  to="/table/history"
                  className="mt-2 text-blue-500 text-sm hover:underline block"
                >
                  Ver historial completo →
                </Link>
              </>
            ) : (
              <>
                <Favorites 
                  favorites={favorites} 
                  loading={favoritesLoading}
                  error={favoritesError}
                  onSelectCity={handleCityAction}
                  onUpdate={fetchFavorites}
                />
                <Link 
                  to="/table/favorites"
                  className="mt-2 text-blue-500 text-sm hover:underline block"
                >
                  Ver favoritos completos →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;