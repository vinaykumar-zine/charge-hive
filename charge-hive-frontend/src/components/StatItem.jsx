import React from 'react';

/**
 * A reusable component to display a single statistic on the dashboard.
 */
const StatItem = ({ icon, title, value }) => (
    <div className="flex items-center space-x-3">
        <div className="rounded-full p-3 bg-green-100 text-green-600">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default StatItem;