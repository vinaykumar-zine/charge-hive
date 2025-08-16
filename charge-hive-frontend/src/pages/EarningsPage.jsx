import React from "react";
import Navbar from "../components/Navbar";
import EarningsChart from "../components/EarningsChart";

function EarningsPage() {
  const dummy = [
    { name: "Station A", earnings: 1200 },
    { name: "Station B", earnings: 900 },
    { name: "Station C", earnings: 1500 },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-green-800">Earnings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <EarningsChart data={dummy} />
        </div>
      </main>
    </div>
  );
}

export default EarningsPage;


