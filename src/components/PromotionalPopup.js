import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Lottie from 'lottie-react';
import loaderAnimation from '../Assets/animations/loading.json';

const PromotionalPopup = () => {  // Initialize with visible=false and loading=true
  const [popups, setPopups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);  useEffect(() => {
    const fetchEligiblePopups = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        let response;
        
        // If token exists, make authenticated request
        if (token) {
          response = await axios.get('https://pawsome.soluzent.com/api/promotional-popups/eligible', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
        } else {
          // Fallback to active popups endpoint for non-authenticated users
          response = await axios.get('https://pawsome.soluzent.com/api/promotional-popups/active');
        }
        
        const eligiblePopups = response.data;

        // If there are eligible popups, display them immediately
        if (eligiblePopups && eligiblePopups.length > 0) {
          console.log('Found popups:', eligiblePopups.length);
          setPopups(eligiblePopups);
          setIsVisible(true); // Set to visible immediately
          setIsImageLoaded(false); // Reset image loading state
        } else {
          console.log('No popups found from API, not showing any popups');
          // Don't set any popups and don't make visible
          setPopups([]);
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error fetching promotional popups:', error);
        // Don't show any fallback popups in case of error
        setPopups([]);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch popups immediately when the component mounts
    fetchEligiblePopups();
  }, []);const handleClose = async () => {
    // Mark current popup as viewed
    if (popups.length > 0) {
      try {
        const token = localStorage.getItem('accessToken');
        
        await axios.post('https://pawsome.soluzent.com/api/promotional-popups/viewed', 
        {
          popupId: popups[currentIndex].id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error marking popup as viewed:', error);
      }
    }
    setIsVisible(false);
  };
  const handleRedirect = () => {
    // Mark current popup as viewed
    if (popups.length > 0) {
      try {
        const token = localStorage.getItem('accessToken');
        
        axios.post('https://pawsome.soluzent.com/api/promotional-popups/viewed', 
        {
          popupId: popups[currentIndex].id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        // Open target URL in current tab if available
        const targetUrl = popups[currentIndex].targetUrl;
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      } catch (error) {
        console.error('Error marking popup as viewed:', error);
      }
    }
    setIsVisible(false);
  };

  const markPopupAsViewed = async (popupId) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      await axios.post('https://pawsome.soluzent.com/api/promotional-popups/viewed', 
      {
        popupId: popupId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Marked popup as viewed:', popupId);
    } catch (error) {
      console.error('Error marking popup as viewed:', error);
    }
  };

  const handleNext = async () => {
    // Mark current popup as viewed before navigating
    if (popups.length > 0) {
      await markPopupAsViewed(popups[currentIndex].id);
    }
    
    setIsImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % popups.length);
  };

  const handlePrevious = async () => {
    // Mark current popup as viewed before navigating
    if (popups.length > 0) {
      await markPopupAsViewed(popups[currentIndex].id);
    }
    
    setIsImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + popups.length) % popups.length);
  };
  if (!isVisible || popups.length === 0) {
    console.log('Not showing popup - isVisible:', isVisible, 'popups:', popups.length);
    return null;
  }
  
  const currentPopup = popups[currentIndex];
  console.log('Showing popup:', currentPopup.name);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="w-full aspect-[4/3] flex items-center justify-center">
            <Lottie
              animationData={loaderAnimation}
              style={{ width: 120, height: 120 }}
            />
          </div>
        )}        {/* Popup Content */}
        {!isLoading && (
          <>
            {/* Popup Image with Loading State */}
            <div className="w-full aspect-[4/3] overflow-hidden relative">
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lottie
                    animationData={loaderAnimation}
                    style={{ width: 120, height: 120 }}
                  />
                </div>
              )}
              <img 
                src={currentPopup.image?.url} 
                alt={currentPopup.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {/* Navigation Buttons (Only show if there are multiple popups) */}
              {popups.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentPopup.name}</h2>
              <p className="text-gray-600 mb-6">{currentPopup.description}</p>

              {/* Pagination indicator */}
              {popups.length > 1 && (
                <div className="flex justify-center gap-1 mb-4">
                  {popups.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-2 rounded-full ${
                        index === currentIndex ? 'w-4 bg-amber-500' : 'w-2 bg-gray-300'
                      } transition-all`}
                    />
                  ))}
                </div>
              )}

              {/* Call to Action Button */}
              <button 
                onClick={handleRedirect}
                className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                Shop Now
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionalPopup;