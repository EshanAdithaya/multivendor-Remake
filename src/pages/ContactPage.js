import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "We'll respond within 24 hours",
      value: "support@petdoc.com",
      action: "mailto:support@petdoc.com",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "WhatsApp",
      description: "Chat with us directly",
      value: "+1 234 567 8900",
      action: "https://wa.me/1234567890",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      description: "Mon-Fri from 8am to 5pm",
      value: "+1 234 567 8900",
      action: "tel:+1234567890",
      color: "bg-yellow-50 text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="p-4 border-b">
        <img src="/api/placeholder/40/40" alt="PetDoc Logo" className="w-10 h-10" />
      </div>

      {/* Contact Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-600">We'd love to hear from you. Please get in touch!</p>
      </div>

      {/* Contact Methods Grid */}
      <div className="px-4 grid grid-cols-1 gap-4 mb-8">
        {contactMethods.map((method, index) => (
          <a
            key={index}
            href={method.action}
            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${method.color}`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
                <p className="mt-1 font-medium text-gray-900">{method.value}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <div className="px-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Location Map */}
      <div className="px-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Our Location</h2>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <img 
              src="/api/placeholder/800/400" 
              alt="Map location" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="mt-4 text-gray-600">
            123 Pet Street, Animal District<br />
            New York, NY 10001
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;