
const SearchBar = (props) => {
  const { 
    setDestination, setArrival, setDeparture, setTravelers,
    destination, arrival, departure, travelers,
    handleSearch
  } = props;



  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col md:flex-row md:px-0 px-6 items-center bg-white md:rounded-full rounded-lg border shadow-md overflow-hidden w-full max-w-4xl">
        <div className="flex-1 md:w-auto w-full px-0 md:px-6 py-2 border-b md:border-b-0 md:border-r">
          <label className="block text-gray-500 text-sm font-medium">
            Destination
          </label>
          <input
            type="text"
            placeholder="Rechercher une destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="search-bar-input w-full bg-transparent outline-none border-none text-gray-700"
          />
        </div>
        <div className="flex-1 md:w-auto w-full px-0 md:px-6 py-2 border-b md:border-b-0 md:border-r">
          <label className="block text-gray-500 text-sm font-medium">
            Arrivée
          </label>
          <input
            type="date"
            placeholder="Quand ?"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="search-bar-input w-full bg-transparent outline-none border-none text-gray-700"
          />
        </div>
        <div className="flex-1 md:w-auto w-full px-0 md:px-6 py-2 border-b md:border-b-0 md:border-r">
          <label className="block text-gray-500 text-sm font-medium">
            Départ
          </label>
          <input
            type="date"
            placeholder="Quand ?"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="search-bar-input w-full bg-transparent outline-none border-none text-gray-700"
          />
        </div>
        <div className="flex-1 md:w-auto w-full px-0 md:px-6 py-2">
          <label className="block text-gray-500 text-sm font-medium">
            Voyageurs
          </label>
          <input
            type="number"
            placeholder="Ajouter des voyageurs"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            className="search-bar-input w-full bg-transparent outline-none border-none text-gray-700"
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center justify-center bg-pink-500 text-white p-3 rounded-full md:w-auto w-full m-2 md:ml-2 md:mr-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M15.25 10.5a4.75 4.75 0 11-9.5 0 4.75 4.75 0 019.5 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
