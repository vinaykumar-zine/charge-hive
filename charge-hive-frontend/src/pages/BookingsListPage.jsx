import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookingTable from "../components/BookingTable";
import apiService from "../services/api";

function BookingsListPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiService.getMyBookings(userId);
        console.log("Fetched bookings:", response);
        const formattedBookings = (response || []).map(b => ({
          id: b.id,
          user: "You",
          station: b.stationName,
          slotTime: `${new Date(b.startTime).toLocaleString()} (${b.duration} mins)`,
          status: b.status === "BOOKED" ? "Upcoming" : b.status,
        }));

        // Merge just booked state if available
        if (state?.justBooked && state.booking) {
          setBookings([{ ...state.booking, user: "You" }, ...formattedBookings]);
        } else {
          setBookings(formattedBookings);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userId, state]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Your Bookings</h1>
            <p className="text-gray-600">Manage and view your charging bookings.</p>
          </div>
          <button
            className="px-4 py-2 border rounded-md text-green-700 border-green-200 hover:bg-green-50"
            onClick={() => navigate("/stations")}
          >
            Find stations
          </button>
        </header>

        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <BookingTable
            bookings={bookings}
            onCancel={(id) => console.log("Cancel booking", id)}
            onComplete={(id) => console.log("Complete booking", id)}
          />
        )}
      </main>
    </div>
  );
}

export default BookingsListPage;
