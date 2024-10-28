import React from 'react';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className="w-full bg-blue-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
        
        {/* Logo và Mô tả ngắn */}
        <div className="text-center lg:text-left">
          <h1 className="text-lg font-bold">AMS</h1>
          <p className="text-xs">Apartment Management System</p>
        </div>

        {/* Quick Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/dashboard" className="hover:text-gray-300 transition">Dashboard</a>
          <a href="/about" className="hover:text-gray-300 transition">About Us</a>
          <a href="/services" className="hover:text-gray-300 transition">Services</a>
          <a href="/contact" className="hover:text-gray-300 transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined className="text-lg hover:text-gray-300 transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="text-lg hover:text-gray-300 transition" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedinOutlined className="text-lg hover:text-gray-300 transition" />
          </a>
        </div>
      </div>

      {/* Dòng cuối nhỏ */}
      <div className="text-center mt-4 text-xs text-gray-200">
        © 2024 Apartment Management System. All rights reserved.
        <span className="px-2">|</span>
        <a href="/privacy-policy" className="hover:text-gray-300 transition">Privacy Policy</a>
        <span className="px-2">|</span>
        <a href="/terms" className="hover:text-gray-300 transition">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
