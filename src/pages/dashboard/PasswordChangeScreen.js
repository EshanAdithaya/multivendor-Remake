import React from 'react';
import { Eye } from 'lucide-react';

const PasswordChangeScreen = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="w-full border-b border-gray-100 px-4 py-3">
        <div className="flex items-center">
          <div className="relative w-24">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="text-white text-xs transform -rotate-45">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
                  <path d="M15,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S13.9,11,15,11z"/>
                  <path d="M9,11c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S7.9,11,9,11z"/>
                </svg>
              </div>
            </div>
            <span className="absolute bottom-0 left-11 text-sm font-medium text-gray-700">PetDoc</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-12">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Change Password</h1>

          <div className="space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="block text-lg text-gray-500">Old Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Eye className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-lg text-gray-500">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Eye className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-lg text-gray-500">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Eye className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button className="bg-yellow-400 text-white font-semibold px-8 py-3 rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeScreen;