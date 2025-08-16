import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StationMap from "../components/StationMap";
import StationFilters from "../components/StationFilters";
import StationCard from "../components/StationCard";
import apiService from "../services/api";

function SearchStationsPage() {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null); // [lat, lng]
  const [geoError, setGeoError] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const matchesQuery = `${s.name} ${s.location}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesPrice =
        !maxPrice || (s.pricePerHour ?? 0) <= Number(maxPrice);
      return matchesQuery && matchesPrice;
    });
  }, [query, maxPrice, stations]);

  const fetchStations = async (latitude, longitude) => {
    try {
      setLoading(true);
      const data = await apiService.getNearbyStations(latitude, longitude, 5);
      console.log(`Fetched nearby stations`, data);
      setStations(data || []);
    } catch (error) {
      console.error('Error fetching stations:', error);
      // Fallback to getting all stations if nearby search fails
      try {
        const allStations = await apiService.getAllStations();
        setStations(allStations || []);
      } catch (error) {
        console.error('Error fetching all stations:', error);
        setStations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to get user location and fetch nearby stations
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setGeoError("");
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          localStorage.setItem("userLocation", JSON.stringify([lat, lng]));
          setCurrentLocation([lat, lng]);
          await fetchStations(lat, lng);
        },
        async (error) => {
          console.warn("Geolocation error:", error);
          setGeoError("Unable to retrieve your location.");
          
          // If we have a saved location, use it
          if (savedLocation) {
            const [lat, lng] = JSON.parse(savedLocation);
            setCurrentLocation([lat, lng]);
            await fetchStations(lat, lng);
          } else {
            // Fallback to getting all stations
            await fetchStations();
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setGeoError("Geolocation is not supported in this browser.");
      // Fallback to getting all stations
      fetchStations();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-green-800">
            Find Charging Stations
          </h1>
          <p className="text-gray-600">
            Search and book a nearby EV charging station.
          </p>
          <StationFilters
            query={query}
            onQuery={setQuery}
            maxPrice={maxPrice}
            onMaxPrice={setMaxPrice}
            geoError={geoError}
          />
        </header>

        <section>
          <StationMap
            stations={filteredStations}
            currentLocation={currentLocation}
            center={currentLocation}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
          {!filteredStations.length && (
            <div className="col-span-full text-center text-gray-500">
              No stations match your search.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SearchStationsPage;
