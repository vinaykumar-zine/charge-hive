import React from "react";

function StationFilters({ query, onQuery, maxPrice, onMaxPrice, geoError }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-72 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Max price/hr"
          className="w-40 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={maxPrice}
          onChange={(e) => onMaxPrice(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        {geoError && <span className="text-sm text-red-600">{geoError}</span>}
      </div>
    </div>
  );
}

export default StationFilters;


