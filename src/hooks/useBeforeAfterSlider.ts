import { useState, useEffect, useRef, useCallback } from 'react';
import { BeforeAfterCase } from '../constants/before-after-cases';

/**
 * Custom hook to manage before/after cases slider functionality
 * Simplified implementation to ensure consistent display
 * @param cases - Array of before/after cases
 * @param autoPlayInterval - Interval for auto-play in milliseconds
 * @returns Object containing slider state and control functions
 */
export const useBeforeAfterSlider = (
  cases: BeforeAfterCase[],
  autoPlayInterval: number = 5000
) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, autoPlayInterval]);

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
  const goToSlide = useCallback((index: number) => {
    // Ensure index is within bounds
    const newIndex = Math.max(0, Math.min(index, cases.length - 1));
    setActiveIndex(newIndex);
  }, [cases.length]);

  // Functions to navigate to next/previous slides
  const goToNextSlide = useCallback(() => {
    const nextIndex = (activeIndex + 1) % cases.length;
    setActiveIndex(nextIndex);
  }, [activeIndex, cases.length]);

  const goToPrevSlide = useCallback(() => {
    const prevIndex = activeIndex === 0 ? cases.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  }, [activeIndex, cases.length]);

  return {
    sliderRef,
    activeIndex,
    goToSlide,
    goToNextSlide,
    goToPrevSlide
  };
};