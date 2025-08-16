import React, { useEffect } from "react";


function statusColor(status) {
    switch (status) {
        case "Upcoming":
            return "bg-green-100 text-green-700";
        case "Completed":
            return "bg-blue-100 text-blue-700";
        case "Cancelled":
            return "bg-gray-200 text-gray-500";
        default:
            return "bg-gray-100 text-gray-600";
    }
}

function BookingTable({ bookings, onCancel, onComplete }) {
    const handleCancel = (bookingId) => {
        // if (window.confirm('Are you sure you want to cancel this booking?')) {
            onCancel(bookingId);
        // }
    };

    const handleComplete = (bookingId) => {
        // if (window.confirm('Mark this booking as completed?')) {
            onComplete(bookingId);
        // }
    };

    useEffect(() => {
        
    }, [BookingTable])

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Current Bookings</h2>
            <div className="max-h-80 overflow-y-auto rounded-b">
                <table className="min-w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="sticky top-0 bg-white z-1 px-3 py-2">Booking ID</th>
                            <th className="sticky top-0 bg-white z-1 px-3 py-2">User</th>
                            <th className="sticky top-0 bg-white z-1 px-3 py-2">Station</th>
                            <th className="sticky top-0 bg-white z-1 px-3 py-2">Slot Time</th>
                            <th className="sticky top-0 bg-white z-1 px-3 py-2">Status</th>
                            <th className="sticky top-0 bg-white z-1 px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={`${booking.id}-${booking.startTime}`} className="hover:bg-green-50 transition">
                                <td className="px-3 py-2">{booking.id}</td>
                                <td className="px-3 py-2">{booking.user}</td>
                                <td className="px-3 py-2">{booking.station}</td>
                                <td className="px-3 py-2">{booking.slotTime}</td>
                                <td className="px-3 py-2">
                                    <span className={`inline-block px-3 py-1 rounded-lg font-medium text-xs ${statusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-red-600 transition"
                                            disabled={booking.status === 'Cancelled' || booking.status === 'Completed'}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleComplete(booking.id)}
                                            className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-green-700 transition"
                                            disabled={booking.status === 'Cancelled' || booking.status === 'Completed'}
                                        >
                                            Complete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!bookings.length && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-400 py-8">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookingTable;
