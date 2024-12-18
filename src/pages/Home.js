// src/pages/Home.js
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Stats from '../components/sections/Stats';
import Portfolio from '../components/sections/Portfolio';
import Team from '../components/sections/Team';
import Contact from '../components/sections/Contact';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Stats />
      <Portfolio />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;