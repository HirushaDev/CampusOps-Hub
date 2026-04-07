// ModernResourceBooking.js - Cyberpunk Glassmorphism Edition
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, GraduationCap, Building2, Laptop, Wrench, MapPin,
  CheckCircle, XCircle, AlertCircle, Mail, User, Phone, ChevronDown,
  ChevronUp, Search, SlidersHorizontal, X, Sparkles, Star, TrendingUp,
  LayoutGrid, ArrowRight, Loader2, RefreshCw, Heart, Wifi, Wind, Maximize,
  Coffee, Tv, Mic, Video, BookOpen, Award, Target, Globe, Hexagon,
  Shield, Zap, Eye, Fingerprint, Lock, Key, Cpu, Database, Cloud
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';

// Category configuration with cyberpunk styling
const categories = [
  { 
    id: 'LECTURE_HALL', 
    name: 'LECTURE HALLS', 
    icon: Building2, 
    gradient: 'from-cyan-500 to-blue-500',
    border: 'cyan',
    glow: 'rgba(6,182,212,0.3)',
    description: 'Quantum learning spaces for knowledge transfer'
  },
  { 
    id: 'LAB', 
    name: 'LABORATORIES', 
    icon: Cpu, 
    gradient: 'from-purple-500 to-pink-500',
    border: 'purple',
    glow: 'rgba(168,85,247,0.3)',
    description: 'High-tech experimental environments'
  },
  { 
    id: 'MEETING_ROOM', 
    name: 'MEETING ROOMS', 
    icon: Users, 
    gradient: 'from-emerald-500 to-teal-500',
    border: 'emerald',
    glow: 'rgba(16,185,129,0.3)',
    description: 'Neural collaboration hubs'
  },
  { 
    id: 'EQUIPMENT', 
    name: 'EQUIPMENT', 
    icon: Zap, 
    gradient: 'from-amber-500 to-orange-500',
    border: 'amber',
    glow: 'rgba(245,158,11,0.3)',
    description: 'Advanced technological assets'
  }
];

