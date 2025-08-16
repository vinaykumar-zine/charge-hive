import React, { useMemo, useState } from "react";
import { replace, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import apiService from "../services/api";


const FALLBACK_STATIONS = [
  // { id: 1, name: "Connaught Place EV Hub", pricePerHour: 120, location: "Connaught Place, New Delhi" },
  // { id: 2, name: "Cyber City ChargePoint", pricePerHour: 180, location: "DLF Cyber City, Gurugram" },
  // { id: 3, name: "Noida Sector 18 Station", pricePerHour: 90, location: "Sector 18, Noida" },
  // { id: 4, name: "Saket Select City EV", pricePerHour: 150, location: "Saket, New Delhi" },
];

function BookingPage() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const station = useMemo(() => {
    if (state?.station) return state.station;
    const idNum = Number(stationId);
    return FALLBACK_STATIONS.find((s) => s.id === idNum) || null;
  }, [state, stationId]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  // duration in minutes; allow 30-min granularity, default 60
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = useMemo(() => {
    const ratePerHour = station?.pricePerHour ?? 0;
    const hours = Number(durationMinutes || 0) / 60;
    return Math.round(ratePerHour * hours);
  }, [durationMinutes, station]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!station) {
      setError("Station not found");
      return;
    }

    if (!date || !startTime) {
      setError("Please select a date and start time");
      return;
    }

    // Build start and end Date objects
    const startDateObj = new Date(`${date}T${startTime}`);
    if (isNaN(startDateObj.getTime())) {
      setError("Invalid date/time");
      return;
    }
    if (startDateObj < new Date()) {
      setError("Start time must be in the future");
      return;
    }
    const endDateObj = new Date(startDateObj.getTime() + durationMinutes * 60000);

    const pad = (n) => String(n).padStart(2, '0');
    const formatLocalDateTime = (d) => {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const formattedStart = formatLocalDateTime(startDateObj);
    const formattedEnd = formatLocalDateTime(endDateObj);

    try {
      setSubmitting(true);
      const bookingData = {
        stationId: station.id ?? station.stationId ?? Number(stationId),
        portId: state?.port?.id ?? undefined,
        startTime: formattedStart,
        endTime: formattedEnd,
        duration: Number(durationMinutes),
        totalCost: Number(totalPrice),
        vehicleNumber: vehicleNumber || undefined,
      };

      // remove undefined values
      Object.keys(bookingData).forEach((k) => bookingData[k] === undefined && delete bookingData[k]);

      console.log("Booking payload (DTO-like):", bookingData);
      const response = await apiService.createBooking(bookingData);
      navigate(
        "/bookings",
        {
          state: { justBooked: true, booking: response },
        },
        { replace: true }
      );
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="text-green-700 hover:underline mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-1">Book Charging Slot</h1>
          <p className="text-gray-600 mb-6">{station ? station.name : "Loading station..."}</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start time</label>
                <input
                  type="time"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <select
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1 hour 30 minutes</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle number</label>
                <input
                  type="text"
                  placeholder="e.g. DL 01 AB 1234"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-gray-50 border rounded-md p-4 flex items-center justify-between">
              <div className="text-gray-700 text-sm">
                <div>Rate: ₹{station?.pricePerHour ?? 0}/hr</div>
                <div>Selected: {durationMinutes} minutes</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Estimated total</div>
                <div className="text-2xl font-bold text-green-700">₹{totalPrice}</div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              // disabled={submitting}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default BookingPage;


