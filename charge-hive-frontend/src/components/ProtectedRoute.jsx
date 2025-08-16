import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole = null }) {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    console.log(user);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    //If a required role is given, check whether the user’s role is not equal to that required role.
    if (requiredRole && user?.userRole !== requiredRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-4">
                        You don't have permission to access this page.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
