import { useEffect, useState } from 'react';
import api from '../api/api';
import '../Favorites.css';

function Favorites({ onSelectCity, onUpdate, favorites = [], loading = false, error = null }) {
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem("token")) {
      window.location.href = '/login';
    }
  }, []);

  const handleRemove = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      onUpdate?.();
    } catch (err) {
      console.error("Error eliminando:", err);
      alert(err.response?.data?.error || "Error al eliminar favorito");
    }
  };

  const handleSelectCity = async (cityData) => {
    if (isSelecting) return;
    setIsSelecting(true);
    
    try {
      await onSelectCity?.(cityData);
    } catch (err) {
      console.error("Error al seleccionar ciudad:", err);
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-gray-500 text-sm">Cargando...</div>
      ) : (
        <>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {favorites.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay ciudades favoritas</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {favorites.map((fav) => (
                <li key={fav.id} className="fade-slide-in" data-testid="favorite-item">
                  <div
                    onClick={() => handleSelectCity({ 
                      name: fav.city.split(',')[0], 
                      country: fav.city.split(',')[1] 
                    })}
                    className="group flex justify-between items-center bg-white rounded-lg shadow px-3 py-1.5 transition-all hover:bg-gray-100 w-full cursor-pointer"
                  >
                    <span className="w-full text-sm text-gray-700 font-medium truncate">
                      {fav.city}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(fav.id);
                      }}
                      className="text-red-500 text-sm ml-2"
                      data-testid="delete-button"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Favorites;