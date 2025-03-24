import React from 'react';
import { ProductDialog } from '../ProductDialog';
import { Product } from '../../hooks/useProductFetch';

interface ProductCardProps {
  product: Product;
  index: number;
  isRightmostVisible: boolean;
}

/**
 * Product card component for the product slider
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, index, isRightmostVisible }) => {
  return (
    <div
      key={product.id || index}
      className={`w-96 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative scroll-snap-align-start ${
        isRightmostVisible ? 'rightmost-visible-card' : ''
      }`}
      style={{
        scrollSnapAlign: 'start',
        ...(isRightmostVisible ? {
          maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
        } : {})
      }}
    >
      <div className="p-6 pb-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.tag}</span>
        <h3 className="text-xl font-semibold mt-1 mb-3">{product.name}</h3>
      </div>
      <div className="flex justify-center items-center pl-4 pt-4 pb-4 pr-0">
        <img
          src={product.imageUrl}
          alt={product.imageAlt || product.name}
          className="w-full aspect-[1037/932] object-contain"
          loading="lazy"
        />
      </div>
      <ProductDialog product={product} />
    </div>
  );
};

export default ProductCard;