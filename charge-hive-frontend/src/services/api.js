import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * A service class to handle all API communications using axios.
 * It uses axios interceptors to manage request headers and response handling globally.
 */
class ApiService {
    constructor() {
        // Create an axios instance with a predefined base URL.
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Use a request interceptor to dynamically add the Authorization header to every request.
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Use a response interceptor to handle successful responses and errors globally.
        this.api.interceptors.response.use(
            (response) => response.data, // On success, return the response data directly.
            (error) => {
                // On error, extract a clear message and reject the promise.
                const errorMessage = error.response?.data?.message || error.message || `HTTP error! status: ${error.response?.status}`;
                return Promise.reject(new Error(errorMessage));
            }
        );
    }

    // --- Authentication APIs ---

    async login(credentials) {
        const data = await this.api.post('/auth/login', credentials);
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }
        console.log("Login successful:", data);
        return data;
    }

    async register(userData) {
        console.log("Registering user:", userData);
        return this.api.post('/auth/register', userData);
    }

    async getCurrentUser() {
        return this.api.get('/auth/');
    }


    async changePassword(passwordData) {
        console.log("Changing password:", passwordData);
        return this.api.put('/auth/change-password', passwordData);
    }


    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log("User logged out.");
    }

    // --- Station APIs ---

    // async getNearbyStations(lat, lng, radiusKm = 5) {
    //     console.log(`Fetching nearby stations for lat: ${lat}, lng: ${lng}, radius: ${radiusKm} km`);
    //     return this.api.get('/stations/nearby', { params: { lat, lng, radiusKm } });
    // }


    async getAllStations() {
        return this.api.get('/stations');
    }

    async getStationsByOwner() {
        return this.api.get('/stations/get-station-by-owner');
    }

    async getStationById(stationId) {
        return this.api.get(`/stations/${stationId}`);
    }   

    async createStation(stationData) {
        console.log("Creating station:", stationData);
        return this.api.post('/stations', stationData);
    }

    async updateStation(stationId, stationData) {
        return this.api.put(`/stations/${stationId}`, stationData);
    }

    async deleteStation(stationId) {
        return this.api.delete(`/stations/${stationId}`);
    }

    async createPort(stationId, portData) {
        console.log("Creating port for station:", stationId, portData);
        return this.api.post(`/stations/${stationId}/ports`, portData);
    }

    async getUnapprovedStations() {
        return this.api.get('/stations/unapproved');
    }

    // --- Admin APIs ---

    async approveStation(approvalData) {
        return this.api.post('/admin/stations/process-approval', approvalData);
    }

    async getAllUsers() {
        return this.api.get('/admin/users');
    }

    async getAuditLogs() {
        return this.api.get('/admin/audit-logs');
    }

    // --- User Management APIs ---

    async getUserById(userId) {
        return this.api.get(`/auth/get-by-id/${userId}`);
    }

    async updateUser(userData, userId) {
        return this.api.put('/auth/edit-user', userData, {
            headers: { 'X-User-Id': userId },
        });
    }

    // --- Search/Booking APIs ---

    async getStationById(stationId) {
        return this.api.get(`/stations/${stationId}`);
    }

    async searchStations(params = {}) {
        return this.api.get('/stations/search', { params });
    }

    async getNearbyStations(lat, lng, radiusKm = 5) {
        return this.api.get('/stations/nearby', { params: { lat, lng, radiusKm } });
    }

    // --- Booking APIs (Placeholders) ---

    async createBooking(bookingData) {
        return this.api.post('/bookings', bookingData);
    }

    async getBookingsByStationId(id) {
        return this.api.get(`/bookings/station/${id}`);
    }

    async getMyBookings(userId) {
        // Fetch bookings for the currently authenticated user
        // Backend should expose an endpoint like GET /bookings/user/userId
        return this.api.get(`/bookings/user/${userId}`);
    }   


    async cancelBooking(bookingId){
        return this.api.put(`/${bookingId}/cancel`)
    }
}

// Export a singleton instance of the service
const apiService = new ApiService();
export default apiService;