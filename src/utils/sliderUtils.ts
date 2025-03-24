/**
 * Utility functions for slider functionality
 */

/**
 * Calculate the width of a slide including spacing
 * @param sliderRef - Reference to the slider container
 * @param defaultWidth - Default width to return if calculation fails
 * @returns The calculated slide width
 */
export const getSlideWidth = (
  sliderRef: React.RefObject<HTMLDivElement>,
  defaultWidth: number = 384
): number => {
  if (!sliderRef.current) return defaultWidth;
  
  // Get the first element child (slide) to calculate its width
  const slideElements = sliderRef.current.querySelectorAll('.flex > div');
  if (slideElements.length === 0) return defaultWidth;
  
  // Get the actual width of the slide including margins
  const slideRect = slideElements[0].getBoundingClientRect();
  return slideRect.width + 32; // 32px is the spacing (space-x-8)
};

/**
 * Navigate to a specific slide with smooth scrolling
 * @param sliderRef - Reference to the slider container
 * @param index - Index of the slide to navigate to
 * @param setActiveSlide - State setter for the active slide
 * @param smooth - Whether to use smooth scrolling
 */
export const goToSlide = (
  sliderRef: React.RefObject<HTMLDivElement>,
  index: number,
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>,
  smooth: boolean = true
): void => {
  if (!sliderRef.current) return;
  
  const slideWidth = getSlideWidth(sliderRef);
  const newPosition = index * slideWidth;
  
  sliderRef.current.scrollTo({
    left: newPosition,
    behavior: smooth ? 'smooth' : 'auto'
  });
  
  setActiveSlide(index);
};

/**
 * Scroll to the next or previous slide with snap
 * @param sliderRef - Reference to the slider container
 * @param direction - Direction to scroll ('next' or 'prev')
 * @param setActiveSlide - State setter for the active slide
 */
export const scrollToAdjacentSlide = (
  sliderRef: React.RefObject<HTMLDivElement>,
  direction: 'next' | 'prev',
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>
): void => {
  if (!sliderRef.current) return;
  
  const slideWidth = getSlideWidth(sliderRef);
  const currentScroll = sliderRef.current.scrollLeft;
  const totalWidth = sliderRef.current.scrollWidth;
  const containerWidth = sliderRef.current.clientWidth;
  
  // Calculate the current index based on scroll position
  const currentIndex = Math.round(currentScroll / slideWidth);
  
  // Calculate the new index
  let newIndex;
  if (direction === 'next') {
    newIndex = currentIndex + 1;
    // Loop to the beginning if reached the end
    if (newIndex * slideWidth >= totalWidth - containerWidth + (slideWidth / 2)) {
      newIndex = 0;
    }
  } else {
    newIndex = currentIndex - 1;
    // Loop to the end if reached the beginning
    if (newIndex < 0) {
      newIndex = Math.floor((totalWidth - containerWidth) / slideWidth);
    }
  }
  
  // Scroll to the new index
  goToSlide(sliderRef, newIndex, setActiveSlide);
};

/**
 * Find the rightmost visible card in a slider
 * @param sliderRef - Reference to the slider container
 * @returns The index of the rightmost visible card or null if none found
 */
export const findRightmostVisibleCard = (
  sliderRef: React.RefObject<HTMLDivElement>
): number | null => {
  if (!sliderRef.current) return null;
  
  const sliderRect = sliderRef.current.getBoundingClientRect();
  const cardElements = sliderRef.current.querySelectorAll('.flex > div');
  
  let rightmostIndex = null;
  let maxRightPosition = -Infinity;
  
  // Find the rightmost card that is still partially visible
  cardElements.forEach((card, index) => {
    const cardRect = card.getBoundingClientRect();
    
    // Check if the card is at least partially visible
    const isVisible =
      cardRect.left < sliderRect.right &&
      cardRect.right > sliderRect.left;
    
    // If it's visible and is the rightmost so far
    if (isVisible && cardRect.right > maxRightPosition) {
      maxRightPosition = cardRect.right;
      rightmostIndex = index;
    }
  });
  
  return rightmostIndex;
};