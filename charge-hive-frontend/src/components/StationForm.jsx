import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';

const StationForm = ({ station = null, onSubmit, onCancel, isLoading = false }) => {
    // Initialize state to match the CreateStationRequestDto structure
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        // The form will manage a single port's data, which will be sent in an array.
        ports: [{
            connectorType: 'CCS-2',
            maxPowerKw: '',
            pricePerHour: ''
        }]
    });

    const [errors, setErrors] = useState({});

    // Effect to populate form when editing an existing station
    useEffect(() => {
        if (station) {
            setFormData({
                name: station.name || '',
                address: station.address || '',
                city: station.city || '',
                state: station.state || '',
                postalCode: station.postalCode || '',
                latitude: station.latitude || '',
                longitude: station.longitude || '',
                // If editing, use the first port's data; otherwise, keep the initial state.
                ports: station.ports && station.ports.length > 0 ? station.ports : [{
                    connectorType: 'CCS-2',
                    maxPowerKw: '',
                    pricePerHour: ''
                }],
            });
        }
    }, [station]);

    // --- Handlers for main form fields ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // --- Handler for the single port's fields ---
    const handlePortChange = (e) => {
        const { name, value } = e.target;
        const updatedPorts = [{ ...formData.ports[0], [name]: value }];
        setFormData(prev => ({ ...prev, ports: updatedPorts }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // --- Form validation ---
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Station name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = 'Valid latitude is required';
        if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = 'Valid longitude is required';

        const port = formData.ports[0];
        if (!port.maxPowerKw || isNaN(port.maxPowerKw)) newErrors.maxPowerKw = 'Valid max power is required';
        if (!port.pricePerHour || isNaN(port.pricePerHour)) newErrors.pricePerHour = 'Valid price is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Form submission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Ensure numeric fields are correctly formatted as numbers
        const submitData = {
            ...formData,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            ports: [
                {
                    ...formData.ports[0],
                    maxPowerKw: parseFloat(formData.ports[0].maxPowerKw),
                    pricePerHour: parseFloat(formData.ports[0].pricePerHour),
                }
            ]
        };
        onSubmit(submitData);
    };

    const connectorTypes = ["CCS-2", "CHAdeMO", "Type 2 AC", "GB/T", "Tesla NACS"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {station ? 'Edit Station' : 'Add New Station'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* --- Station Details --- */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-800 mb-4">Station Info</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Station Name *</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., GreenCharge Hub" />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* --- Location Details --- */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-800 mb-4">Location</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder="123 Electric Avenue" />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="Mumbai" />
                                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`} placeholder="Maharashtra" />
                                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                                <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`} placeholder="400001" />
                                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                            </div>
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                                <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 19.0760" />
                                {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
                            </div>
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                                <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 72.8777" />
                                {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* --- Port Details --- */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-800 mb-4">Port Configuration</legend>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="connectorType" className="block text-sm font-medium text-gray-700 mb-2">Connector Type</label>
                                    <select id="connectorType" name="connectorType" value={formData.ports[0].connectorType} onChange={handlePortChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                        {connectorTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="maxPowerKw" className="block text-sm font-medium text-gray-700 mb-2">Max Power (kW) *</label>
                                    <input type="number" step="0.1" id="maxPowerKw" name="maxPowerKw" value={formData.ports[0].maxPowerKw} onChange={handlePortChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.maxPowerKw ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 50" />
                                    {errors.maxPowerKw && <p className="mt-1 text-sm text-red-600">{errors.maxPowerKw}</p>}
                                </div>
                                <div>
                                    <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour (₹) *</label>
                                    <input type="number" step="0.01" id="pricePerHour" name="pricePerHour" value={formData.ports[0].pricePerHour} onChange={handlePortChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.pricePerHour ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., 25.50" />
                                    {errors.pricePerHour && <p className="mt-1 text-sm text-red-600">{errors.pricePerHour}</p>}
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* --- Form Actions --- */}
                    <div className="flex justify-end space-x-4 pt-5 border-t">
                        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            {isLoading ? <FaSpinner className="animate-spin h-5 w-5" /> : (station ? 'Update Station' : 'Create Station')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StationForm;
