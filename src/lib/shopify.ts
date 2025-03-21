import { GraphQLClient } from 'graphql-request';

// Interfaces para tipagem
interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
}

interface ShopifyProductsResponse {
  collection: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

// Configuração do cliente Shopify Storefront API
const shopifyDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'f3its6-1v.myshopify.com';
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '26a79f592a4ec423836763c64d428e2f';

// Endpoint da API Storefront
const endpoint = `https://${shopifyDomain}/api/2023-10/graphql.json`;

// Criar cliente GraphQL
export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontToken,
    'Content-Type': 'application/json',
  },
});

// Consulta para buscar produtos de uma collection específica
export const getProductsQuery = `
  query GetProductsByCollection($first: Int!, $collectionId: ID!) {
    collection(id: $collectionId) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Função para buscar produtos de uma collection específica
export async function getProducts(first = 10, collectionId = "gid://shopify/Collection/478659117249") {
  try {
    const data = await shopifyClient.request<ShopifyProductsResponse>(getProductsQuery, { first, collectionId });
    return data.collection.products.edges.map((edge) => {
      const product = edge.node;
      const image = product.images.edges[0]?.node || null;
      
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        tag: product.tags[0] || '',
        name: product.title,
        price: `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`,
        imageUrl: image ? image.url : '',
        imageAlt: image && image.altText ? image.altText : product.title, // Garantir que nunca seja null
      };
    });
  } catch (error) {
    console.error('Erro ao buscar produtos do Shopify:', error);
    return [];
  }
}