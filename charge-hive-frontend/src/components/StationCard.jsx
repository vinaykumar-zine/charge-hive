import React from "react";
import { useNavigate } from "react-router-dom";

function StationCard({ station }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-8/12">
          <h3 className="text-lg font-semibold text-green-900">{station.name}</h3>
          <p className="text-sm text-gray-600">
            {station.address}, {station.city}, {station.state} - {station.postalCode}
          </p>
        </div>
        {station.isApproved ? (
          <span className="w-32 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Approved
          </span>
        ) : (
          <span className="w-32 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
            Pending Approval
          </span>
        )}
      </div>

      <div className="text-sm text-gray-700">
        <p>Total Ports: {station.ports?.length || 0}</p>
      </div>

      {/* <div className="flex gap-2 mt-2">
        <button
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          onClick={() => navigate(`/book/${station.id}`, { state: { station } })}
        >
          Book
        </button>
        <button
          className="px-4 py-2 rounded-md border text-green-700 border-green-200 hover:bg-green-50"
          onClick={() => navigate(`/stations/${station.id}`, { state: { station } })}
        >
          Details
        </button>
      </div> */}
      <div className="flex gap-2 mt-2">
        <button
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          onClick={() => navigate(`/stations/${station.id}`, { state: { station } })}
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default StationCard;