const ModernResourceBooking = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', phone: '' });
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const [bookingForm, setBookingForm] = useState({
    date: '', purpose: '', attendees: 1,
    studentName: '', studentEmail: '', studentPhone: '',
    specialRequests: '', agreeTerms: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Default images for different resource types
  const getDefaultImage = (type) => {
    const defaultImages = {
      LECTURE_HALL: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&h=500&fit=crop',
      LAB: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop',
      MEETING_ROOM: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=500&fit=crop',
      EQUIPMENT: 'https://images.unsplash.com/photo-1581092335871-4c2c9b6b4d7a?w=800&h=500&fit=crop'
    };
    return defaultImages[type] || defaultImages.LECTURE_HALL;
  };

  // Get image URL with fallback
  const getImageUrl = (resource) => {
    if (resource.images && resource.images.length > 0 && resource.images[0]) {
      const img = resource.images[0];
      if (img.startsWith('http')) return img;
      return `${API_BASE_URL}${img}`;
    }
    return getDefaultImage(resource.type);
  };

  // Generate 2-hour time slots
  const generateTimeSlots = () => {
    const slots = [];
    const timeSlots = [
      { start: 8, end: 10, label: '08:00 — 10:00' },
      { start: 10, end: 12, label: '10:00 — 12:00' },
      { start: 12, end: 14, label: '12:00 — 14:00' },
      { start: 14, end: 16, label: '14:00 — 16:00' },
      { start: 16, end: 18, label: '16:00 — 18:00' }
    ];
    
    timeSlots.forEach(slot => {
      slots.push({
        id: `${slot.start}-${slot.end}`,
        startTime: `${slot.start.toString().padStart(2, '0')}:00`,
        endTime: `${slot.end.toString().padStart(2, '0')}:00`,
        displayTime: slot.label,
        startHour: slot.start,
        endHour: slot.end
      });
    });
    return slots;
  };

  // Load resources
  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resources`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setResources(data.data);
          setFilteredResources(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Filter resources based on category and search
  useEffect(() => {
    let filtered = [...resources];
    
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(r => r.type === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredResources(filtered);
  }, [selectedCategory, searchQuery, resources]);

  const handleBooking = (resource) => {
    setSelectedResource(resource);
    setSelectedDate('');
    setSelectedSlot(null);
    setExistingBookings([]);
    setBookingForm({
      date: '', purpose: '', attendees: 1,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone,
      specialRequests: '', agreeTerms: false
    });
    setFormErrors({});
    setTouched({});
    setShowBookingModal(true);
  };

  const loadExistingBookings = async (resourceId, date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          const resourceBookings = data.data.filter(b => 
            b.resourceId === resourceId && b.bookingDate === date
          );
          setExistingBookings(resourceBookings);
          return resourceBookings;
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading existing bookings:', error);
      return [];
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookingForm(prev => ({ ...prev, date }));
    
    const existing = await loadExistingBookings(selectedResource.id, date);
    const allSlots = generateTimeSlots();
    
    const bookedTimes = existing.map(b => b.startTime);
    const availableSlots = allSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.startTime),
      bookingStatus: existing.find(b => b.startTime === slot.startTime)?.status
    }));
    
    setAvailableTimeSlots(availableSlots);
  };

  const getSlotStatus = (slot) => {
    if (!slot.available) {
      const status = slot.bookingStatus;
      if (status === 'APPROVED') {
        return { disabled: true, className: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50 text-red-400 cursor-not-allowed line-through', message: 'BOOKED' };
      }
      if (status === 'PENDING') {
        return { disabled: true, className: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-400 cursor-not-allowed', message: 'PENDING' };
      }
      return { disabled: true, className: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/50 text-gray-400 cursor-not-allowed', message: 'UNAVAILABLE' };
    }
    
    if (selectedSlot && selectedSlot.id === slot.id) {
      return { disabled: false, className: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]', message: 'SELECTED' };
    }
    
    return { disabled: false, className: 'bg-cyan-500/5 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500/60 hover:bg-cyan-500/10', message: 'AVAILABLE' };
  };

  const toggleTimeSlot = (slot) => {
    if (!slot.available) {
      return;
    }
    
    if (selectedSlot && selectedSlot.id === slot.id) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch(name) {
      case 'studentName':
        if (!value.trim()) error = 'Identity verification required';
        else if (value.trim().length < 3) error = 'Minimum 3 characters required';
        break;
      case 'studentEmail':
        if (!value.trim()) error = 'Email authentication required';
        else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(value)) error = 'Valid neural-email required';
        break;
      case 'studentPhone':
        if (!value.trim()) error = 'Contact frequency required';
        break;
      case 'date':
        if (!value) error = 'Temporal coordinates required';
        break;
      case 'purpose':
        if (!value.trim()) error = 'Mission objective required';
        else if (value.trim().length < 15) error = 'Minimum 15 characters required';
        break;
      case 'attendees':
        if (!value) error = 'Team size required';
        else if (value < 1) error = 'Minimum 1 operative';
        else if (value > selectedResource?.capacity) error = `Exceeds maximum capacity: ${selectedResource?.capacity}`;
        break;
      case 'agreeTerms':
        if (!value) error = 'Protocol acceptance required';
        break;
    }
    return error;
  };

  const handleFieldChange = (name, value) => {
    setBookingForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
    if (name === 'studentName') setCurrentUser(prev => ({ ...prev, name: value }));
    if (name === 'studentEmail') setCurrentUser(prev => ({ ...prev, email: value }));
    if (name === 'studentPhone') setCurrentUser(prev => ({ ...prev, phone: value }));
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, bookingForm[name]);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    const fields = ['studentName', 'studentEmail', 'studentPhone', 'date', 'purpose', 'attendees', 'agreeTerms'];
    fields.forEach(field => {
      const error = validateField(field, bookingForm[field]);
      if (error) errors[field] = error;
    });
    if (!selectedSlot) errors.timeSlot = 'Temporal slot selection required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitBooking = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const bookingData = {
      resourceId: selectedResource.id,
      bookingDate: bookingForm.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      purpose: bookingForm.purpose,
      attendees: parseInt(bookingForm.attendees),
      specialRequests: bookingForm.specialRequests || "",
      studentName: bookingForm.studentName,
      studentEmail: bookingForm.studentEmail,
      studentPhone: bookingForm.studentPhone
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert(`✅ Neural booking initiated!\n\nReference: ${result.data.bookingReference}\nTemporal Slot: ${selectedSlot.displayTime}`);
        setShowBookingModal(false);
        setSelectedSlot(null);
        setSelectedDate('');
      } else {
        alert(`❌ Booking failed: ${result.message || 'System error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Neural network error. Retry connection.');
    }
    
    setIsLoading(false);
  };

  // Group resources by category
  const resourcesByCategory = categories.map(cat => ({
    ...cat,
    resources: filteredResources.filter(r => r.type === cat.id)
  })).filter(cat => cat.resources.length > 0);

  const allResourcesCount = filteredResources.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba(0%2C%20255%2C%20255%2C%200.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%2F%3E%3C%2Fsvg%3E')]"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-[30%] left-[10%] w-1 h-1 bg-cyan-400 rounded-full animate-float"></div>
        <div className="absolute top-[70%] right-[15%] w-1 h-1 bg-purple-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-[50%] left-[80%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-float animation-delay-2000"></div>
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-scan"></div>
      </div>

      {/* Hero Section - Holographic */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-blue-900/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                <Hexagon size={26} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                CAMPUS NEXUS
              </h1>
              <p className="text-cyan-400/70 font-mono">Quantum Resource Allocation System • v2.0</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 z-10" />
                <input
                  type="text"
                  placeholder="Search quantum resources by name, location, or specifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 placeholder-gray-500 font-mono transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 backdrop-blur-xl rounded-2xl px-5 py-2.5 border border-cyan-500/30">
                <span className="text-sm font-mono text-cyan-400">{allResourcesCount} ACTIVE NODES</span>
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 flex items-center justify-center group"
              >
                <RefreshCw size={18} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - Neon Tabs */}
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`relative px-6 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 whitespace-nowrap flex items-center gap-2 overflow-hidden group ${
                selectedCategory === 'ALL'
                  ? 'text-cyan-400'
                  : 'text-gray-500 hover:text-cyan-400'
              }`}
            >
              {selectedCategory === 'ALL' && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-xl"></div>
              )}
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-transparent transform transition-transform duration-300 ${
                selectedCategory === 'ALL' ? 'scale-x-100' : 'scale-x-0'
              }`}></div>
              <LayoutGrid size={16} className="relative z-10" />
              <span className="relative z-10 tracking-wider">ALL RESOURCES</span>
              <span className="relative z-10 ml-1 px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400">
                {allResourcesCount}
              </span>
            </button>
            
            {categories.map(cat => {
              const Icon = cat.icon;
              const count = resources.filter(r => r.type === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-6 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 whitespace-nowrap flex items-center gap-2 overflow-hidden group ${
                    selectedCategory === cat.id
                      ? `text-${cat.border}-400`
                      : 'text-gray-500 hover:text-cyan-400'
                  }`}
                >
                  {selectedCategory === cat.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r from-${cat.border}-500/20 to-transparent rounded-xl`}></div>
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-${cat.border}-500 to-transparent transform transition-transform duration-300 ${
                    selectedCategory === cat.id ? 'scale-x-100' : 'scale-x-0'
                  }`}></div>
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10 tracking-wider">{cat.name}</span>
                  <span className="relative z-10 ml-1 px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-cyan-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-32 bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
              <Database size={40} className="text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Quantum Resources Found</h3>
            <p className="text-gray-500 font-mono">Adjust your search parameters or category filter</p>
          </div>
        ) : (
          (selectedCategory === 'ALL' ? resourcesByCategory : categories.filter(c => c.id === selectedCategory)).map((category, catIdx) => {
            const CategoryIcon = category.icon;
            const categoryResources = selectedCategory === 'ALL' 
              ? category.resources 
              : filteredResources.filter(r => r.type === category.id);
            
            if (categoryResources.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center shadow-[0_0_20px_${category.glow}]`}>
                      <CategoryIcon size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent tracking-wider">
                        {category.name}
                      </h2>
                      <p className="text-xs text-cyan-400/60 font-mono">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-cyan-400/60">
                    {categoryResources.length} ACTIVE NODES
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryResources.map((resource, idx) => (
                    <div 
                      key={resource.id} 
                      className="group relative bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]"
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={getImageUrl(resource)} 
                          alt={resource.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = getDefaultImage(resource.type);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0a0a0f]/80 backdrop-blur-md rounded-lg px-2 py-1 border border-yellow-500/30">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-mono text-yellow-400">{resource.rating || 4.8}</span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-mono shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            ACTIVE
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-200 mb-1 line-clamp-1">{resource.name}</h3>
                        <p className="text-sm text-cyan-400/60 mb-2 flex items-center">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate font-mono">{resource.location}</span>
                        </p>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{resource.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {resource.amenities?.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-mono">
                              {amenity.length > 15 ? amenity.substring(0, 12) + '...' : amenity}
                            </span>
                          ))}
                          {resource.amenities?.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-mono">
                              +{resource.amenities.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-cyan-400" />
                              <span className="font-mono">{resource.capacity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-cyan-400" />
                              <span className="font-mono">2h SLOTS</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                            <Zap size={12} />
                            <span>FREE ACCESS</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleBooking(resource)}
                          className="relative w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-mono text-sm hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Calendar size={14} className="relative z-10" />
                          <span className="relative z-10 tracking-wider">INITIATE BOOKING</span>
                        </button>
                      </div>
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Booking Modal - Holographic */}
      {showBookingModal && selectedResource && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.3)] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 animate-fade-in-up">
            <div className="sticky top-0 bg-[#0a0a0f]/95 border-b border-cyan-500/20 px-6 py-4 flex justify-between items-center backdrop-blur-2xl">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  INITIATE BOOKING
                </h2>
                <p className="text-xs text-cyan-400/60 font-mono">{selectedResource.name} • Quantum Slot Allocation</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-cyan-400 transition-colors w-8 h-8 rounded-full flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500/60">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info - Holographic Card */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-5 border border-cyan-500/20">
                <h3 className="font-mono text-cyan-400 mb-4 flex items-center gap-2 text-sm tracking-wider">
                  <Fingerprint size={16} />
                  OPERATIVE IDENTITY
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" placeholder="Full Name *" value={bookingForm.studentName}
                      onChange={(e) => handleFieldChange('studentName', e.target.value)}
                      onBlur={() => handleFieldBlur('studentName')}
                      className={`w-full px-3 py-2.5 bg-cyan-500/5 border rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono ${
                        formErrors.studentName && touched.studentName ? 'border-red-500/50' : 'border-cyan-500/30'
                      }`} />
                    {formErrors.studentName && touched.studentName && <p className="text-red-400 text-xs mt-1">{formErrors.studentName}</p>}
                  </div>
                  <div>
                    <input type="email" placeholder="Email Address *" value={bookingForm.studentEmail}
                      onChange={(e) => handleFieldChange('studentEmail', e.target.value)}
                      onBlur={() => handleFieldBlur('studentEmail')}
                      className={`w-full px-3 py-2.5 bg-cyan-500/5 border rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono ${
                        formErrors.studentEmail && touched.studentEmail ? 'border-red-500/50' : 'border-cyan-500/30'
                      }`} />
                    {formErrors.studentEmail && touched.studentEmail && <p className="text-red-400 text-xs mt-1">{formErrors.studentEmail}</p>}
                  </div>
                  <div>
                    <input type="tel" placeholder="Phone Number *" value={bookingForm.studentPhone}
                      onChange={(e) => handleFieldChange('studentPhone', e.target.value)}
                      onBlur={() => handleFieldBlur('studentPhone')}
                      className={`w-full px-3 py-2.5 bg-cyan-500/5 border rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono ${
                        formErrors.studentPhone && touched.studentPhone ? 'border-red-500/50' : 'border-cyan-500/30'
                      }`} />
                    {formErrors.studentPhone && touched.studentPhone && <p className="text-red-400 text-xs mt-1">{formErrors.studentPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2 tracking-wider">TEMPORAL COORDINATES *</label>
                <input type="date" value={bookingForm.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2.5 bg-cyan-500/5 border rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono ${
                    formErrors.date && touched.date ? 'border-red-500/50' : 'border-cyan-500/30'
                  }`} />
                {formErrors.date && touched.date && <p className="text-red-400 text-xs mt-1">{formErrors.date}</p>}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-mono text-cyan-400 tracking-wider">TEMPORAL SLOTS *</label>
                    <span className="text-xs font-mono text-cyan-400">
                      {selectedSlot ? 'SLOT LOCKED' : 'NO SLOT SELECTED'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400"><div className="w-3 h-3 bg-cyan-500/20 border border-cyan-500/30 rounded"></div><span>AVAILABLE</span></div>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400"><div className="w-3 h-3 bg-cyan-600 rounded"></div><span>SELECTED</span></div>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400"><div className="w-3 h-3 bg-amber-500/50 rounded"></div><span>PENDING</span></div>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400"><div className="w-3 h-3 bg-red-500/50 rounded"></div><span>BOOKED</span></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableTimeSlots.map((slot) => {
                      const { disabled, className, message } = getSlotStatus(slot);
                      return (
                        <button
                          key={slot.id}
                          onClick={() => toggleTimeSlot(slot)}
                          disabled={disabled}
                          className={`px-4 py-3 rounded-xl text-sm font-mono transition-all duration-300 border ${className}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot.displayTime}</span>
                            {selectedSlot && selectedSlot.id === slot.id && <CheckCircle size={14} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {formErrors.timeSlot && <p className="text-red-400 text-xs mt-2 font-mono">{formErrors.timeSlot}</p>}
                </div>
              )}

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-400" />
                      <span className="font-mono text-emerald-400">{selectedSlot.displayTime}</span>
                      <span className="text-xs text-emerald-400/60 font-mono">(2 HOURS)</span>
                    </div>
                    <button onClick={() => setSelectedSlot(null)} className="text-red-400 hover:text-red-300 text-xs font-mono transition-all">
                      CHANGE
                    </button>
                  </div>
                </div>
              )}

              {/* Purpose */}
              <div>
                <textarea placeholder="MISSION OBJECTIVE * (minimum 15 characters)" rows="3"
                  value={bookingForm.purpose}
                  onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  onBlur={() => handleFieldBlur('purpose')}
                  className={`w-full px-3 py-2.5 bg-cyan-500/5 border rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono ${
                    formErrors.purpose && touched.purpose ? 'border-red-500/50' : 'border-cyan-500/30'
                  }`} />
                {formErrors.purpose && touched.purpose && <p className="text-red-400 text-xs">{formErrors.purpose}</p>}
              </div>

              {/* Attendees */}
              <div>
                <input type="number" placeholder="TEAM SIZE *" min="1" max={selectedResource.capacity}
                  value={bookingForm.attendees}
                  onChange={(e) => handleFieldChange('attendees', parseInt(e.target.value))}
                  onBlur={() => handleFieldBlur('attendees')}
                  className={`w-full px-3 py-2.5 bg-cyan-500/5 border rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono ${
                    formErrors.attendees && touched.attendees ? 'border-red-500/50' : 'border-cyan-500/30'
                  }`} />
                {formErrors.attendees && touched.attendees && <p className="text-red-400 text-xs">{formErrors.attendees}</p>}
                <p className="text-xs text-cyan-400/40 font-mono mt-1">Maximum capacity: {selectedResource.capacity} operatives</p>
              </div>

              {/* Special Requests */}
              <textarea placeholder="SPECIAL REQUESTS (Optional)" rows="2"
                value={bookingForm.specialRequests}
                onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                className="w-full px-3 py-2.5 bg-cyan-500/5 border border-cyan-500/30 rounded-xl focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-gray-300 font-mono" />

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input type="checkbox" checked={bookingForm.agreeTerms}
                  onChange={(e) => handleFieldChange('agreeTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-cyan-500/30 bg-cyan-500/5 text-cyan-600 focus:ring-cyan-500/20" />
                <span className="text-sm text-gray-400 font-mono">I accept the quantum protocols and terms of service</span>
              </div>
              {formErrors.agreeTerms && touched.agreeTerms && <p className="text-red-400 text-xs font-mono">{formErrors.agreeTerms}</p>}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowBookingModal(false)} className="flex-1 px-4 py-2.5 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono hover:border-cyan-500/60 hover:text-cyan-300 transition-all duration-300">
                  CANCEL
                </button>
                <button onClick={submitBooking} disabled={isLoading || !selectedSlot}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-mono hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  {isLoading ? 'INITIATING...' : 'DEPLOY BOOKING'}
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
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ModernResourceBooking;