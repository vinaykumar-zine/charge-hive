import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import StationMap from "../components/StationMap";
import axios from "axios";
import apiService from "../services/api";

function StationDetailsPage() {
    const { stationId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [stationData, setStationData] = useState(state?.station || null);
    const [loading, setLoading] = useState(!state?.station);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!stationData) {
            setLoading(true);
            apiService.getStationById(stationId)
                .then((res) => setStationData(res.data))
                .catch(() => setError("Station not found"))
                .finally(() => setLoading(false));
        }
    }, [stationId, stationData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="max-w-5xl mx-auto px-4 py-8">Loading...</main>
            </div>
        );
    }

    if (error || !stationData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="max-w-5xl mx-auto px-4 py-8">
                    <button
                        className="text-green-700 hover:underline"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <div className="mt-6 bg-white rounded-lg shadow p-6">{error}</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <button
                    className="text-green-700 hover:underline"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                {/* Station Header */}
                <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">
                            {stationData.stationName}
                        </h1>
                        <p className="text-gray-600">{stationData.address}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Total Ports</div>
                        <div className="text-2xl font-bold text-green-700">
                            {stationData.ports?.length || 0}
                        </div>
                    </div>
                </header>

                {/* Map */}
                <section>
                    <StationMap stations={[stationData]} />
                </section>

                {/* Station Details */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-3">Station Details</h2>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>
                            <strong>City:</strong> {stationData.city}
                        </li>
                        <li>
                            <strong>State:</strong> {stationData.state}
                        </li>
                        <li>
                            <strong>Address:</strong> {stationData.address}
                        </li>
                    </ul>
                </section>

                {/* Ports Table */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Available Ports</h2>
                    {stationData.ports && stationData.ports.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-green-100 text-green-900">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Connector Type</th>
                                        <th className="py-2 px-4 text-left">Max Power (kW)</th>
                                        <th className="py-2 px-4 text-left">Price/hr (₹)</th>
                                        <th className="py-2 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stationData.ports.map((port) => (
                                        <tr
                                            key={port.id}
                                            className="border-t border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="py-2 px-4">{port.connectorType}</td>
                                            <td className="py-2 px-4">{port.maxPowerKw}</td>
                                            <td className="py-2 px-4">
                                                {port.pricePerHour || "Free"}
                                            </td>
                                            <td className="py-2 px-4 text-right">
                                                <button
                                                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                                    onClick={() =>
                                                        navigate(`/book/${stationData.stationId}`, {
                                                            state: { station: stationData, port },
                                                        })
                                                    }
                                                >
                                                    Book
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No ports available at this station.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default StationDetailsPage;
