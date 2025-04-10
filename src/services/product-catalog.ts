/**
 * Represents a product in the catalog.
 */
export interface Product {
  /**
   * The unique identifier for the product.
   */
  id: string;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * The URL of the product's image.
   */
  imageUrl: string;
  /**
   * The price of the product.
   */
  price: number;
  /**
   * A short description of the product.
   */
  description: string;
  /**
   * The rating of the product from 1 to 5.
   */
  rating: number;
  /**
   * The popularity score of the product.
   */
  popularity: number;
}

/**
 * Represents the available sorting options for products.
 */
export type SortOption = 'price' | 'popularity' | 'ratings';

/**
 * Represents the available sorting orders.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Asynchronously retrieves a list of products from the catalog.
 *
 * @param query An optional search query to filter products by name or description.
 * @param sortBy An optional field to sort the products by.
 * @param sortOrder An optional order to sort the products in.
 * @param filters An optional list of filters to apply to the products.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProducts(
  query?: string,
  sortBy?: SortOption,
  sortOrder?: SortOrder,
  filters?: string[]
): Promise<Product[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      id: '1',
      name: 'Product 1',
      imageUrl: 'https://example.com/product1.jpg',
      price: 25.99,
      description: 'This is a description for Product 1.',
      rating: 4.5,
      popularity: 100
    },
    {
      id: '2',
      name: 'Product 2',
      imageUrl: 'https://example.com/product2.jpg',
      price: 49.99,
      description: 'This is a description for Product 2.',
      rating: 3.8,
      popularity: 120
    },
  ];
}
