import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useProductFetch } from '../../hooks/useProductFetch';
import { useSlider } from '../../hooks/useSlider';
import ProductCard from './ProductCard';

/**
 * Product slider component for displaying products
 */
const ProductSlider: React.FC = () => {
  const { products, loading } = useProductFetch();
  const {
    sliderRef,
    activeSlide,
    rightmostVisibleIndex,
    goToSlide,
    goToNextSlide,
    goToPrevSlide
  } = useSlider(products.length);

  return (
    <div className="py-16 md:py-24 h-screen bg-[#EFE8DF] rounded-t-xl mt-[-20px] relative z-10">
      <div className="max-w-[90%] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Tratamentos comprovados pela ciência.
        </h2>
        <p className="text-xl text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Faça uma triagem rápida e descubra qual tratamento é ideal para o seu caso.
        </p>
        <div className="flex justify-center mb-16">
          <Link to="/hair-growth-screening" className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#8A3A34]/90 transition-all duration-600 inline-block">
            Triagem Rápida
          </Link>
        </div>
        
        <div className="relative max-w-[calc(100%-32px)] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-12 h-12 text-[#8A3A34] animate-spin mb-4" />
              <p className="text-gray-700">Carregando produtos...</p>
            </div>
          ) : (
            <>
              {/* Slider container */}
              <div
                className="overflow-x-auto pb-8 w-full scroll-smooth relative mb-16"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  scrollSnapType: 'x mandatory'
                }}
                ref={sliderRef}
              >
                <div className="flex space-x-8 px-2 w-full transition-all duration-500">
                  {/* Map through products to create slides */}
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id || index}
                      product={product}
                      index={index}
                      isRightmostVisible={index === rightmostVisibleIndex}
                    />
                  ))}
                </div>
              </div>
              
              {/* Navigation arrows */}
              <button
                onClick={goToPrevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hidden md:block hover:bg-white hover:shadow-xl transition-all"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={goToNextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-10 hidden md:block hover:bg-white hover:shadow-xl transition-all"
                aria-label="Próximo slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
              
              {/* Pagination indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? 'bg-rose-500 w-4'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;