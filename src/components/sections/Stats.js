// src/components/sections/Stats.js
import React from 'react';

// Stats Section
const Stats = () => (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl font-bold text-white mb-2">100+</div>
            <div className="text-blue-100">Successful Projects</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-blue-100">Worldwide Clients</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl font-bold text-white mb-2">5</div>
            <div className="text-blue-100">Digital Products</div>
          </div>
        </div>
      </div>
    </section>
  );

export default Stats;