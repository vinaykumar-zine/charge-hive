import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";

function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "", email: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileError, setprofileError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || ""
      });
    } else if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setprofileError(""); setMessage(""); setSaving(true);
    try {
      const userData = {
        ...form,
        email: user.email // Ensure we always send the email from the user context
      };
      await updateUser(userData);
      setMessage("Profile updated");
      toast.success("Profile updated successfully!");
    } catch (err) {
      setprofileError(err.message || "Failed to update profile");
      toast.error(err.message || "Failed to update profile");
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (pwd.newPassword !== pwd.confirm) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await apiService.changePassword({ newPassword: pwd.newPassword, currentPassword: pwd.currentPassword });
      setMessage(response.data);
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Password updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to change password");
      toast.error(err.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-green-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-green-800">Profile Settings</h1>

        <form onSubmit={handleSaveProfile} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First name</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Last name</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Phone</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>
          </div>
          {profileError && <div className="text-sm text-red-600">{profileError}</div>}
          {message && <div className="text-sm text-green-700">{message}</div>}
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-md">{saving ? "Saving..." : "Save changes"}</button>
        </form>

        <form onSubmit={handleChangePassword} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Current password</label>
              <input type="password" className="mt-1 w-full border rounded-md px-3 py-2" value={pwd.currentPassword}
                onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">New password</label>
              <input type="password" className="mt-1 w-full border rounded-md px-3 py-2" value={pwd.newPassword}
                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm new password</label>
              <input type="password" className="mt-1 w-full border rounded-md px-3 py-2" value={pwd.confirm}
                onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-700">{message}</div>}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">Update password</button>
        </form>
      </main>
    </div>
  );
}

export default ProfilePage;


