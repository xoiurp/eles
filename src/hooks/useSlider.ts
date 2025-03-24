import { useState, useEffect, useRef, useCallback } from 'react';
import { getSlideWidth, findRightmostVisibleCard, scrollToAdjacentSlide } from '../utils/sliderUtils';

/**
 * Custom hook to manage slider functionality
 * @param totalItems - Total number of items in the slider
 * @param autoPlayInterval - Interval for auto-play in milliseconds
 * @returns Object containing slider state and control functions
 */
export const useSlider = (totalItems: number, autoPlayInterval: number = 5000) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [rightmostVisibleIndex, setRightmostVisibleIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Handle scroll events to update active slide
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;
    
    const slideWidth = getSlideWidth(sliderRef);
    const scrollPosition = sliderRef.current.scrollLeft;
    
    // Calculate the active slide based on scroll position
    // Using Math.round to leverage the closest snap point
    const newActiveSlide = Math.round(scrollPosition / slideWidth);
    
    if (newActiveSlide !== activeSlide && newActiveSlide >= 0 && newActiveSlide < totalItems) {
      setActiveSlide(newActiveSlide);
    }
    
    // Update the rightmost visible card for gradient effect
    const rightmostIndex = findRightmostVisibleCard(sliderRef);
    setRightmostVisibleIndex(rightmostIndex);
  }, [activeSlide, totalItems]);

  // Set up scroll event listeners
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (!sliderElement) return;

    // Use the 'scrollend' event when available for better performance with scroll-snap
    // With fallback to the 'scroll' event with debounce
    if ('onscrollend' in window) {
      // @ts-ignore - TypeScript may not recognize scrollend yet
      sliderElement.addEventListener('scrollend', handleScroll);
      sliderElement.addEventListener('scroll', handleScroll); // Add scroll event for continuous updates
      
      return () => {
        // @ts-ignore
        sliderElement.removeEventListener('scrollend', handleScroll);
        sliderElement.removeEventListener('scroll', handleScroll);
      };
    } else {
      // Fallback with debounce for the scroll event
      let scrollTimeout: NodeJS.Timeout;
      
      const debouncedHandleScroll = () => {
        // Execute immediately for gradient update
        handleScroll();
        
        // Debounce for active slide update
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
      };
      
      sliderElement.addEventListener('scroll', debouncedHandleScroll);
      
      return () => {
        clearTimeout(scrollTimeout);
        sliderElement.removeEventListener('scroll', debouncedHandleScroll);
      };
    }
  }, [handleScroll]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [activeSlide, isPaused, autoPlayInterval]);

  // Set up event listeners to pause auto-play on user interaction
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (!sliderElement) return;

    const pauseAutoPlay = () => setIsPaused(true);
    const resumeAutoPlay = () => setIsPaused(false);
    
    sliderElement.addEventListener('mouseenter', pauseAutoPlay);
    sliderElement.addEventListener('mouseleave', resumeAutoPlay);
    sliderElement.addEventListener('touchstart', pauseAutoPlay, { passive: true });
    sliderElement.addEventListener('touchend', resumeAutoPlay);
    
    return () => {
      sliderElement.removeEventListener('mouseenter', pauseAutoPlay);
      sliderElement.removeEventListener('mouseleave', resumeAutoPlay);
      sliderElement.removeEventListener('touchstart', pauseAutoPlay);
      sliderElement.removeEventListener('touchend', resumeAutoPlay);
    };
  }, []);

  // Function to navigate to a specific slide
  const goToSlide = useCallback((index: number, smooth: boolean = true) => {
    if (!sliderRef.current) return;
    
    const slideWidth = getSlideWidth(sliderRef);
    const newPosition = index * slideWidth;
    
    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    setActiveSlide(index);
  }, []);

  // Functions to navigate to next/previous slides
  const goToNextSlide = useCallback(() => {
    scrollToAdjacentSlide(sliderRef, 'next', setActiveSlide);
  }, []);

  const goToPrevSlide = useCallback(() => {
    scrollToAdjacentSlide(sliderRef, 'prev', setActiveSlide);
  }, []);

  return {
    sliderRef,
    activeSlide,
    rightmostVisibleIndex,
    goToSlide,
    goToNextSlide,
    goToPrevSlide,
    handleScroll
  };
};