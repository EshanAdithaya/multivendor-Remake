// src/components/ui/TeamMember.js
import React from 'react';
import { motion } from 'framer-motion';

const TeamMember = ({ name, role, image }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-gray-600">{role}</p>
      </div>
    </motion.div>
  );

export default TeamMember;