/**
 * Authentication Service
 */

import axiosInstance from './apiClient';

export const authService = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

/**
 * Event Service
 */
export const eventService = {
  getAllEvents: () => axiosInstance.get('/events'),
  getEventById: (id) => axiosInstance.get(`/events/${id}`),
  createEvent: (data) => axiosInstance.post('/events', data),
  updateEvent: (id, data) => axiosInstance.put(`/events/${id}`, data),
  deleteEvent: (id) => axiosInstance.delete(`/events/${id}`),
  searchEvents: (query) => axiosInstance.get('/events/search', { params: { query } }),
};

/**
 * Club Service
 */
export const clubService = {
  getAllClubs: () => axiosInstance.get('/clubs'),
  getClubById: (id) => axiosInstance.get(`/clubs/${id}`),
  createClub: (data) => axiosInstance.post('/clubs', data),
  updateClub: (id, data) => axiosInstance.put(`/clubs/${id}`, data),
  deleteClub: (id) => axiosInstance.delete(`/clubs/${id}`),
  searchClubs: (query) => axiosInstance.get('/clubs/search', { params: { query } }),
};

/**
 * Booking Service
 */
export const bookingService = {
  bookEvent: (data) => axiosInstance.post('/bookings', data),
  cancelBooking: (id) => axiosInstance.put(`/bookings/${id}/cancel`),
  getBookingHistory: () => axiosInstance.get('/bookings/history'),
  getActiveBookings: () => axiosInstance.get('/bookings/active'),
};

/**
 * Club Member Service
 */
export const clubMemberService = {
  joinClub: (data) => axiosInstance.post('/clubs/members/join', data),
  leaveClub: (clubId) => axiosInstance.delete(`/clubs/members/${clubId}`),
  getJoinedClubs: () => axiosInstance.get('/clubs/members/my-clubs'),
};

/**
 * Feedback Service
 */
export const feedbackService = {
  submitFeedback: (data) => axiosInstance.post('/feedback', data),
  getFeedbackHistory: () => axiosInstance.get('/feedback/history'),
};
