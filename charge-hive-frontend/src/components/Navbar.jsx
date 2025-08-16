import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaCog, FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/OwnerDashBoardPage", roles: ["ROLE_OWNER"] },
        { name: "Dashboard", path: "/DashBoard", roles: ["ROLE_ADMIN"] },
        { name: "Stations", path: "/stations", roles: ["ROLE_ADMIN", "ROLE_OWNER", "ROLE_DRIVER"] },
        { name: "Bookings", path: "/bookings", roles: ["ROLE_ADMIN", "ROLE_OWNER", "ROLE_DRIVER"] },
        { name: "Earnings", path: "/earnings", roles: ["ROLE_OWNER"] },
    ];

    const filteredNavItems = navItems.filter(item => {
        if (!user?.userRole) return false;
        const userRoleWithPrefix = `ROLE_${user.userRole}`;
        return item.roles.includes(userRoleWithPrefix);
    });

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };



    return (
        <nav className="sticky top-0 z-500 flex items-center justify-between px-8 py-4 shadow bg-gradient-to-r from-green-900 via-green-700 to-lime-500 text-white">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:text-lime-200 transition">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-lime-200 mr-2">
                    <circle cx="12" cy="12" r="10" />
                    <rect x="8" y="4" width="8" height="16" rx="4" className="fill-green-400 opacity-80" />
                </svg>
                ChargeHive
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex gap-6">
                {filteredNavItems.map((item) => (
                    <li key={item.name}>
                        <Link
                            to={item.path}
                            className={`font-medium block px-3 py-1.5 rounded-md transition 
                                ${location.pathname === item.path
                                    ? 'bg-white/20 text-lime-200'
                                    : 'hover:bg-white/10 hover:text-lime-200'
                                } 
                                focus:outline-none focus:ring-2 focus:ring-lime-200`}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* User Menu */}
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition"
                        >
                            <FaUserCircle className="text-xl" />
                            <span className="hidden sm:block font-medium">
                                {user?.firstName || user?.email || 'User'}
                            </span>
                            {user?.role && (
                                <span className="hidden sm:block text-xs bg-white/20 px-2 py-1 rounded-full">
                                    {user.role}
                                </span>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <FaCog className="inline mr-2" />
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <FaSignOutAlt className="inline mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link
                            to="/login"
                            className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition font-medium"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-lime-500 text-green-900 px-4 py-2 rounded-full hover:bg-lime-400 transition font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
