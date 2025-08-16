import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

function StationTable({ stations, onAddStation, onEditStation, onDeleteStation, userRole }) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'online':
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'offline':
            case 'unavailable':
                return 'bg-red-50 text-red-600';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (station) => {
        if (!station.isAvailable) return 'Offline';
        if (station.status === 'APPROVED') return 'Online';
        if (station.status === 'PENDING') return 'Pending Approval';
        return 'Online';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-green-800">Stations</h2>
                {userRole !== 'USER' && (
                    <button
                        onClick={onAddStation}
                        className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full shadow-sm transition hover:bg-green-200"
                    >
                        + Add New Station
                    </button>
                )}
            </div>
            <div className="overflow-y-auto max-h-72 rounded">
                <table className="min-w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Name</th>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Location</th>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Status</th>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Ports</th>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Rate (kW)</th>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Price/hr</th>
                            <th className="px-3 py-2 sticky top-0 bg-white z-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stations.length ? (
                            stations.map(station => (
                                <tr key={station.id} className="hover:bg-green-50 transition">
                                    <td className="px-3 py-2 text-green-900 font-medium">{station.name}</td>
                                    <td className="px-3 py-2 text-green-900">{station.location}</td>
                                    <td className="px-3 py-2">
                                        <span className={`inline-block px-3 py-1 rounded-lg font-medium text-xs ${getStatusColor(getStatusText(station))}`}>
                                            {getStatusText(station)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-green-900">{station.numberOfPorts || station.chargers || 0}</td>
                                    <td className="px-3 py-2 text-green-900">{station.chargingRate || 'N/A'}</td>
                                    <td className="px-3 py-2 text-green-900">₹{station.pricePerHour || 'N/A'}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                className="flex items-center gap-1 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-blue-100 transition"
                                                title="View Details"
                                                onClick={() => onEditStation && onEditStation(station)}
                                            >
                                                <FaEye className="text-sm" />
                                                View
                                            </button>
                                            {userRole !== 'USER' && (
                                                <>
                                                    <button
                                                        className="flex items-center gap-1 bg-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-yellow-100 transition"
                                                        title="Edit"
                                                        onClick={() => onEditStation && onEditStation(station)}
                                                    >
                                                        <FaEdit className="text-sm" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-red-100 transition"
                                                        title="Delete"
                                                        onClick={() => onDeleteStation && onDeleteStation(station.id)}
                                                    >
                                                        <FaTrash className="text-sm" />
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-400 py-8">
                                    No stations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StationTable;
