import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { FaDownload } from "react-icons/fa";

function EarningsChart({ data = [] }) {
    // Example: [{date: '2024-07-18', earnings: 120}, ...]
    const chartData = data.length
        ? data
        : [
            { date: "Mon", earnings: 120 },
            { date: "Tue", earnings: 210 },
            { date: "Wed", earnings: 90 },
            { date: "Thu", earnings: 160 },
            { date: "Fri", earnings: 170 },
            { date: "Sat", earnings: 230 },
            { date: "Sun", earnings: 200 },
        ];

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-green-700">Earnings</h2>

            <div className="h-56 w-full bg-gray-50 rounded flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="earnings" fill="#22c55e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition flex items-center gap-2"
            >
                <FaDownload />
                Download Statement
            </button>
        </div>
    );
}

export default EarningsChart;
