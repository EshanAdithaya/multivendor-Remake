import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Lottie from 'lottie-react';
import loaderAnimation from '../Assets/animations/loading.json';

const PromotionalPopup = () => {
  const [popup, setPopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPromotionalPopup = async () => {
      try {
        // Check if popup has been shown today
        const shownPopupId = Cookies.get('shown_popup_id');
        
        // Fetch active promotional popups
        const response = await axios.get('https://pawsome.soluzent.com/api/promotional-popups/active');
        const activePopups = response.data;

        // If there are active popups and the current popup hasn't been shown
        if (activePopups.length > 0) {
          const currentPopup = activePopups[0]; // Take the first active popup
          
          // Check if this popup has already been shown
          if (currentPopup.id !== shownPopupId) {
            setPopup(currentPopup);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error fetching promotional popup:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotionalPopup();
  }, []);

  const handleClose = () => {
    // Save popup ID in a cookie that expires in 1 day
    if (popup) {
      Cookies.set('shown_popup_id', popup.id, { expires: 1 });
    }
    setIsVisible(false);
  };

  const handleRedirect = () => {
    // Save popup ID in a cookie that expires in 1 day
    if (popup) {
      Cookies.set('shown_popup_id', popup.id, { expires: 1 });
      // Open target URL in current tab
      window.location.href = popup.targetUrl;
    }
    setIsVisible(false);
  };

  if (!isVisible || !popup) return null;

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
        )}

        {/* Popup Content */}
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
                src={popup.image?.url} 
                alt={popup.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>

            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{popup.name}</h2>
              <p className="text-gray-600 mb-6">{popup.description}</p>

              {/* Call to Action Button */}
              <button 
                onClick={handleRedirect}
                className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
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