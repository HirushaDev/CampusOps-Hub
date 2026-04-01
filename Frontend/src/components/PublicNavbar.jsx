import React from 'react';
import { FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const PublicNavbar = () => {

  const navigate = useNavigate();
 
  return (
    <nav className="bg-gray-200">
      
      {/* Top Bar */}
      <div className="border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          
          {/* LEFT - Phone */}
          <div className="flex items-center space-x-2 text-sm">
            <FaPhone className="h-4 w-4" />
            <span>+(94) 776-957-704</span>
          </div>

          {/* RIGHT - Social Icons */}
          <div className="flex items-center space-x-3">
            <a href="#" className="hover:text-blue-600 transition-colors">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors">
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* LEFT - Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={assets.logo} 
              alt="Logo" 
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">CampusOpsHub</h1>
          </div>

          {/* CENTER - Links */}
          <div className="flex space-x-8">
            <a href="/" className="hover:text-blue-600 transition-colors font-medium">Home</a>
             <a href="/services" className="hover:text-blue-600 transition-colors font-medium">Services</a>
            <a href="/about" className="hover:text-blue-600 transition-colors font-medium">About</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors font-medium">Contact</a>
          
          </div>

          {/* RIGHT - Login */}
          <div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2" onClick={() => navigate('/login')}>
              <FiLogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          </div>

        </div>
      </div>

    </nav>
  );
}

export default PublicNavbar;
