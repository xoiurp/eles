import React from 'react';
import Header from '../components/hair-growth/Header';
import HeroSection from '../components/hair-growth/HeroSection';
import ProductSlider from '../components/hair-growth/ProductSlider';
import BenefitsSection from '../components/hair-growth/BenefitsSection';
import BeforeAfterCases from '../components/hair-growth/BeforeAfterCases';
import HowItWorksSection from '../components/hair-growth/HowItWorksSection';
import FAQSection from '../components/hair-growth/FAQSection';
import CTASection from '../components/hair-growth/CTASection';

/**
 * HairGrowth page component
 * This is the main page for hair growth treatment information
 */
function HairGrowth(): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section with Infinite Scroll */}
      <HeroSection />

      {/* Product Slider Section */}
      <ProductSlider />
  
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Before/After Cases Slider Section */}
      <BeforeAfterCases />
      
      {/* How it works Section */}
      <HowItWorksSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

export default HairGrowth;
