import React, { useState, useEffect } from 'react';
import { Zap, DollarSign, MapPin, Power, PlusCircle, Trash2 } from 'lucide-react';
import StatItem from '../components/StatItem';
import apiService from "../services/api";
import AddPortModal from '../components/AddPortModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import StationForm from '../components/StationForm';

// Import mock data and helpers
// import { initialStations } from "../assets/mockData";
import { formatCurrency } from '../assets/helper';

export default function OwnerDashBoardPage() {
    // const [stations, setStations] = useState(initialStations);
    const [stations, setStations] = useState([]);
    const [isAddPortModalOpen, setAddPortModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);
    const [stationToDelete, setStationToDelete] = useState(null);
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showStationForm, setShowStationForm] = useState(false);
    const [editingStation, setEditingStation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Calculate overall stats from the stations state
    // const totalEarnings = stations.reduce((acc, station) => acc + station.earnings, 0);
    const totalStations = stations.length;
    const totalPorts = stations.reduce((acc, station) => acc + station.ports.length, 0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch stations based on user role
            let stationsData = [];
            if (user?.userRole === 'ADMIN') {
                stationsData = await apiService.getAllStations();
            } else {
                stationsData = await apiService.getStationsByOwner(user?.id);
            }

            // console.log(stationsData);

            setStations(stationsData);

            const allBookings = [];
            if (stationsData && stationsData.length > 0) {

                for (const station of stationsData) {
                    const bookingsForStation = await apiService.getBookingsByStationId(station.id);

                    allBookings.push(...bookingsForStation);
                }
            }

            setBookings(allBookings);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    // --- Modal Handlers ---
    const handleOpenAddPortModal = (station) => {
        setSelectedStation(station);
        setAddPortModalOpen(true);
    };
    const handleOpenDeleteModal = (station) => {
        setStationToDelete(station);
        setDeleteModalOpen(true);
    };

    const handleAddStation = () => {
        setEditingStation(null);
        setShowStationForm(true);
    };


    const handleCreateStation = async (stationData) => {
        try {
            setIsSubmitting(true);
            await apiService.createStation(stationData);
            setShowStationForm(false);
            await fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error creating station:', error);
            setError('Failed to create station. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditStation = (station) => {
        setEditingStation(station);
        setShowStationForm(true);
    };

    const handleUpdateStation = async (stationData) => {
        try {
            setIsSubmitting(true);
            await apiService.updateStation(editingStation.id, stationData);
            setShowStationForm(false);
            setEditingStation(null);
            await fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error updating station:', error);
            setError('Failed to update station. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseStationForm = () => {
        setShowStationForm(false);
        setEditingStation(null);
    };

    // --- CRUD Operations ---
    const handleAddPort = async (stationId, newPort) => {
        console.log("newport", newPort);
        console.log("id", stationId);
        try {
            setIsSubmitting(true);
            await apiService.createPort(stationId, newPort);
            setShowStationForm(false);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error creating station:', error);
            setError('Failed to create station. Please try again.');
        } finally {
            setIsSubmitting(false);
            setAddPortModalOpen(false);
        }
    };


    const handleDeleteStation = async () => {
        if (stationToDelete) {
            try {
                setIsSubmitting(true);
                await apiService.deleteStation(stationToDelete.id);
                setDeleteModalOpen(false);
                setStationToDelete(null);
                await fetchDashboardData();
            } catch (error) {
                console.error('Error deleting station:', error);
                setError('Failed to delete station. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const getStationEarning = (id) => {
        const stationBookings = bookings.filter((booking) => booking.stationId === id);
        const totalCost = stationBookings.reduce((acc, curr) => acc + curr?.totalCost, 0);
        return formatCurrency(totalCost);
    };

    const getTotalEarning = () => {
        const totalCost = bookings.reduce((acc, curr) => acc + curr?.totalCost, 0);
        return formatCurrency(totalCost);
    };


    return (
        <main className="bg-gray-50 min-h-screen font-sans">
            <div className="fixed w-full z-10">
                <Navbar />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8">
                    <p className="text-lg text-gray-600 mt-1">Your charging network overview.</p>
                </header>

                {/* Stats Row */}
                <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
                    <StatItem icon={<DollarSign size={22} />} title="Total Earnings" value={getTotalEarning()} />
                    <StatItem icon={<MapPin size={22} />} title="Total Stations" value={totalStations} />
                    <StatItem icon={<Power size={22} />} title="Total Ports" value={totalPorts} />
                </div>

                {/* Stations Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Your Stations</h2>
                        {user?.role !== 'USER' && (
                            <button
                                onClick={handleAddStation}
                                className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full shadow-sm transition hover:bg-green-200"
                            >
                                + Add New Station
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Station Name</th>
                                    <th className="p-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Earnings</th>
                                    <th className="p-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Ports</th>
                                    <th className="p-6 text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stations.map((station) => (
                                    <tr key={station.id}>
                                        <td className="p-6"><p className="font-bold text-gray-900">{station.name}</p><p className="text-sm text-gray-500">{station.location}</p></td>
                                        <td className="p-6 font-medium text-gray-800">{getStationEarning(station.id)}</td>
                                        <td className="p-6">
                                            <div className="space-y-3">
                                                {station.ports.map((port) => (
                                                    <div key={port.id} className="flex items-center space-x-3 text-sm">
                                                        <Zap size={16} className="text-gray-400" />
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{port.connectorType || port.type}</p>
                                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                                <span>{port.maxPowerKw || port.power} kW</span>
                                                                <span className="text-gray-300">•</span>
                                                                <span>₹{port.pricePerHour || port.price}/hr</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => handleEditStation(station)} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">Edit</button>
                                                <button onClick={() => handleOpenAddPortModal(station)} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"><PlusCircle size={16} /><span>Add Port</span></button>
                                                <button onClick={() => handleOpenDeleteModal(station)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddPortModal
                isOpen={isAddPortModalOpen}
                onClose={() => setAddPortModalOpen(false)}
                station={selectedStation}
                onAddPort={handleAddPort}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                station={stationToDelete}
                onDelete={handleDeleteStation}
            />

            {/* Station Form Modal */}
            {showStationForm && (
                <StationForm
                    station={editingStation}
                    onSubmit={editingStation ? handleUpdateStation : handleCreateStation}
                    onCancel={handleCloseStationForm}
                    isLoading={isSubmitting}
                />
            )}
        </main>
    );
}
