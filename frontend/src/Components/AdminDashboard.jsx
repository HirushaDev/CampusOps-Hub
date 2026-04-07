// AdminDashboard.js - Modern UI Version
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Clock, Users, GraduationCap, Building2, Laptop, Wrench, MapPin,
  CheckCircle, XCircle, AlertCircle, FileText, Mail, User, Phone, Search, X,
  Sparkles, Star, TrendingUp, LayoutGrid, List, ArrowRight, Loader2, Shield,
  Eye, Edit, Trash2, Plus, Filter, Download, RefreshCw, MessageSquare, Send,
  Settings, BarChart3, Activity, Bell, ChevronDown, MoreVertical, ThumbsUp,
  ThumbsDown, Info, Flag, Upload, Image as ImageIcon, Trash, Camera, Grid,
  Layers, Zap, Award, Target, Globe, Heart, Coffee, Wifi, Wind, Maximize,
  Volume2, Tv, Mic, Video, Moon, Sun
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8081/api';

const AdminDashboard = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const fileInputRef = useRef(null);
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingApprovals: 0,
    approvedToday: 0,
    activeResources: 0,
    totalRevenue: 0,
    satisfactionRate: 98
  });

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    description: '',
    amenities: '',
    features: '',
    status: 'ACTIVE',
    contactPerson: '',
    contactEmail: '',
    rules: '',
    pricePerHour: 0
  });

  const [resourceErrors, setResourceErrors] = useState({});

  // Helper function to get image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // API Helper Functions
  const apiRequest = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const resourcesRes = await apiRequest('/resources');
      if (resourcesRes.success && resourcesRes.data.data) {
        setResources(resourcesRes.data.data);
        setStats(prev => ({ ...prev, activeResources: resourcesRes.data.data.filter(r => r.status === 'ACTIVE').length }));
      }
      
      const bookingsRes = await apiRequest('/bookings');
      if (bookingsRes.success && bookingsRes.data.data) {
        const allBookings = bookingsRes.data.data;
        setBookings(allBookings);
        const pending = allBookings.filter(b => b.status === 'PENDING');
        setPendingBookings(pending);
        
        const approvedToday = allBookings.filter(b => {
          if (b.status === 'APPROVED' && b.approvedAt) {
            const today = new Date().toISOString().split('T')[0];
            return b.approvedAt.split('T')[0] === today;
          }
          return false;
        }).length;
        
        setStats({
          totalBookings: allBookings.length,
          pendingApprovals: pending.length,
          approvedToday: approvedToday,
          activeResources: resources.filter(r => r.status === 'ACTIVE').length,
          totalRevenue: 0,
          satisfactionRate: 98
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // Add welcome notification
    addNotification('Welcome back, Admin! You have pending approvals to review.', 'info');
  }, []);

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newFiles = [...imageFiles];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
      }
    });
    
    setImageFiles(newFiles);
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (imagePreviewUrls[index] && imagePreviewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }
    const newPreviews = [...imagePreviewUrls];
    const newFiles = [...imageFiles];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setImagePreviewUrls(newPreviews);
    setImageFiles(newFiles);
  };

  const approveBooking = async (booking) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(`/bookings/${booking.id}/approve?adminName=Admin`, 'POST');
      if (response.success) {
        await loadDashboardData();
        setShowApprovalModal(false);
        setSelectedBooking(null);
        addNotification(`Booking ${booking.bookingReference} has been approved!`, 'success');
      } else {
        alert('❌ Failed to approve booking: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ Error approving booking');
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBookingRequest = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `/bookings/${selectedBooking.id}/reject?adminName=Admin&reason=${encodeURIComponent(rejectionReason)}`, 
        'POST'
      );
      if (response.success) {
        await loadDashboardData();
        setShowRejectionModal(false);
        setSelectedBooking(null);
        setRejectionReason('');
        addNotification(`Booking ${selectedBooking.bookingReference} has been rejected.`, 'error');
      } else {
        alert('Failed to reject booking: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error rejecting booking');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelApprovedBooking = async (booking) => {
    if (window.confirm(`⚠️ Cancel Booking ${booking.bookingReference}?\n\nThis action cannot be undone.`)) {
      setIsLoading(true);
      try {
        const response = await apiRequest(`/bookings/${booking.id}/cancel?cancelledBy=Admin`, 'POST');
        if (response.success) {
          await loadDashboardData();
          addNotification(`Booking ${booking.bookingReference} has been cancelled.`, 'warning');
        } else {
          alert('Failed to cancel booking');
        }
      } catch (error) {
        alert('Error cancelling booking');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addResource = async () => {
    if (!validateResourceForm()) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', resourceForm.name);
      formData.append('type', resourceForm.type);
      formData.append('capacity', resourceForm.capacity);
      formData.append('location', resourceForm.location);
      formData.append('description', resourceForm.description);
      formData.append('amenities', resourceForm.amenities);
      formData.append('features', resourceForm.features);
      formData.append('contactPerson', resourceForm.contactPerson);
      formData.append('contactEmail', resourceForm.contactEmail);
      formData.append('rules', resourceForm.rules);
      formData.append('status', 'ACTIVE');
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        await loadDashboardData();
        setShowAddResourceModal(false);
        resetResourceForm();
        addNotification(`Resource "${resourceForm.name}" created successfully!`, 'success');
      } else {
        const error = await response.json();
        alert('Failed to create resource: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error creating resource');
    } finally {
      setIsLoading(false);
    }
  };

  const editResource = (resource) => {
    setSelectedResource(resource);
    setResourceForm({
      name: resource.name || '',
      type: resource.type || 'LECTURE_HALL',
      capacity: resource.capacity || '',
      location: resource.location || '',
      description: resource.description || '',
      amenities: Array.isArray(resource.amenities) ? resource.amenities.join(', ') : (resource.amenities || ''),
      features: Array.isArray(resource.features) ? resource.features.join(', ') : (resource.features || ''),
      status: resource.status || 'ACTIVE',
      contactPerson: resource.contactPerson || '',
      contactEmail: resource.contactEmail || '',
      rules: resource.rules || '',
      pricePerHour: resource.pricePerHour || 0
    });
    
    if (resource.images && Array.isArray(resource.images) && resource.images.length > 0) {
      const previews = resource.images.map(img => {
        if (img.startsWith('http')) return img;
        return `${API_BASE_URL}${img}`;
      });
      setImagePreviewUrls(previews);
    } else {
      setImagePreviewUrls([]);
    }
    setImageFiles([]);
    setShowEditResourceModal(true);
  };

  const updateResource = async () => {
    if (!validateResourceForm()) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', resourceForm.name);
      formData.append('type', resourceForm.type);
      formData.append('capacity', resourceForm.capacity);
      formData.append('location', resourceForm.location);
      formData.append('description', resourceForm.description);
      formData.append('amenities', resourceForm.amenities);
      formData.append('features', resourceForm.features);
      formData.append('contactPerson', resourceForm.contactPerson);
      formData.append('contactEmail', resourceForm.contactEmail);
      formData.append('rules', resourceForm.rules);
      formData.append('status', resourceForm.status);
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch(`${API_BASE_URL}/resources/${selectedResource.id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (response.ok) {
        await loadDashboardData();
        setShowEditResourceModal(false);
        resetResourceForm();
        addNotification(`Resource "${resourceForm.name}" updated successfully!`, 'success');
      } else {
        const error = await response.json();
        alert('Failed to update resource: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating resource');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResource = async (resource) => {
    if (window.confirm(`⚠️ Delete "${resource.name}"?\n\nThis will also delete all associated bookings. This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        const response = await apiRequest(`/resources/${resource.id}`, 'DELETE');
        if (response.success) {
          await loadDashboardData();
          addNotification(`Resource "${resource.name}" has been deleted.`, 'error');
        } else {
          alert('Failed to delete resource: ' + (response.data?.message || 'Unknown error'));
        }
      } catch (error) {
        alert('Error deleting resource');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateResourceForm = () => {
    const errors = {};
    if (!resourceForm.name.trim()) errors.name = 'Resource name is required';
    if (!resourceForm.capacity) errors.capacity = 'Capacity is required';
    if (resourceForm.capacity < 1) errors.capacity = 'Capacity must be at least 1';
    if (!resourceForm.location.trim()) errors.location = 'Location is required';
    if (!resourceForm.description.trim()) errors.description = 'Description is required';
    if (resourceForm.description.length < 20) errors.description = 'Description must be at least 20 characters';
    
    setResourceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetResourceForm = () => {
    setResourceForm({
      name: '',
      type: 'LECTURE_HALL',
      capacity: '',
      location: '',
      description: '',
      amenities: '',
      features: '',
      status: 'ACTIVE',
      contactPerson: '',
      contactEmail: '',
      rules: '',
      pricePerHour: 0
    });
    imagePreviewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setImagePreviewUrls([]);
    setImageFiles([]);
    setResourceErrors({});
  };

  const getFilteredBookings = () => {
    let filtered = activeTab === 'pending' ? pendingBookings : 
                   activeTab === 'all' ? bookings :
                   bookings.filter(b => b.status === activeTab.toUpperCase());
    
    if (searchTerm) {
      filtered = filtered.filter(b => 
        (b.resourceName && b.resourceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.studentName && b.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.bookingReference && b.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(b => b.resourceType === typeFilter);
    }
    
    return filtered;
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      APPROVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      REJECTED: 'bg-red-500/10 text-red-600 border-red-500/20',
      CANCELLED: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    };
    return badges[status] || 'bg-gray-500/10 text-gray-600';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'REJECTED': return <XCircle size={14} className="text-red-500" />;
      case 'CANCELLED': return <X size={14} className="text-gray-500" />;
      default: return <AlertCircle size={14} className="text-amber-500" />;
    }
  };

  const filteredBookings = getFilteredBookings();

  const getResourceImage = (resource) => {
    if (resource.images && resource.images.length > 0 && resource.images[0]) {
      const img = resource.images[0];
      if (img.startsWith('http')) return img;
      return `${API_BASE_URL}${img}`;
    }
    return 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop';
  };

  // Dynamic theme classes
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50',
    cardBg: isDarkMode ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-all duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${theme.cardBg} shadow-xl border-b ${theme.border} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  Admin Control Hub
                </h1>
                <p className={`text-xs ${theme.textSecondary}`}>Resource Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-xl ${theme.hover} transition-all duration-300`}
              >
                {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl ${theme.hover} transition-all duration-300`}
                >
                  <Bell size={18} className={theme.textSecondary} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${theme.cardBg} rounded-2xl shadow-2xl border ${theme.border} backdrop-blur-xl z-50 overflow-hidden`}>
                    <div className={`p-4 border-b ${theme.border}`}>
                      <h3 className={`font-semibold ${theme.text}`}>Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-4 border-b ${theme.border} ${theme.hover} transition-all cursor-pointer`}>
                            <p className={`text-sm ${theme.text}`}>{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.timestamp.toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={`flex items-center space-x-2 bg-amber-500/20 rounded-xl px-3 py-1.5 border border-amber-500/30`}>
                <Bell size={16} className="text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">{pendingBookings.length} Pending</span>
              </div>
              <button 
                onClick={loadDashboardData}
                className={`p-2 rounded-xl ${theme.hover} transition-all duration-300 ${theme.textSecondary}`}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards - Modern Glass Morphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-blue-500 to-cyan-500', gradient: 'blue' },
            { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'from-amber-500 to-orange-500', gradient: 'amber' },
            { label: 'Approved Today', value: stats.approvedToday, icon: ThumbsUp, color: 'from-emerald-500 to-teal-500', gradient: 'emerald' },
            { label: 'Active Resources', value: stats.activeResources, icon: Building2, color: 'from-purple-500 to-pink-500', gradient: 'purple' },
          ].map((stat, idx) => (
            <div key={idx} className={`${theme.cardBg} rounded-2xl shadow-xl border ${theme.border} backdrop-blur-sm p-6 hover:scale-105 transition-all duration-300 group`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme.textSecondary} font-medium`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${theme.text} mt-1`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Section - Modern Design */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl border ${theme.border} mb-8 overflow-hidden backdrop-blur-sm`}>
          <div className={`border-b ${theme.border} bg-opacity-50`}>
            <div className="flex space-x-1 p-4 flex-wrap gap-2">
              {[
                { id: 'pending', label: 'Pending Approvals', icon: AlertCircle, color: 'amber', count: pendingBookings.length },
                { id: 'all', label: 'All Bookings', icon: LayoutGrid, color: 'blue' },
                { id: 'APPROVED', label: 'Approved', icon: CheckCircle, color: 'emerald' },
                { id: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'red' },
                { id: 'CANCELLED', label: 'Cancelled', icon: X, color: 'gray' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg scale-105`
                      : `${theme.text} ${theme.hover} border ${theme.border}`
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="p-6 border-b ${theme.border}">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`} />
                  <input
                    type="text"
                    placeholder="Search by resource, student, or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${theme.text} placeholder-gray-400`}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-4 py-2.5 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                >
                  <option value="all">All Resource Types</option>
                  <option value="LECTURE_HALL">🏛️ Lecture Halls</option>
                  <option value="LAB">💻 Labs</option>
                  <option value="MEETING_ROOM">👥 Meeting Rooms</option>
                  <option value="EQUIPMENT">📷 Equipment</option>
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                  }}
                  className={`px-4 py-2.5 ${theme.text} ${theme.hover} transition-all duration-300 flex items-center space-x-2 border ${theme.border} rounded-xl bg-opacity-50`}
                >
                  <RefreshCw size={16} />
                  <span>Reset</span>
                </button>
                
                <button
                  onClick={() => setShowAddResourceModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <Plus size={16} />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Bookings List */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className="text-blue-600 animate-spin" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <div className={`w-24 h-24 ${theme.cardBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Calendar size={40} className={theme.textSecondary} />
                </div>
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>No bookings found</h3>
                <p className={theme.textSecondary}>No bookings match your current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className={`${theme.cardBg} border ${theme.border} rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}>
                    <div className="md:flex">
                      <div className="md:w-56 h-48 md:h-auto relative overflow-hidden bg-gray-100">
                        <img 
                          src={booking.resourceImage ? (booking.resourceImage.startsWith('http') ? booking.resourceImage : `${API_BASE_URL}${booking.resourceImage}`) : 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop'} 
                          alt={booking.resourceName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${getStatusBadge(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span>{booking.status}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <div>
                            <h3 className={`text-xl font-bold ${theme.text} mb-1`}>{booking.resourceName}</h3>
                            <p className={`text-xs ${theme.textSecondary} font-mono`}>
                              REF: {booking.bookingReference} • Created: {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${theme.text}`}>{booking.studentName}</p>
                            <p className={`text-xs ${theme.textSecondary} flex items-center`}>
                              <Mail size={10} className="mr-1" />
                              {booking.studentEmail}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className={`flex items-center space-x-2 text-sm ${theme.textSecondary}`}>
                            <Calendar size={14} className="text-blue-500" />
                            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center space-x-2 text-sm ${theme.textSecondary}`}>
                            <Clock size={14} className="text-blue-500" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className={`flex items-center space-x-2 text-sm ${theme.textSecondary}`}>
                            <Users size={14} className="text-blue-500" />
                            <span>{booking.attendees || 0} attendees</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className={`text-xs ${theme.textSecondary} mb-1 font-semibold`}>Purpose</p>
                          <p className={theme.text}>{booking.purpose}</p>
                        </div>
                        
                        {booking.specialRequests && (
                          <div className="mb-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <p className={`text-xs text-amber-600 mb-1 font-semibold flex items-center`}>
                              <MessageSquare size={12} className="mr-1" />
                              Special Requests
                            </p>
                            <p className="text-sm text-amber-700">{booking.specialRequests}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-3 mt-4">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => approveBooking(booking)}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:scale-105"
                              >
                                <ThumbsUp size={16} />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRejectionModal(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:scale-105"
                              >
                                <ThumbsDown size={16} />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {booking.status === 'APPROVED' && (
                            <button
                              onClick={() => cancelApprovedBooking(booking)}
                              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:scale-105"
                            >
                              <X size={16} />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowApprovalModal(true);
                            }}
                            className={`px-4 py-2 border-2 ${theme.border} ${theme.text} rounded-xl ${theme.hover} transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm`}
                          >
                            <Eye size={16} />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resource Management Section */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl border ${theme.border} p-6 backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Layers size={22} className="text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme.text}`}>Resource Library</h2>
                <p className={`text-sm ${theme.textSecondary}`}>Manage your campus resources and facilities</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
            >
              <Plus size={18} />
              <span>Create New Resource</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className={`${theme.cardBg} border ${theme.border} rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-sm group`}>
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img 
                    src={getResourceImage(resource)} 
                    alt={resource.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                      resource.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white mb-1">{resource.name}</h3>
                    <p className="text-white/90 text-sm flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {resource.location}
                    </p>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 text-sm ${theme.textSecondary}`}>
                        <Users size={14} />
                        <span>Cap: {resource.capacity}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className={`flex items-center space-x-1 text-sm ${theme.textSecondary}`}>
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{resource.rating || 4.5}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold">
                      <Sparkles size={12} />
                      <span>Free</span>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${theme.textSecondary} mb-3 line-clamp-2`}>{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.amenities && resource.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full`}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editResource(resource)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 shadow-lg hover:scale-105"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteResource(resource)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 shadow-lg hover:scale-105"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals remain the same but with updated styling... */}
      {/* Approval Modal */}
      {showApprovalModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-2xl shadow-2xl max-w-md w-full border ${theme.border} backdrop-blur-xl animate-fade-in-up`}>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className={`text-xl font-bold ${theme.text} mb-2`}>Approve Booking</h3>
                <p className={theme.textSecondary}>Confirm approval for this booking request</p>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-4 mb-6`}>
                <p className={`text-sm ${theme.textSecondary} mb-2 font-semibold`}>Booking Details:</p>
                <p className={`font-medium ${theme.text}`}>{selectedBooking.resourceName}</p>
                <p className={`text-sm ${theme.textSecondary}`}>{new Date(selectedBooking.bookingDate).toLocaleDateString()} • {selectedBooking.startTime} - {selectedBooking.endTime}</p>
                <p className={`text-sm ${theme.textSecondary} mt-2`}>Student: {selectedBooking.studentName}</p>
                <p className={`text-sm ${theme.textSecondary}`}>Email: {selectedBooking.studentEmail}</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className={`flex-1 px-4 py-2.5 border-2 ${theme.border} ${theme.text} rounded-xl ${theme.hover} transition-all backdrop-blur-sm`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => approveBooking(selectedBooking)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg hover:scale-105 transition-all"
                >
                  Approve Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`${theme.cardBg} rounded-2xl shadow-2xl max-w-md w-full border ${theme.border} backdrop-blur-xl animate-fade-in-up`}>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h3 className={`text-xl font-bold ${theme.text} mb-2`}>Reject Booking</h3>
                <p className={theme.textSecondary}>Please provide a reason for rejection</p>
              </div>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  placeholder="Explain why this booking is being rejected..."
                  className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${theme.text} placeholder-gray-400`}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className={`flex-1 px-4 py-2.5 border-2 ${theme.border} ${theme.text} rounded-xl ${theme.hover} transition-all backdrop-blur-sm`}
                >
                  Cancel
                </button>
                <button
                  onClick={rejectBookingRequest}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-medium shadow-lg hover:scale-105 transition-all"
                >
                  Reject Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${theme.cardBg} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${theme.border} backdrop-blur-xl animate-fade-in-up`}>
            <div className={`sticky top-0 ${theme.cardBg} border-b ${theme.border} px-6 py-4 flex justify-between items-center backdrop-blur-xl`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${theme.text}`}>Create New Resource</h2>
                  <p className={`text-sm ${theme.textSecondary}`}>Add a new facility or equipment to the catalogue</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddResourceModal(false)}
                className={`${theme.textSecondary} hover:${theme.text} transition-colors w-8 h-8 rounded-full ${theme.hover} flex items-center justify-center`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div className={`border-2 border-dashed ${theme.border} rounded-2xl p-6 hover:border-blue-500/50 transition-all`}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-blue-500" />
                  </div>
                  <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Upload Resource Images</h3>
                  <p className={`text-sm ${theme.textSecondary} mb-4`}>Upload up to 5 high-quality images of the resource</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center space-x-2 hover:scale-105"
                  >
                    <Upload size={16} />
                    <span>Select Images</span>
                  </button>
                </div>
                
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group/image">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border ${theme.border}"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover/image:opacity-100 transition-all hover:bg-red-700"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Resource Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.name}
                    onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${theme.text} placeholder-gray-400`}
                    placeholder="e.g., Advanced Computer Lab"
                  />
                  {resourceErrors.name && <p className="text-red-500 text-xs mt-1">{resourceErrors.name}</p>}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Resource Type
                  </label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  >
                    <option value="LECTURE_HALL">🏛️ Lecture Hall</option>
                    <option value="LAB">💻 Laboratory</option>
                    <option value="MEETING_ROOM">👥 Meeting Room</option>
                    <option value="EQUIPMENT">📷 Equipment</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={resourceForm.capacity}
                    onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text} placeholder-gray-400`}
                    placeholder="Number of people"
                  />
                  {resourceErrors.capacity && <p className="text-red-500 text-xs mt-1">{resourceErrors.capacity}</p>}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.location}
                    onChange={(e) => setResourceForm({ ...resourceForm, location: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text} placeholder-gray-400`}
                    placeholder="e.g., Building A, Floor 2"
                  />
                  {resourceErrors.location && <p className="text-red-500 text-xs mt-1">{resourceErrors.location}</p>}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  rows="3"
                  className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text} placeholder-gray-400`}
                  placeholder="Describe the resource, its features, and benefits..."
                />
                {resourceErrors.description && <p className="text-red-500 text-xs mt-1">{resourceErrors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.amenities}
                    onChange={(e) => setResourceForm({ ...resourceForm, amenities: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text} placeholder-gray-400`}
                    placeholder="e.g., Projector, WiFi, AC, Whiteboard"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Special Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.features}
                    onChange={(e) => setResourceForm({ ...resourceForm, features: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text} placeholder-gray-400`}
                    placeholder="e.g., Wheelchair Access, Recording System"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddResourceModal(false)}
                  className={`flex-1 px-4 py-2.5 border-2 ${theme.border} ${theme.text} rounded-xl ${theme.hover} transition-all backdrop-blur-sm`}
                >
                  Cancel
                </button>
                <button
                  onClick={addResource}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-2xl transition-all flex items-center justify-center space-x-2 hover:scale-105"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isLoading ? 'Creating...' : 'Create Resource'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`${theme.cardBg} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${theme.border} backdrop-blur-xl animate-fade-in-up`}>
            <div className={`sticky top-0 ${theme.cardBg} border-b ${theme.border} px-6 py-4 flex justify-between items-center backdrop-blur-xl`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Edit size={20} className="text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${theme.text}`}>Edit Resource</h2>
                  <p className={`text-sm ${theme.textSecondary}`}>Update resource information</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditResourceModal(false)}
                className={`${theme.textSecondary} hover:${theme.text} transition-colors w-8 h-8 rounded-full ${theme.hover} flex items-center justify-center`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Existing Images Preview */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>Current Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group/image">
                        <img 
                          src={url} 
                          alt={`Resource image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border ${theme.border}"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop';
                          }}
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover/image:opacity-100 transition-all hover:bg-red-700"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Images */}
              <div className={`border-2 border-dashed ${theme.border} rounded-2xl p-6 hover:border-blue-500/50 transition-all`}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-blue-500" />
                  </div>
                  <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Add New Images</h3>
                  <p className={`text-sm ${theme.textSecondary} mb-4`}>Upload additional images for this resource</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center space-x-2 hover:scale-105"
                  >
                    <Upload size={16} />
                    <span>Select Images</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Resource Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.name}
                    onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                  {resourceErrors.name && <p className="text-red-500 text-xs mt-1">{resourceErrors.name}</p>}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Resource Type
                  </label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  >
                    <option value="LECTURE_HALL">🏛️ Lecture Hall</option>
                    <option value="LAB">💻 Laboratory</option>
                    <option value="MEETING_ROOM">👥 Meeting Room</option>
                    <option value="EQUIPMENT">📷 Equipment</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={resourceForm.capacity}
                    onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                  {resourceErrors.capacity && <p className="text-red-500 text-xs mt-1">{resourceErrors.capacity}</p>}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.location}
                    onChange={(e) => setResourceForm({ ...resourceForm, location: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                  {resourceErrors.location && <p className="text-red-500 text-xs mt-1">{resourceErrors.location}</p>}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  rows="3"
                  className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                />
                {resourceErrors.description && <p className="text-red-500 text-xs mt-1">{resourceErrors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.amenities}
                    onChange={(e) => setResourceForm({ ...resourceForm, amenities: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Special Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.features}
                    onChange={(e) => setResourceForm({ ...resourceForm, features: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={resourceForm.contactPerson}
                    onChange={(e) => setResourceForm({ ...resourceForm, contactPerson: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={resourceForm.contactEmail}
                    onChange={(e) => setResourceForm({ ...resourceForm, contactEmail: e.target.value })}
                    className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Status
                </label>
                <select
                  value={resourceForm.status}
                  onChange={(e) => setResourceForm({ ...resourceForm, status: e.target.value })}
                  className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Usage Rules & Guidelines
                </label>
                <textarea
                  value={resourceForm.rules}
                  onChange={(e) => setResourceForm({ ...resourceForm, rules: e.target.value })}
                  rows="2"
                  className={`w-full px-3 py-2 ${theme.inputBg} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.text}`}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEditResourceModal(false)}
                  className={`flex-1 px-4 py-2.5 border-2 ${theme.border} ${theme.text} rounded-xl ${theme.hover} transition-all backdrop-blur-sm`}
                >
                  Cancel
                </button>
                <button
                  onClick={updateResource}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-2xl transition-all flex items-center justify-center space-x-2 hover:scale-105"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isLoading ? 'Updating...' : 'Update Resource'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;