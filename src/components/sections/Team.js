// src/components/sections/Team.js
import React from 'react';
import TeamMember from '../ui/TeamMember';

const Team = () => (
    <section id="team" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Meet the experts behind our success
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TeamMember 
            name="Gihan Pasindu"
            role="Chief Executive Officer"
            image="/api/placeholder/400/300"
          />
          <TeamMember 
            name="Eshan Gunathilaka"
            role="Chief Technology Officer"
            image="/api/placeholder/400/300"
          />
          <TeamMember 
            name="Sithija Kaushalya"
            role="Chief Operating Officer"
            image="/api/placeholder/400/300"
          />
        </div>
      </div>
    </section>
  );

export default Team;
