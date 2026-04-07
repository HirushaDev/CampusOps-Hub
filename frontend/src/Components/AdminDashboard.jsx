// AdminDashboard.jsx - Ultra-Modern Cyberpunk Glassmorphism Edition (Fixed)
import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Clock, Users, GraduationCap, Building2, Laptop, Wrench, MapPin,
  CheckCircle, XCircle, AlertCircle, FileText, Mail, User, Phone, Search, X,
  Sparkles, Star, TrendingUp, LayoutGrid, List, ArrowRight, Loader2, Shield,
  Eye, Edit, Trash2, Plus, Filter, Download, RefreshCw, MessageSquare, Send,
  Settings, BarChart3, Activity, Bell, ChevronDown, MoreVertical, ThumbsUp,
  ThumbsDown, Info, Flag, Upload, Image as ImageIcon, Trash, Camera, Grid,
  Layers, Zap, Award, Target, Globe, Heart, Coffee, Wifi, Wind, Maximize,
  Volume2, Tv, Mic, Video, Moon, Sun, Hexagon, Cube, Diamond, Compass,
  Navigation, Orbit, Radar, Cpu, Database, Cloud, Lock, Key, Fingerprint
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    addNotification('Welcome back, Commander! Neural interface online.', 'info');
    
    // Mouse tracking for 3D effect
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        addNotification(`✓ Booking ${booking.bookingReference} neural-linked and approved!`, 'success');
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
        addNotification(`⛔ Booking ${selectedBooking.bookingReference} rejected.`, 'error');
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
    if (window.confirm(`⚠️ Initiate cancellation for ${booking.bookingReference}?\n\nThis action cannot be undone.`)) {
      setIsLoading(true);
      try {
        const response = await apiRequest(`/bookings/${booking.id}/cancel?cancelledBy=Admin`, 'POST');
        if (response.success) {
          await loadDashboardData();
          addNotification(`⚠️ Booking ${booking.bookingReference} cancelled.`, 'warning');
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
        addNotification(`✨ Resource "${resourceForm.name}" materialized successfully!`, 'success');
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
        addNotification(`🔄 Resource "${resourceForm.name}" updated and synchronized!`, 'success');
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
    if (window.confirm(`⚠️ Purge "${resource.name}" from system?\n\nThis will also delete all associated data. Action irreversible.`)) {
      setIsLoading(true);
      try {
        const response = await apiRequest(`/resources/${resource.id}`, 'DELETE');
        if (response.success) {
          await loadDashboardData();
          addNotification(`💀 Resource "${resource.name}" has been purged.`, 'error');
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
    if (!resourceForm.name.trim()) errors.name = 'Resource designation required';
    if (!resourceForm.capacity) errors.capacity = 'Capacity threshold required';
    if (resourceForm.capacity < 1) errors.capacity = 'Capacity must exceed 0';
    if (!resourceForm.location.trim()) errors.location = 'Location coordinates required';
    if (!resourceForm.description.trim()) errors.description = 'Description required';
    if (resourceForm.description.length < 20) errors.description = 'Minimum 20 characters required';
    
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
      PENDING: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      APPROVED: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      REJECTED: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30',
      CANCELLED: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30'
    };
    return badges[status] || 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400';
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba(0%2C%20255%2C%20255%2C%200.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%2F%3E%3C%2Fsvg%3E')]"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-1000"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-cyan-400 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[60%] left-[85%] w-1 h-1 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[80%] left-[30%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[70%] w-1 h-1 bg-cyan-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[15%] left-[90%] w-1 h-1 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-scan"></div>
      </div>

      {/* Navigation - Holographic Glass Panel */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                  <Hexagon size={22} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                  NEXUS ADMIN
                </h1>
                <p className="text-xs text-cyan-400/70 font-mono">Quantum Resource Management System v2.0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400 font-mono">SYSTEM ONLINE</span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 flex items-center justify-center group"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isDarkMode ? <Sun size={18} className="text-yellow-400 relative z-10" /> : <Moon size={18} className="text-cyan-400 relative z-10" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 flex items-center justify-center group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Bell size={18} className="text-cyan-400 relative z-10" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-[#0a0a0f]/95 backdrop-blur-2xl rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,255,0.2)] z-50 overflow-hidden">
                    <div className="p-4 border-b border-cyan-500/20">
                      <h3 className="font-semibold text-cyan-400">Neural Alerts</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No active alerts</div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-4 border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                            <p className="text-sm text-gray-300 group-hover:text-cyan-300 transition-colors">{notif.message}</p>
                            <p className="text-xs text-cyan-500/50 mt-1 font-mono">{notif.timestamp.toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pending Badge */}
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-amber-400">{pendingBookings.length} PENDING</span>
              </div>
              
              <button 
                onClick={loadDashboardData}
                className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 flex items-center justify-center group"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <RefreshCw size={18} className="text-cyan-400 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards - Neon Holographic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'TOTAL BOOKINGS', value: stats.totalBookings, icon: Calendar, gradient: 'from-cyan-500 to-blue-500', border: 'cyan' },
            { label: 'PENDING APPROVALS', value: stats.pendingApprovals, icon: Clock, gradient: 'from-amber-500 to-orange-500', border: 'amber' },
            { label: 'APPROVED TODAY', value: stats.approvedToday, icon: ThumbsUp, gradient: 'from-emerald-500 to-teal-500', border: 'emerald' },
            { label: 'ACTIVE RESOURCES', value: stats.activeResources, icon: Building2, gradient: 'from-purple-500 to-pink-500', border: 'purple' },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="relative group"
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <div className={`relative bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-${stat.border}-500/30 p-6 hover:border-${stat.border}-500/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-cyan-400/70 tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)] group-hover:scale-110 transition-all duration-500`}>
                    <stat.icon size={22} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Section - Neon Border Tabs */}
        <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 mb-8 overflow-hidden">
          <div className="border-b border-cyan-500/20">
            <div className="flex space-x-1 p-4 flex-wrap gap-2">
              {[
                { id: 'pending', label: 'PENDING', icon: AlertCircle, color: 'amber', count: pendingBookings.length },
                { id: 'all', label: 'ALL BOOKINGS', icon: LayoutGrid, color: 'cyan' },
                { id: 'APPROVED', label: 'APPROVED', icon: CheckCircle, color: 'emerald' },
                { id: 'REJECTED', label: 'REJECTED', icon: XCircle, color: 'red' },
                { id: 'CANCELLED', label: 'CANCELLED', icon: X, color: 'gray' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 flex items-center space-x-2 overflow-hidden group ${
                    activeTab === tab.id
                      ? `text-${tab.color}-400`
                      : 'text-gray-500 hover:text-cyan-400'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r from-${tab.color}-500/20 to-transparent rounded-xl`}></div>
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-${tab.color}-500 to-transparent transform transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'
                  }`}></div>
                  <tab.icon size={16} className="relative z-10" />
                  <span className="relative z-10 tracking-wider">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`relative z-10 ml-1 px-2 py-0.5 text-xs rounded-full bg-${tab.color}-500/20 text-${tab.color}-400`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="p-6 border-b border-cyan-500/20">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search quantum records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 placeholder-gray-500 font-mono"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2.5 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                >
                  <option value="all">ALL RESOURCES</option>
                  <option value="LECTURE_HALL">🏛️ LECTURE HALL</option>
                  <option value="LAB">💻 LABORATORY</option>
                  <option value="MEETING_ROOM">👥 MEETING ROOM</option>
                  <option value="EQUIPMENT">📷 EQUIPMENT</option>
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                  }}
                  className="px-4 py-2.5 text-cyan-400 hover:text-cyan-300 transition-all duration-300 flex items-center space-x-2 border border-cyan-500/30 rounded-xl hover:border-cyan-500/60 bg-cyan-500/5"
                >
                  <RefreshCw size={16} />
                  <span className="font-mono">RESET</span>
                </button>
                
                <button
                  onClick={() => setShowAddResourceModal(true)}
                  className="relative px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-mono text-white hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 flex items-center space-x-2 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus size={16} className="relative z-10" />
                  <span className="relative z-10 tracking-wider">CREATE RESOURCE</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Bookings List - Holographic Cards */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                  <Database size={40} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Quantum Records Found</h3>
                <p className="text-gray-500">No bookings match your current filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, idx) => (
                  <div 
                    key={booking.id} 
                    className="group relative bg-gradient-to-r from-cyan-500/5 to-purple-500/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="md:flex">
                      <div className="md:w-56 h-48 md:h-auto relative overflow-hidden">
                        <img 
                          src={booking.resourceImage ? (booking.resourceImage.startsWith('http') ? booking.resourceImage : `${API_BASE_URL}${booking.resourceImage}`) : 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop'} 
                          alt={booking.resourceName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-mono border backdrop-blur-sm ${getStatusBadge(booking.status)}`}>
                            <span>{booking.status}</span>
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="text-xs text-cyan-400/70 font-mono">{booking.resourceType}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-200 mb-1">{booking.resourceName}</h3>
                            <p className="text-xs font-mono text-cyan-400/60">
                              REF: {booking.bookingReference} • INIT: {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-300">{booking.studentName}</p>
                            <p className="text-xs text-cyan-400/60 flex items-center">
                              <Mail size={10} className="mr-1" />
                              {booking.studentEmail}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Calendar size={14} className="text-cyan-400" />
                            <span className="font-mono">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Clock size={14} className="text-cyan-400" />
                            <span className="font-mono">{booking.startTime} — {booking.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Users size={14} className="text-cyan-400" />
                            <span>{booking.attendees || 0} attendees</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-xs text-cyan-400/60 mb-1 font-mono tracking-wider">PURPOSE</p>
                          <p className="text-gray-300">{booking.purpose}</p>
                        </div>
                        
                        {booking.specialRequests && (
                          <div className="mb-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/20">
                            <p className="text-xs text-amber-400 mb-1 font-mono flex items-center">
                              <MessageSquare size={12} className="mr-1" />
                              SPECIAL REQUESTS
                            </p>
                            <p className="text-sm text-amber-300/80">{booking.specialRequests}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-3 mt-4">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => approveBooking(booking)}
                                className="relative px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-mono text-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center space-x-2 overflow-hidden group"
                              >
                                <ThumbsUp size={14} />
                                <span>APPROVE</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRejectionModal(true);
                                }}
                                className="relative px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white font-mono text-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 flex items-center space-x-2 overflow-hidden group"
                              >
                                <ThumbsDown size={14} />
                                <span>REJECT</span>
                              </button>
                            </>
                          )}
                          {booking.status === 'APPROVED' && (
                            <button
                              onClick={() => cancelApprovedBooking(booking)}
                              className="relative px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-mono text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 flex items-center space-x-2 overflow-hidden group"
                            >
                              <X size={14} />
                              <span>CANCEL</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowApprovalModal(true);
                            }}
                            className="px-5 py-2 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono text-sm hover:border-cyan-500/60 hover:text-cyan-300 transition-all duration-300 flex items-center space-x-2 bg-cyan-500/5"
                          >
                            <Eye size={14} />
                            <span>DETAILS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resource Management Section - Holographic Grid */}
        <div className="bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <Layers size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">RESOURCE LIBRARY</h2>
                <p className="text-sm text-cyan-400/60 font-mono">Quantum Resource Inventory • {resources.length} Active Nodes</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="relative px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-mono text-white hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 flex items-center space-x-2 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus size={16} className="relative z-10" />
              <span className="relative z-10 tracking-wider">DEPLOY RESOURCE</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, idx) => (
              <div 
                key={resource.id} 
                className="group relative bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]"
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={getResourceImage(resource)} 
                    alt={resource.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-mono backdrop-blur-sm border ${
                      resource.status === 'ACTIVE' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white mb-1">{resource.name}</h3>
                    <p className="text-cyan-400/70 text-sm flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {resource.location}
                    </p>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Users size={14} className="text-cyan-400" />
                        <span className="font-mono">CAP: {resource.capacity}</span>
                      </div>
                      <div className="w-1 h-1 bg-cyan-500/30 rounded-full"></div>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span>{resource.rating || 4.8}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs font-mono text-cyan-400">
                      <Sparkles size={12} />
                      <span>ACTIVE</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.amenities && resource.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-mono">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editResource(resource)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white text-sm font-mono hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300 flex items-center justify-center space-x-1"
                    >
                      <Edit size={14} />
                      <span>EDIT</span>
                    </button>
                    <button
                      onClick={() => deleteResource(resource)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white text-sm font-mono hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 flex items-center justify-center space-x-1"
                    >
                      <Trash2 size={14} />
                      <span>PURGE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Approval Modal - Holographic */}
      {showApprovalModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.3)] max-w-md w-full border border-cyan-500/30 animate-fade-in-up">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">Confirm Approval</h3>
                <p className="text-gray-400 font-mono">Authorize this booking request</p>
              </div>
              
              <div className="bg-cyan-500/5 rounded-xl p-4 mb-6 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 mb-2 font-mono">BOOKING MANIFEST</p>
                <p className="font-medium text-gray-200">{selectedBooking.resourceName}</p>
                <p className="text-sm text-gray-400 font-mono">{new Date(selectedBooking.bookingDate).toLocaleDateString()} • {selectedBooking.startTime} — {selectedBooking.endTime}</p>
                <p className="text-sm text-gray-400 mt-2">Requester: {selectedBooking.studentName}</p>
                <p className="text-sm text-gray-400 font-mono">{selectedBooking.studentEmail}</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2.5 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono hover:border-cyan-500/60 hover:text-cyan-300 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => approveBooking(selectedBooking)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-mono hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  APPROVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_60px_rgba(239,68,68,0.3)] max-w-md w-full border border-red-500/30 animate-fade-in-up">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <XCircle size={32} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">Reject Booking</h3>
                <p className="text-gray-400 font-mono">Provide rejection reason</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  REJECTION REASON <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  placeholder="Explain why this booking is being rejected..."
                  className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 placeholder-gray-500 font-mono"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="flex-1 px-4 py-2.5 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono hover:border-cyan-500/60 hover:text-cyan-300 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={rejectBookingRequest}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-mono hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                >
                  REJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.3)] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 animate-fade-in-up">
            <div className="sticky top-0 bg-[#0a0a0f]/95 border-b border-cyan-500/20 px-6 py-4 flex justify-between items-center backdrop-blur-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Deploy New Resource</h2>
                  <p className="text-sm text-cyan-400/60 font-mono">Initialize resource in quantum inventory</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddResourceModal(false)}
                className="text-gray-400 hover:text-cyan-400 transition-colors w-8 h-8 rounded-full flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500/60"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 transition-all">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Upload Resource Imagery</h3>
                  <p className="text-sm text-gray-400 mb-4">Upload up to 5 high-resolution images</p>
                  
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
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all inline-flex items-center space-x-2"
                  >
                    <Upload size={16} />
                    <span>SELECT IMAGES</span>
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
                            className="w-full h-32 object-cover rounded-xl border border-cyan-500/30"
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
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    RESOURCE NAME <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.name}
                    onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                    placeholder="e.g., Quantum Computing Lab"
                  />
                  {resourceErrors.name && <p className="text-red-400 text-xs mt-1">{resourceErrors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    RESOURCE TYPE
                  </label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  >
                    <option value="LECTURE_HALL">🏛️ LECTURE HALL</option>
                    <option value="LAB">💻 LABORATORY</option>
                    <option value="MEETING_ROOM">👥 MEETING ROOM</option>
                    <option value="EQUIPMENT">📷 EQUIPMENT</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    CAPACITY <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={resourceForm.capacity}
                    onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                    placeholder="Maximum occupants"
                  />
                  {resourceErrors.capacity && <p className="text-red-400 text-xs mt-1">{resourceErrors.capacity}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    LOCATION <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.location}
                    onChange={(e) => setResourceForm({ ...resourceForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                    placeholder="Coordinates / Building"
                  />
                  {resourceErrors.location && <p className="text-red-400 text-xs mt-1">{resourceErrors.location}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  DESCRIPTION <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  placeholder="Describe the resource, its capabilities, and specifications..."
                />
                {resourceErrors.description && <p className="text-red-400 text-xs mt-1">{resourceErrors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    AMENITIES (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.amenities}
                    onChange={(e) => setResourceForm({ ...resourceForm, amenities: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                    placeholder="Projector, WiFi, AC, Whiteboard"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    SPECIAL FEATURES (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.features}
                    onChange={(e) => setResourceForm({ ...resourceForm, features: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                    placeholder="Wheelchair Access, Recording System"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddResourceModal(false)}
                  className="flex-1 px-4 py-2.5 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono hover:border-cyan-500/60 hover:text-cyan-300 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={addResource}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-mono hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isLoading ? 'DEPLOYING...' : 'DEPLOY RESOURCE'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.3)] max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 animate-fade-in-up">
            <div className="sticky top-0 bg-[#0a0a0f]/95 border-b border-cyan-500/20 px-6 py-4 flex justify-between items-center backdrop-blur-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Edit size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Modify Resource</h2>
                  <p className="text-sm text-cyan-400/60 font-mono">Update resource configuration</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditResourceModal(false)}
                className="text-gray-400 hover:text-cyan-400 transition-colors w-8 h-8 rounded-full flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500/60"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Existing Images Preview */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">CURRENT IMAGERY</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group/image">
                        <img 
                          src={url} 
                          alt={`Resource image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-cyan-500/30"
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
              <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 transition-all">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Add New Images</h3>
                  <p className="text-sm text-gray-400 mb-4">Upload additional images for this resource</p>
                  
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
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all inline-flex items-center space-x-2"
                  >
                    <Upload size={16} />
                    <span>SELECT IMAGES</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    RESOURCE NAME <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.name}
                    onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                  {resourceErrors.name && <p className="text-red-400 text-xs mt-1">{resourceErrors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    RESOURCE TYPE
                  </label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  >
                    <option value="LECTURE_HALL">🏛️ LECTURE HALL</option>
                    <option value="LAB">💻 LABORATORY</option>
                    <option value="MEETING_ROOM">👥 MEETING ROOM</option>
                    <option value="EQUIPMENT">📷 EQUIPMENT</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    CAPACITY <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={resourceForm.capacity}
                    onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                  {resourceErrors.capacity && <p className="text-red-400 text-xs mt-1">{resourceErrors.capacity}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    LOCATION <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={resourceForm.location}
                    onChange={(e) => setResourceForm({ ...resourceForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                  {resourceErrors.location && <p className="text-red-400 text-xs mt-1">{resourceErrors.location}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  DESCRIPTION <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                />
                {resourceErrors.description && <p className="text-red-400 text-xs mt-1">{resourceErrors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    AMENITIES (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.amenities}
                    onChange={(e) => setResourceForm({ ...resourceForm, amenities: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    SPECIAL FEATURES (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resourceForm.features}
                    onChange={(e) => setResourceForm({ ...resourceForm, features: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    CONTACT PERSON
                  </label>
                  <input
                    type="text"
                    value={resourceForm.contactPerson}
                    onChange={(e) => setResourceForm({ ...resourceForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    CONTACT EMAIL
                  </label>
                  <input
                    type="email"
                    value={resourceForm.contactEmail}
                    onChange={(e) => setResourceForm({ ...resourceForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  STATUS
                </label>
                <select
                  value={resourceForm.status}
                  onChange={(e) => setResourceForm({ ...resourceForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  USAGE RULES
                </label>
                <textarea
                  value={resourceForm.rules}
                  onChange={(e) => setResourceForm({ ...resourceForm, rules: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 text-gray-300 font-mono"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEditResourceModal(false)}
                  className="flex-1 px-4 py-2.5 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono hover:border-cyan-500/60 hover:text-cyan-300 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={updateResource}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-mono hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isLoading ? 'UPDATING...' : 'UPDATE RESOURCE'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-100px);
            opacity: 1;
          }
        }
        
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0f;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
        
        /* Selection color */
        ::selection {
          background: rgba(6, 182, 212, 0.3);
          color: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;