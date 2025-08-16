import React from 'react';

/**
 * A badge component to display the status of a charging port with appropriate colors.
 */
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
    const statusStyles = {
        Available: "bg-green-100 text-green-800",
        Charging: "bg-blue-100 text-blue-800",
        Faulted: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

export default StatusBadge;
