// src/pages/ProjectDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Globe, 
  Calendar, 
  CheckCircle2,
  ExternalLink,
  Github
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const projectsData = {
  mateceylon: {
    id: 'mateceylon',
    title: "MateCeylon",
    category: "E-Commerce",
    description: "A comprehensive e-commerce platform for coconut-based products. Built with modern web technologies focusing on user experience and performance.",
    longDescription: `MateCeylon represents a cutting-edge e-commerce solution designed specifically for the coconut product industry. This platform seamlessly combines aesthetic appeal with robust functionality, offering an intuitive shopping experience for customers worldwide.

    Our team developed this solution with a focus on performance, scalability, and user engagement, resulting in a significant increase in online sales and customer satisfaction.`,
    technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "https://mateceylon.com/",
    github: "https://github.com/yourproject", // if applicable
    completionDate: "October 2023",
    features: [
      "Responsive design across all devices",
      "Advanced product filtering and search",
      "Secure payment gateway integration",
      "Real-time inventory management",
      "Customer review and rating system",
      "Admin dashboard with analytics"
    ],
    images: [
      {
        url: "/api/placeholder/800/400",
        caption: "Homepage Design"
      },
      {
        url: "/api/placeholder/800/400",
        caption: "Product Catalog"
      },
      {
        url: "/api/placeholder/800/400",
        caption: "Shopping Cart"
      }
    ],
    results: [
      "50% increase in online sales",
      "30% improvement in user engagement",
      "95% customer satisfaction rate",
      "Reduced bounce rate by 40%"
    ],
    teamMembers: [
      "Lead Developer: John Doe",
      "UI/UX Designer: Jane Smith",
      "Backend Developer: Mike Johnson"
    ]
  },
  sameeproducts: {
    id: 'sameeproducts',
    title: "Samee Products",
    category: "E-Commerce",
    description: "An innovative e-commerce solution for spice products, featuring a modern design and robust functionality.",
    longDescription: `Samee Products showcases the perfect blend of traditional commerce and modern technology. This platform was built to bring Sri Lankan spices to the global market, featuring an elegant design that highlights the rich cultural heritage while providing modern e-commerce functionality.

    The project required careful attention to product presentation and user experience, ensuring that customers can easily browse, learn about, and purchase authentic spice products.`,
    technologies: ["Next.js", "Express", "PostgreSQL", "Material UI"],
    link: "https://sameeproducts.lk/",
    completionDate: "October 2023",
    features: [
      "Interactive product visualization",
      "Multi-currency support",
      "Detailed product information system",
      "Order tracking and history",
      "Customer account management",
      "Integrated blog and recipes section"
    ],
    images: [
      {
        url: "/api/placeholder/800/400",
        caption: "Main Page Design"
      },
      {
        url: "/api/placeholder/800/400",
        caption: "Product Showcase"
      },
      {
        url: "/api/placeholder/800/400",
        caption: "Checkout Process"
      }
    ],
    results: [
      "200% increase in international orders",
      "45% improvement in conversion rate",
      "Expanded market reach to 25+ countries",
      "Enhanced brand visibility"
    ]
  }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projectsData[id];

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Project Header */}
      <div className="pt-24 pb-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/portfolio" 
            className="inline-flex items-center text-white mb-8 hover:text-blue-100"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Portfolio
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <span className="bg-white/20 px-4 py-1 rounded-full">
              {project.category}
            </span>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {project.completionDate}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-6"
              >
                {project.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.url} 
                      alt={image.caption}
                      className="w-full rounded-lg shadow-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">{image.caption}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Project Description */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="text-gray-600 whitespace-pre-line mb-8">
                {project.longDescription}
              </p>

              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {project.results && (
                <>
                  <h3 className="text-xl font-bold mb-4">Project Results</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.results.map((result, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                        <span className="text-gray-600">{result}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Project Links</h3>
                <div className="space-y-4">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View Source
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                </div>
              </div>

              {project.teamMembers && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Team Members</h3>
                  <ul className="space-y-2">
                    {project.teamMembers.map((member, index) => (
                      <li key={index} className="text-gray-600">{member}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;