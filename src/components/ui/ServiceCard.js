// src/components/ui/ServiceCard.js
import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon: Icon, title, description }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
  
export default ServiceCard;