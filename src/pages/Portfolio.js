import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, Code2, Layout } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Link } from 'react-router-dom';

const categories = ['All', 'Web Development', 'Mobile Apps', 'E-Commerce'];

const projects = [
  {
    id: 'mateceylon',
    title: "MateCeylon",
    category: "E-Commerce",
    description: "A comprehensive e-commerce platform for coconut-based products. Built with modern web technologies focusing on user experience and performance.",
    technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    image: "/api/placeholder/600/400",
    link: "https://mateceylon.com/",
    features: [
      "Responsive design",
      "Product catalog",
      "Shopping cart",
      "Payment integration",
      "Admin dashboard"
    ],
    completionDate: "October 2023",
    previewImage: "/api/placeholder/400/300",
    shortDescription: "Coconut base product Company"
  },
  {
    id: 'sameeproducts',
    title: "Samee Products",
    category: "E-Commerce",
    description: "An innovative e-commerce solution for spice products, featuring a modern design and robust functionality.",
    technologies: ["Next.js", "Express", "PostgreSQL", "Material UI"],
    image: "/api/placeholder/600/400",
    link: "https://sameeproducts.lk/",
    features: [
      "Product filtering",
      "User authentication",
      "Order tracking",
      "Review system",
      "Inventory management"
    ],
    completionDate: "October 2023",
    previewImage: "/api/placeholder/400/300",
    shortDescription: "Spices product Company"
  },
  {
    id: 'Sumaga',
    title: "Samee Products",
    category: "E-Commerce",
    description: "An innovative e-commerce solution for spice products, featuring a modern design and robust functionality.",
    technologies: ["Next.js", "Express", "PostgreSQL", "Material UI"],
    image: "/api/placeholder/600/400",
    link: "https://sameeproducts.lk/",
    features: [
      "Product filtering",
      "User authentication",
      "Order tracking",
      "Review system",
      "Inventory management"
    ],
    completionDate: "October 2023",
    previewImage: "/api/placeholder/400/300",
    shortDescription: "Spices product Company"
  }
];

const ProjectCard = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
  >
    <div className="relative">
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 right-4">
        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
          {project.category}
        </span>
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      
      <div className="mb-4">
        <h4 className="text-base font-semibold mb-2">Technologies:</h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-base font-semibold mb-2">Key Features:</h4>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          {project.features.slice(0, 3).map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-4">
        <div className="space-x-3">
          <Link 
            to={`/portfolio/${project.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
          >
            Visit Website <Globe className="ml-1 w-4 h-4" />
          </a>
        </div>
        <span className="text-gray-500 text-xs">
          {project.completionDate}
        </span>
      </div>
    </div>
  </motion.div>
);

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-10 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-xl text-blue-100">
            Showcasing our best work and successful projects
          </p>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects Grid - Modified for 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-900 text-white mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-400 mb-8">
            Let's work together to create something amazing
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started <ChevronRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;

// Add this to ensure smooth scrolling
if (typeof window !== 'undefined') {
  window.document.documentElement.style.scrollBehavior = 'smooth';
}