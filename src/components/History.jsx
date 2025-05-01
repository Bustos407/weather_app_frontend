import "../Favorites.css";

function History({ history, onHistoryClick }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {history.slice(0, 12).map((cityData, index) => {
        const [name, country] =
          typeof cityData === "string"
            ? cityData.split(",").map((s) => s.trim())
            : [cityData.name, cityData.country];

        return (
          <li
            key={`${name}-${country}-${index}`}
            className="fade-slide-in"
            data-testid="history-item"
          >
            <button
              onClick={() => onHistoryClick({ name, country })}
              className="w-full text-left px-3 py-1.5 bg-white rounded-lg shadow transition-all hover:bg-gray-100 text-sm"
              title={`${name}, ${country}`}
            >
              <span className="block truncate">
                <span data-city="name">{name}</span>
                {country && <span className="text-gray-500">, {country}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default History;
