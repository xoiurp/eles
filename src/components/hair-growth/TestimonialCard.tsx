import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BeforeAfterCase } from '../../constants/before-after-cases';

interface TestimonialCardProps {
  testimonial: BeforeAfterCase;
}

/**
 * Testimonial card component for before/after cases
 * Updated to match the design in the reference image
 */
const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg testimonial-card h-full flex flex-col">
      {/* Images section */}
      <div className="relative">
        <div className="flex">
          <div className="w-1/2 relative">
            <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
              Mês 0
            </div>
            <img
              src={testimonial.beforeImage}
              alt="Antes do tratamento"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
          <div className="w-1/2 relative">
            <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm z-10">
            Mês {testimonial.months}
            </div>
            <img
              src={testimonial.afterImage}
              alt="Depois do tratamento"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Testimonial text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
          "{testimonial.testimonial}"
        </p>
        
        {/* User info section */}
        <div className="flex items-center mt-auto">
          <div className="w-10 h-10 bg-[#8A3A34] rounded-full flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{testimonial.name} {testimonial.name.charAt(0)}.</h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#8A3A34]" />
              <span>Review Verificado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;