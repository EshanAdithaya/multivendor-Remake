import React from 'react';
import { motion } from 'framer-motion';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Hero = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    // console.log(container);
  }, []);

  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] // Custom easing for smoother animation
      }
    }
  };

  const floatingTextVariants = {
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
      
      {/* Particle animation */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Title */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="mb-8"
          >
            <div className="overflow-hidden">
              <motion.h1 className="text-5xl md:text-7xl font-extrabold">
                <motion.span
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
                  variants={floatingTextVariants}
                  // animate="animate"
                >
                  Next Generation
                </motion.span>
                <motion.span
                  className="block text-blue-200 mt-2"
                  variants={floatingTextVariants}
                  // animate="animate"
                >
                  Software Solutions
                </motion.span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.6
            }}
          >
            <p className="mt-6 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              We craft cutting-edge software solutions that empower businesses 
              to thrive in the digital age.
            </p>
          </motion.div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.8
            }}
            className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-12"
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              className="rounded-md shadow"
            >
              <a href="#contact"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-all duration-300"
              >
                Get Started
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background animated shapes */}
      <motion.div 
        className="absolute top-1/4 right-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -100, 0],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1
        }}
      />
    </div>
  );
};

export default Hero;