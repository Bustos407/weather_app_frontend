// useWeather.js
import { useState } from "react";
import api from "../api/api";

function useWeather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  
  const handleSearch = async (e, cityParam) => {
    if (e?.preventDefault) e.preventDefault();
    const searchCity = cityParam || city;

    if (!userId) {
      setError("Debes iniciar sesión para buscar");
      return false;
    }

    try {
      const response = await api.get(`/weather/${searchCity}`);
      setWeatherData(response.data);
      setError(null);
      setSuggestions([]);
      checkFavoriteStatus(response.data.city); // Verificar favorito
      return true;
    } catch (error) {
      setError(error.response?.data?.error || "Error al buscar clima");
      return false;
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setError(null);

    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        if (value.length >= 3) fetchSuggestions(value);
        setSelectedSuggestionIndex(0);
      }, 300)
    );
  };


  const fetchSuggestions = async (query) => {
    try {
      const response = await api.get(`/weather/autocomplete/${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      setSuggestions([]);
    }
  };


  const handleKeyEvents = (e) => {
    if (!suggestions.length) return;

    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      const lastIndex = suggestions.length - 1;
      setSelectedSuggestionIndex(prev => {
        return e.key === "ArrowDown" 
          ? prev < lastIndex ? prev + 1 : 0 
          : prev > 0 ? prev - 1 : lastIndex;
      });
    }
  };

  
  const checkFavoriteStatus = async (city) => {
    if (!city) return;
    try {
      const res = await api.get("/favorites/check", {
        params: { city: city.trim().toLowerCase() },
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(res.data.isFavorite);
    } catch (error) {
      console.error("Error verificando favorito:", error.message);
      setIsFavorite(false);
    }
  };

  const handleFavorite = async () => {
    if (!userId) return (window.location.href = "/login");

    try {
      const cityName = weatherData.city.trim();
      
      if (isFavorite) {
        const favToDelete = await api.get(`/favorites/by-city/${encodeURIComponent(cityName)}`);
        await api.delete(`/favorites/${favToDelete.data.id}`);
      } else {
        await api.post("/favorites", { city: cityName });
      }
      
      setIsFavorite(!isFavorite);
      return true;
    } catch (error) {
      console.error("Error favorito:", error);
      setIsFavorite(prev => !prev);
      return false;
    }
  };

  return {
    city,
    setCity,
    weatherData,
    error,
    suggestions,
    isFavorite,
    selectedSuggestionIndex,
    handleCityChange,
    handleSearch,
    handleKeyEvents,
    handleFavorite,
    setSelectedSuggestionIndex
  };
}

export default useWeather;