import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KPICards from "../components/KPICards";
import StationTable from "../components/StationTable";
import BookingTable from "../components/BookingTable";
import StationForm from "../components/StationForm";

function DashboardPage() {
    const { user } = useAuth();
    const [stations, setStations] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showStationForm, setShowStationForm] = useState(false);
    const [editingStation, setEditingStation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch stations based on user role
            let stationsData = [];
            if (user?.role === 'ADMIN') {
                stationsData = await apiService.getAllStations();
            } else {
                stationsData = await apiService.getStationsByOwner(user?.id);
            }

            setStations(stationsData);

            // Fetch bookings (placeholder for now)
            const bookingsData = await apiService.getBookings();
            setBookings(bookingsData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStation = async (stationData) => {
        try {
            setIsSubmitting(true);
            await apiService.createStation(stationData, user.id);
            setShowStationForm(false);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error creating station:', error);
            setError('Failed to create station. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStation = async (stationData) => {
        try {
            setIsSubmitting(true);
            await apiService.updateStation(editingStation.id, stationData, user.id);
            setShowStationForm(false);
            setEditingStation(null);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error updating station:', error);
            setError('Failed to update station. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStation = async (stationId) => {
        if (!window.confirm('Are you sure you want to delete this station?')) {
            return;
        }

        try {
            await apiService.deleteStation(stationId, user.id);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error deleting station:', error);
            setError('Failed to delete station. Please try again.');
        }
    };

    const handleEditStation = (station) => {
        setEditingStation(station);
        setShowStationForm(true);
    };

    const handleAddStation = () => {
        setEditingStation(null);
        setShowStationForm(true);
    };

    const handleCloseStationForm = () => {
        setShowStationForm(false);
        setEditingStation(null);
    };

    // Calculate stats from data
    const stats = {
        stations: stations.length,
        bookings: bookings.length,
        earnings: stations.reduce((sum, station) => sum + (station.earnings || 0), 0),
        activeUsers: stations.reduce((sum, station) => sum + (station.activeUsers || 0), 0),
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen">
                <div className="fixed w-full z-10">
                    <Navbar />
                </div>
                <div className="flex flex-1 pt-16 bg-gray-50">
                    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)]">
                        <Sidebar />
                    </div>
                    <main className="ml-56 flex-1 p-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading dashboard...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Fixed Navbar */}
            <div className="fixed w-full z-10">
                <Navbar />
            </div>

            {/* Main content with sidebar */}
            <div className="flex flex-1 pt-16 bg-gray-50">
                {/* Sidebar */}
                <div className="fixed left-0 top-16 h-[calc(100vh-4rem)]">
                    <Sidebar />
                </div>

                {/* Main section */}
                <main className="ml-56 flex-1 p-8 space-y-8">
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        {error}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KPI Cards */}
                    <KPICards stats={stats} />

                    {/* FIRST ROW: Station & Booking tables */}
                    <section className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {/* Station Table */}
                        <div className="min-h-[320px] max-h-[400px] overflow-auto">
                            <StationTable
                                stations={stations}
                                onAddStation={handleAddStation}
                                onEditStation={handleEditStation}
                                onDeleteStation={handleDeleteStation}
                                userRole={user?.role}
                            />
                        </div>

                        {/* Booking Table */}
                        <div className="min-h-[320px] max-h-[400px] overflow-auto">
                            <BookingTable bookings={bookings} />
                        </div>
                    </section>

                </main>
            </div>

            {/* Station Form Modal */}
            {showStationForm && (
                <StationForm
                    station={editingStation}
                    onSubmit={editingStation ? handleUpdateStation : handleCreateStation}
                    onCancel={handleCloseStationForm}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
}

export default DashboardPage;
