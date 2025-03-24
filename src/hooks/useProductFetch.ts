import { useState, useEffect } from 'react';
import { getProducts } from '../lib/shopify';

// Define product type
export interface Product {
  tag: string;
  name: string;
  imageUrl: string;
  id?: string;
  title?: string;
  description?: string;
  price?: string;
  handle?: string;
  imageAlt?: string;
}

// Fallback products in case the API fails
const fallbackProducts: Product[] = [
  {
    tag: "Anti-DHT",
    name: "Finasterida Oral",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Finasterida%20Reference%201@1x.webp"
  },
  {
    tag: "Potente",
    name: "Dutasterida Oral",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Dutasterida%20Reference%205@1x.webp"
  },
  {
    tag: "Tópico",
    name: "Minoxidil Solução",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/MInox%20png%20com%20sombra%203%201@1x.webp"
  },
  {
    tag: "Sistêmico",
    name: "Minoxidil Oral",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Minoxidil%20Oral%20Png%202@1x.webp"
  },
  {
    tag: "Natural",
    name: "Saw Palmetto",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Saw%20Palmetto%20PNG%20com%20Sombra%203.webp"
  },
  {
    tag: "Vitamina",
    name: "Biotina",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Biotina%20png%20sombra%202.webp"
  },
  {
    tag: "Limpeza",
    name: "Shampoo Antiqueda",
    imageUrl: "https://kbnsvfltjmsocvccapcb.supabase.co/storage/v1/object/public/publicbucket/Produtos/Shampoo%20Antiqueda%20png%20com%20sombra%202%201@1x.webp"
  }
];

/**
 * Custom hook to fetch products from Shopify
 * @param limit - Maximum number of products to fetch
 * @param collectionId - ID of the collection to fetch products from
 * @returns Object containing products, loading state, and error state
 */
export const useProductFetch = (
  limit: number = 10,
  collectionId: string = "gid://shopify/Collection/478659117249"
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        setLoading(true);
        const shopifyProducts = await getProducts(limit, collectionId);
        
        if (shopifyProducts && shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
        } else {
          // Fallback to static products if the API fails
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching products from Shopify:', error);
        setError(error instanceof Error ? error : new Error('Unknown error occurred'));
        // Fallback to static products
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopifyProducts();
  }, [limit, collectionId]);

  return { products, loading, error };
};