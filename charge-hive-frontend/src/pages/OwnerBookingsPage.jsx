import React from "react";
import Navbar from "../components/Navbar";
import BookingTable from "../components/BookingTable";

function OwnerBookingsPage() {
  const bookings = [
    { id: 1001, user: "Ravi", station: "Connaught Place EV Hub", slotTime: "2025-08-10 11:00 (1h)", status: "Upcoming" },
    { id: 1002, user: "Asha", station: "Cyber City ChargePoint", slotTime: "2025-08-06 14:00 (2h)", status: "Completed" },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-green-800">Owner Bookings</h1>
        <BookingTable bookings={bookings} />
      </main>
    </div>
  );
}

export default OwnerBookingsPage;


