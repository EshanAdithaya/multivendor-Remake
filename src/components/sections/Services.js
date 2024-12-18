// src/components/sections/Services.js
import React from 'react';
import { Code2, Cpu, Globe, Shield, MessageSquare } from 'lucide-react';
import ServiceCard from '../ui/ServiceCard';

const Services = () => (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Comprehensive solutions for your digital needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard 
            icon={Globe}
            title="Web Development"
            description="Custom websites and web applications built with modern technologies and best practices."
          />
          <ServiceCard 
            icon={Cpu}
            title="AI Development"
            description="Cutting-edge AI solutions to automate and optimize your business processes."
          />
          <ServiceCard 
            icon={Shield}
            title="Cyber Security"
            description="Comprehensive security solutions to protect your digital assets."
          />
          <ServiceCard 
            icon={Code2}
            title="Application Development"
            description="Native and cross-platform applications for mobile and desktop."
          />
          <ServiceCard 
            icon={Globe}
            title="Digital Marketing"
            description="Strategic digital marketing solutions to grow your online presence."
          />
          <ServiceCard 
            icon={MessageSquare}
            title="24/7 Support"
            description="Round-the-clock technical support and maintenance services."
          />
        </div>
      </div>
    </section>
  );

export default Services;