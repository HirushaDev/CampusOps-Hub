// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",  // Base URL without /api
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const rawUser = localStorage.getItem("user");

  if (rawUser) {
    try {
      const parsedUser = JSON.parse(rawUser);
      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch {
      localStorage.removeItem("user");
    }
  }

  return config;
});

// Auth endpoints - note: no /api prefix because your backend has context path /api
export const loginUser = (payload) => API.post("/login", payload);
export const registerUser = (payload) => API.post("/register", payload);
export const resetEmailOtp = (payload) => API.post(`/send-reset-otp?email=${payload.email}`, payload);
export const resetPassword = (payload) => API.post("/reset-password", payload);
export const logoutUser = () => API.post("/logout");

// Admin endpoints
export const adminLogin = (payload) => API.post("/admin/login", payload);

// Resource endpoints - note the /api prefix is handled by the context path
export const getResources = () => API.get("/api/resources");
export const getResourceById = (id) => API.get(`/api/resources/${id}`);
export const createResource = (formData) => API.post("/api/resources", formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateResource = (id, formData) => API.put(`/api/resources/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteResource = (id) => API.delete(`/api/resources/${id}`);

// Booking endpoints
export const getBookings = () => API.get("/api/bookings");
export const approveBooking = (id) => API.post(`/api/bookings/${id}/approve?adminName=Admin`);
export const rejectBooking = (id, reason) => API.post(`/api/bookings/${id}/reject?adminName=Admin&reason=${encodeURIComponent(reason)}`);
export const cancelBooking = (id) => API.post(`/api/bookings/${id}/cancel?cancelledBy=Admin`);

export default API;