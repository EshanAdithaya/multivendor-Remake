import React from 'react';
import { Github, Linkedin, Mail, Globe, Twitter, FileCode, Coffee, Heart, MessageCircle } from 'lucide-react';
import Header from '../components/Header';

const AuthorsPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Lead Developer & Project Manager",
      avatar: "/api/placeholder/150/150",
      bio: "Full-stack developer with 8 years of experience in building scalable web applications. Led the architectural design and development of PetDoc.",
      contributions: ["Backend Architecture", "API Development", "Team Leadership"],
      socialLinks: {
        github: "https://github.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "UI/UX Designer",
      avatar: "/api/placeholder/150/150",
      bio: "Creative designer focused on crafting intuitive and beautiful user experiences. Responsible for PetDoc's visual design and user interface.",
      contributions: ["UI Design", "User Experience", "Brand Identity"],
      socialLinks: {
        github: "https://github.com/michaelchen",
        linkedin: "https://linkedin.com/in/michaelchen",
        website: "https://michaelchen.design"
      }
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      role: "Frontend Developer",
      avatar: "/api/placeholder/150/150",
      bio: "React specialist with a passion for creating smooth, responsive user interfaces. Implemented PetDoc's frontend features and animations.",
      contributions: ["Frontend Development", "React Components", "Performance Optimization"],
      socialLinks: {
        github: "https://github.com/alexrodriguez",
        linkedin: "https://linkedin.com/in/alexrodriguez",
        email: "alex@petdoc.com"
      }
    }
  ];

  const projectStats = [
    { label: "Lines of Code", value: "50K+", icon: <FileCode className="w-5 h-5" /> },
    { label: "Cups of Coffee", value: "1000+", icon: <Coffee className="w-5 h-5" /> },
    { label: "Happy Users", value: "10K+", icon: <Heart className="w-5 h-5" /> },
    { label: "User Reviews", value: "500+", icon: <MessageCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <Header />

      {/* Hero Section */}
      <div className="bg-yellow-400 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl opacity-90">
            The passionate individuals behind PetDoc who work tirelessly to make pet care easier and more accessible.
          </p>
        </div>
      </div>

      {/* Project Stats */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {projectStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-2 text-yellow-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="space-y-12">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                    <p className="text-yellow-500 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>

                    {/* Contributions */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Key Contributions:</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.contributions.map((contribution) => (
                          <span
                            key={contribution}
                            className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm"
                          >
                            {contribution}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center sm:justify-start gap-4">
                      {member.socialLinks.github && (
                        <a href={member.socialLinks.github} className="text-gray-600 hover:text-yellow-500">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks.linkedin && (
                        <a href={member.socialLinks.linkedin} className="text-gray-600 hover:text-yellow-500">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a href={member.socialLinks.twitter} className="text-gray-600 hover:text-yellow-500">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks.website && (
                        <a href={member.socialLinks.website} className="text-gray-600 hover:text-yellow-500">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {member.socialLinks.email && (
                        <a href={`mailto:${member.socialLinks.email}`} className="text-gray-600 hover:text-yellow-500">
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Information */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About PetDoc</h2>
            <p className="text-gray-600 mb-6">
              PetDoc is an innovative pet care platform designed to connect pet owners with veterinarians,
              pet shops, and essential resources. Our mission is to make pet care accessible, efficient,
              and stress-free for everyone.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://github.com/petdoc" 
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-5xl mx-auto py-8 px-4 text-center text-gray-600">
          <p>Made with ❤️ by the PetDoc Team © 2024</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorsPage;