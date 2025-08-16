import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Modal dialog to confirm deleting a station.
 */
const DeleteConfirmationModal = ({ isOpen, onClose, station, onDelete }) => {
    if (!isOpen || !station) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 size={32} className="text-red-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Delete Station?</h2>
                <p className="text-center text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{station.name}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onClose} className="px-8 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                    <button onClick={onDelete} className="px-8 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

