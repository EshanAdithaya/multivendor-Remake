import React, { useState, useEffect } from 'react';
import { Settings, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

const MaintenanceMode = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-2xl w-full mx-auto">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl p-4 sm:p-6 md:p-8 text-center">
          {/* Icon and Animation */}
          <div className="mb-6 sm:mb-8">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-blue-500/30 p-4 sm:p-6 rounded-full">
                <Settings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Under Maintenance
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
            We're currently performing scheduled maintenance to improve your experience. 
            We'll be back online shortly.
          </p>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xs sm:text-sm text-gray-300">Status</div>
              <div className="text-sm sm:text-base text-white font-semibold">Maintenance</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xs sm:text-sm text-gray-300">Current Time</div>
              <div className="text-sm sm:text-base text-white font-semibold">{formatTime(currentTime)}</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20 sm:col-span-1 col-span-1">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-2" />
              <div className="text-xs sm:text-sm text-gray-300">Expected</div>
              <div className="text-sm sm:text-base text-white font-semibold">Soon</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">What we're doing:</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Updating system components</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Optimizing database performance</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Implementing security updates</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Testing new features</span>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Check Again
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-gray-400 text-sm">
              {formatDate(currentTime)}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Thank you for your patience. We appreciate your understanding.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Need immediate assistance? Contact us at{' '}
            <a href="mailto:support@pawsome.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              support@pawsome.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;