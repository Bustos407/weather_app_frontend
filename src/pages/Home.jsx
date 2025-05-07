import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [favoritesError, setFavoritesError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const weather = useWeather();
  const location = useLocation();
  const navigate = useNavigate();

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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavorites(
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      setFavoritesError("");
    } catch (err) {
      setFavoritesError(
        err.response?.data?.error || "Error cargando favoritos"
      );
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  const handleCityAction = async (cityData) => {
    try {
      const newCity = `${cityData.name},${cityData.country || ""}`.replace(
        /,\s*$/,
        ""
      );
      weather.setCity(newCity);
      const success = await weather.handleSearch(null, newCity);

      if (success) {
        const updatedHistory = [
          newCity,
          ...history.filter(
            (item) => item.toLowerCase() !== newCity.toLowerCase()
          ),
        ].slice(0, 30);
        setHistory(updatedHistory);
        localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Botón del menú hamburguesa */}

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-25 left-4 z-50 lg:hidden p-3 bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">☰</span>
          <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
            Menú
          </span>
        </div>
      </button>

      {/* Fondo oscuro */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Barra lateral móvil */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl border-r border-gray-100 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          {/* Encabezado */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Menú</h2>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col gap-4">
            <Link
              to="/table/history"
              onClick={() => setIsSidebarOpen(false)}
              className="text-xl p-4 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">📜</span>
              Historial completo
            </Link>

            <Link
              to="/table/favorites"
              onClick={() => setIsSidebarOpen(false)}
              className="text-xl p-4 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">⭐</span>
              Tus favoritos
            </Link>
          </div>

          {/* Pie de página fijo */}
          <div className="border-t pt-4 mt-4">
            <button
              onClick={handleLogout}
              className="w-full text-xl p-4 hover:bg-red-50 text-red-600 rounded-xl transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">🚪</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      {/* Contenido principal */}
      <div className="flex-1 min-w-0 pt-16 lg:pt-24 lg:pr-4 relative">
        <Weather
          {...weather}
          favorites={favorites}
          onCitySelect={handleCityAction}
          onFavoriteUpdate={fetchFavorites}
        />
      </div>

      {/* Panel lateral desktop */}
      <div className="hidden lg:flex flex-col gap-4 w-80 mt-24 flex-shrink-0 pr-4">
        <div className="bg-white rounded-xl shadow-lg p-4 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Historial</h3>
            <Link
              to="/table/history"
              className="text-blue-500 text-sm hover:underline"
            >
              Ver completo →
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <History history={history} onHistoryClick={handleCityAction} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Favoritos</h3>
            <Link
              to="/table/favorites"
              className="text-blue-500 text-sm hover:underline"
            >
              Ver completo →
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Favorites
              favorites={favorites}
              loading={favoritesLoading}
              error={favoritesError}
              onSelectCity={handleCityAction}
              onUpdate={fetchFavorites}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
