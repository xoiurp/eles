import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Call-to-action section component
 */
const CTASection: React.FC = () => {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Pronto para começar sua transformação?
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de homens que já recuperaram a confiança com nosso tratamento
        </p>
        <Link 
          to="/hair-growth-screening" 
          className="bg-[#8A3A34] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#8A3A34]/90 transition-all duration-300 inline-block"
        >
          Comece seu tratamento agora
        </Link>
      </div>
    </div>
  );
};

export default CTASection;