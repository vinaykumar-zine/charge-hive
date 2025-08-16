import React, { useState } from 'react';
import { FaSpinner, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { PlusCircle, X } from 'lucide-react';

// Form for adding a new port to a station in a modal dialog.
// The form includes fields for selecting the connector type,
// entering the maximum power in kW, and setting the price per hour.
// It also includes validation to ensure that the inputs are valid numbers and positive values.
const AddPortModal = ({ station, isOpen, onClose, onAddPort }) => {
    const initialPortState = {
        connectorType: 'CCS-2',
        maxPowerKw: '',
        pricePerHour: ''
    };
    const [portData, setPortData] = useState(initialPortState);
    const [error, setError] = useState('');

    const connectorTypes = ["CCS-2", "CHAdeMO", "Type 2 AC", "GB/T", "Tesla NACS"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPortData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!portData.maxPowerKw || !portData.pricePerHour || isNaN(portData.maxPowerKw) || isNaN(portData.pricePerHour) || +portData.maxPowerKw <= 0 || +portData.pricePerHour <= 0) {
            setError("Please provide valid, positive numbers for power and price.");
            return;
        }

        // Pass the new port data up to the parent form
        onAddPort(station.id, {
            ...portData,
            maxPowerKw: parseFloat(portData.maxPowerKw),
            pricePerHour: parseFloat(portData.pricePerHour)
        });

        // Reset and close
        setError('');
        setPortData(initialPortState);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Port</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="connectorType" className="block text-sm font-medium text-gray-700 mb-1">Connector Type</label>
                            <select id="connectorType" name="connectorType" value={portData.connectorType} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                {connectorTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="maxPowerKw" className="block text-sm font-medium text-gray-700 mb-1">Max Power (kW)</label>
                            <input type="number" step="0.1" id="maxPowerKw" name="maxPowerKw" value={portData.maxPowerKw} onChange={handleChange} placeholder="e.g., 50" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div>
                            <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour (₹)</label>
                            <input type="number" step="0.01" id="pricePerHour" name="pricePerHour" value={portData.pricePerHour} onChange={handleChange} placeholder="e.g., 25.50" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center space-x-2">
                            <PlusCircle size={20} /><span>Add Port</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPortModal;