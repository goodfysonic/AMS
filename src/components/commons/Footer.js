import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#469FD1', color: 'white', padding: '18px 32px' }}> 
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between gap-16 text-sm">
          <div className="w-full sm:w-1/3 mb-4">
            <h3 className="font-semibold">About AMS</h3>
            <p>AMS is a modern apartment management system, designed to streamline management processes and improve resident experiences.</p>
          </div>
          <div className="w-full sm:w-1/3 mb-4">
            <h3 className="font-semibold">Contact Us</h3>
            <ul>
              <li>Email: info@ams.com</li>
              <li>Phone: (84) 123-456-789</li>
              <li>Address: 123 ABC Street, XYZ District, HCMC</li>
            </ul>
          </div>
          <div className="w-full sm:w-1/3 mb-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul>
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">News</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 text-xs">
          <p>&copy; {new Date().getFullYear()} AMS - Apartment Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
