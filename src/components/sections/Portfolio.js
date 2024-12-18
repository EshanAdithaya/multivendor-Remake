// src/components/sections/Portfolio.js
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Portfolio Section
const Portfolio = () => {
    const projects = [
      {
        title: "MateCeylon",
        description: "Coconut base product Company",
        image: "/api/placeholder/400/300",
        link: "https://mateceylon.com/"
      },
      {
        title: "Samee Products",
        description: "Spices product Company",
        image: "/api/placeholder/400/300",
        link: "https://sameeproducts.lk/"
      }
    ];
  
    return (
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Portfolio
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Recent projects we're proud of
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    Visit Website <ChevronRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

export default Portfolio;