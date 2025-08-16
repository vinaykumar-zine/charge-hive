import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Try to load user from localStorage on first render
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Always normalize userRole to be 'OWNER', 'ADMIN', 'DRIVER'.
            let userRole = parsed.userRole ? parsed.userRole.replace(/^ROLE_/, '') : undefined;
            return { ...parsed, userRole };
        }
        return null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // On mount, check if token exists and optionally verify with backend
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                let userRole = parsed.userRole ? parsed.userRole.replace(/^ROLE_/, '') : undefined;
                setUser({ ...parsed, userRole });
            }
            // try {
            //     // Optionally verify token with backend
            //     const response = await apiService.getCurrentUser();
            //     if (response) {
            //         let userRole = response.userRole ? response.userRole.replace(/^ROLE_/, '') : undefined;
            //         const normalized = { ...response, userRole };
            //         setUser(normalized);
            //         localStorage.setItem('user', JSON.stringify(normalized));
            //     }
            // } catch (error) {
            //     console.error('Auth check failed:', error);
            //     await logout();
            // } finally {
            //     setLoading(false);
            // }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.login(credentials);
            let userRole = data.user.userRole ? data.user.userRole.replace(/^ROLE_/, '') : undefined;
            const userObj = { ...data.user, userRole };
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.register(userData);
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
            setUser(null);
            setError(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedUser = await apiService.updateUser(userData, user.id);
            let userRole = updatedUser.userRole ? updatedUser.userRole.replace(/^ROLE_/, '') : undefined;
            const normalized = { ...updatedUser, userRole };
            setUser(normalized);
            localStorage.setItem('user', JSON.stringify(normalized));
            return normalized;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: user ? true : false,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
