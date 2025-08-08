import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const PropertyGallery = ({ images = [], address }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <ApperIcon name="ImageOff" className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div 
        className="relative h-96 rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={images[currentIndex]}
          alt={`${address} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ApperIcon name="ChevronLeft" className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ApperIcon name="ChevronRight" className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Expand Icon */}
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ApperIcon name="Expand" className="h-5 w-5" />
        </div>
      </motion.div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-accent scale-105"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${address} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                alt={`${address} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </button>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                  >
                    <ApperIcon name="ChevronRight" className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} of {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyGallery;