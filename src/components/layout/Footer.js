// src/components/layout/Footer.js
import React from 'react';

const Footer = () => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Cryste</h3>
            <p className="text-gray-400">
              Empowering businesses through innovative software solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-white">Team</a></li>
              <li><a href="#careers" className="text-gray-400 hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Web Development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">AI Development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cyber Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">info@cryste.online</li>
              <li className="text-gray-400">+94 74 009 0484</li>
              <li className="text-gray-400">Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Cryste Software Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
  
export default Footer;