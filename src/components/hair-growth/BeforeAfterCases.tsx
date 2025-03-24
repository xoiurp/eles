import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { beforeAfterCases } from '../../constants/before-after-cases';
import TestimonialCard from './TestimonialCard';

/**
 * Before/After cases slider component
 * Updated to add padding to the left side of the slider
 */
const BeforeAfterCases: React.FC = () => {
  // Create a new array with a placeholder slide at the beginning
  const allSlides = [
    // Placeholder slide with ID "0"
    { id: 0, name: "", age: 0, months: 0, testimonial: "", beforeImage: "", afterImage: "" },
    ...beforeAfterCases
  ];
  
  const [activeIndex, setActiveIndex] = useState(1); // Start at index 1 (first real slide)
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const totalSlides = allSlides.length;
  const slideWidth = 300; // Width of each slide in pixels
  const slideGap = 24; // Gap between slides in pixels
  
  // Handle slide navigation
  const goToSlide = (index: number) => {
    if (isAnimating || !sliderRef.current) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Calculate the scroll position
    const scrollPosition = index * (slideWidth + slideGap);
    
    // Scroll to the position
    sliderRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNextSlide = () => {
    // Skip the placeholder slide when navigating
    const nextIndex = (activeIndex + 1) % totalSlides;
    const targetIndex = nextIndex === 0 ? 1 : nextIndex;
    goToSlide(targetIndex);
  };

  // Handle manual scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isAnimating || !sliderRef.current) return;
      
      const scrollPosition = sliderRef.current.scrollLeft;
      
      // Calculate the active slide based on scroll position
      const newActiveIndex = Math.round(scrollPosition / (slideWidth + slideGap));
      
      if (newActiveIndex !== activeIndex && newActiveIndex >= 0 && newActiveIndex < totalSlides) {
        setActiveIndex(newActiveIndex);
      }
    };
    
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleScroll);
      return () => {
        sliderElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [activeIndex, isAnimating, totalSlides]);

  // Set initial scroll position to show the first real slide
  useEffect(() => {
    if (sliderRef.current) {
      // Set initial scroll position to show the first real slide (index 1)
      sliderRef.current.scrollLeft = slideWidth + slideGap;
    }
  }, []);

  // Function to render a slide based on its index
  const renderSlide = (slide: typeof allSlides[0], index: number) => {
    // For the placeholder slide (index 0), render an empty container
    if (index === 0) {
      return (
        <div 
          key="placeholder" 
          className="testimonial-card-container w-[300px] flex-shrink-0"
          style={{ scrollSnapAlign: 'start' }}
        >
          {/* Empty placeholder */}
        </div>
      );
    }
    
    // For real slides, render the TestimonialCard
    return (
      <div 
        key={slide.id} 
        className="testimonial-card-container w-[300px] flex-shrink-0"
        style={{ scrollSnapAlign: 'start' }}
      >
        <TestimonialCard testimonial={slide} />
      </div>
    );
  };

  return (
    <div className="py-20 md:py-28 bg-gray-50">
      {/* Header section with max-width container */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 mb-12">
        <div className="mb-2">
          <span className="text-black-800 text-sm font-medium">
            Avaliações em Destaque
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-0 text-gray-900 max-w-xl">
            Cabelos visivelmente mais fortes e saudáveis.
          </h2>
          <Link to="/hair-growth-screening" className="bg-black text-white px-6 py-3 rounded-full text-base font-medium hover:bg-black/90 transition-all duration-300 w-fit md:w-auto shadow-md whitespace-nowrap">
            Comece Agora
          </Link>
        </div>
      </div>
      
      {/* Container for slider that breaks out of max-width constraints */}
      <div className="relative">
        {/* Left padding container to align with header */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          {/* This empty div maintains the left alignment */}
        </div>
        
        {/* Full-width slider section with proper containment */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          {/* Slider track with overflow for horizontal scrolling */}
          <div
            ref={sliderRef}
            className="overflow-x-auto pb-8 hide-scrollbar"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingLeft: 'max(24px, calc((100vw - 1280px) / 2 + 24px))', // Dynamic left padding with minimum
              width: '100vw', // Full viewport width
              position: 'relative' // Needed for proper containment
            }}
          >
            {/* Slider content */}
            <div className="flex gap-6 w-max">
              {/* Render all slides, including the placeholder */}
              {allSlides.map(renderSlide)}
            </div>
          </div>
          
          {/* Right navigation arrow only */}
          <button
            onClick={goToNextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all z-10"
            aria-label="Next slide"
            disabled={isAnimating}
            style={{ right: '24px' }} /* Ensure it's positioned correctly at the edge */
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>
      
      {/* Return to normal flow for pagination and disclaimer */}
      <div className="relative" style={{ height: '400px' }} /> {/* Spacer with sufficient height for the slider */}
      
      {/* Pagination and disclaimer in max-width container */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 relative mt-12">
        {/* Pagination indicators - exclude the placeholder slide */}
        <div className="flex justify-center items-center space-x-1 mt-4">
          {beforeAfterCases.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index + 1)} // +1 to account for the placeholder
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 1 === activeIndex
                  ? 'bg-[#8A3A34] w-4'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
        
        {/* Disclaimer text */}
        <div className="mt-8 text-xs text-gray-500 max-w-3xl mx-auto text-center">
        Imagens de antes/depois compartilhadas por clientes que compraram produtos variados, incluindo produtos com receita médica. Os resultados desses clientes não foram verificados de forma independente. Os resultados individuais variam.
        </div>
      </div>
      
      {/* Add CSS to hide scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default BeforeAfterCases;