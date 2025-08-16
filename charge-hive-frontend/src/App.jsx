import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchStationsPage from "./pages/SearchStationsPage";
import BookingPage from "./pages/BookingPage";
import BookingsListPage from "./pages/BookingsListPage";
import StationDetailsPage from "./pages/StationDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import EarningsPage from "./pages/EarningsPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerDashBoardPage from "./pages/OwnerDashBoardPage";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}

          <Route
            path="/OwnerDashBoardPage"
            element={
              <ProtectedRoute requiredRole="OWNER">
                <OwnerDashBoardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stations"
            element={
              <ProtectedRoute>
                <SearchStationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stations/:id"
            element={
              <ProtectedRoute>
                <StationDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book/:stationId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/earnings"
            element={
              <ProtectedRoute requiredRole="OWNER">
                <EarningsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute requiredRole="OWNER">
                <OwnerBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



