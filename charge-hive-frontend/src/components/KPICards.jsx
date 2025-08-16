import React from "react";
import { FaChargingStation, FaBookOpen, FaDollarSign, FaUsers } from "react-icons/fa";

function KPICards({ stats }) {
    const kpiData = [
        {
            label: "Total Stations",
            value: stats.stations ?? 0,
            icon: <FaChargingStation className="text-green-400 text-3xl mb-2" />,
            bg: "bg-green-50",
            border: "border-green-100",
            iconBg: "bg-green-100",
        },
        {
            label: "Today's Bookings",
            value: stats.bookings ?? 0,
            icon: <FaBookOpen className="text-emerald-400 text-3xl mb-2" />,
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            iconBg: "bg-emerald-100",
        },
        {
            label: "Total Earnings",
            value: `$${stats.earnings ?? 0}`,
            icon: <FaDollarSign className="text-lime-400 text-3xl mb-2" />,
            bg: "bg-lime-50",
            border: "border-lime-100",
            iconBg: "bg-lime-100",
        },
        {
            label: "Active Users",
            value: stats.activeUsers ?? 0,
            icon: <FaUsers className="text-teal-400 text-3xl mb-2" />,
            bg: "bg-teal-50",
            border: "border-teal-100",
            iconBg: "bg-teal-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-7">
            {kpiData.map((kpi) => (
                <div
                    key={kpi.label}
                    className={`
            ${kpi.bg} ${kpi.border}
            border rounded-lg shadow-sm p-6 flex flex-col items-center transition
          `}
                >
                    <div className={`rounded-full p-2 ${kpi.iconBg} mb-2`}>
                        {kpi.icon}
                    </div>
                    <div className="text-sm text-green-800 mt-1 mb-2 opacity-90">{kpi.label}</div>
                    <div className="text-3xl font-bold text-green-900">{kpi.value}</div>
                </div>
            ))}
        </div>
    );
}

export default KPICards;
