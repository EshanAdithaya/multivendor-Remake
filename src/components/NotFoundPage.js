import React from 'react';
import Lottie from 'react-lottie';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notFoundAnimation from '../Assets/animations/not_found_page.json';

// Animation Container Component
export const AnimationContainer = ({ animation, className = "" }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className={`w-full max-w-sm ${className}`}>
      <Lottie options={defaultOptions} />
    </div>
  );
};

// Gradient Title Component
export const GradientTitle = ({ children, className = "" }) => {
  return (
    <h1 className={`text-5xl md:text-6xl font-bold text-yellow-600 ${className}`}>
      {children}
    </h1>
  );
};

// Message Text Component
export const MessageText = ({ children, className = "" }) => {
  return (
    <p className={`text-2xl md:text-3xl text-gray-600 font-medium ${className}`}>
      {children}
    </p>
  );
};

// Yellow Button Component
export const YellowButton = ({ children, onClick, icon: Icon, variant = "primary", className = "" }) => {
  const baseStyles = "font-medium py-3 px-8 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-black",
    secondary: "bg-yellow-100 hover:bg-yellow-200 text-black"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

// Page Container Component
export const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col justify-center items-center min-h-screen text-center px-6 py-8 max-w-3xl mx-auto bg-white ${className}`}>
      {children}
    </div>
  );
};

// Complete NotFoundPage Component using the smaller components
export const NotFoundPage = ({ onGoHome }) => {
  return (
    <PageContainer>
      <AnimationContainer animation={notFoundAnimation} className="mb-4" />
      <GradientTitle className="mb-4">Oof!</GradientTitle>
      <MessageText className="mb-8">
        Looks like this page is not in there.
      </MessageText>
      <YellowButton onClick={onGoHome} icon={ArrowLeft}>
        Go Home
      </YellowButton>
    </PageContainer>
  );
};

// Example usage/demo
const Demo = () => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    console.log('Navigate to home');
    navigate('/'); // Now navigate is properly defined
  };

  return <NotFoundPage onGoHome={handleGoHome} />;
};

export default Demo;