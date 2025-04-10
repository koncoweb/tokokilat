/**
 * Represents a product with its details.
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
   * The URL of the product image.
   */
  imageUrl: string;
  /**
   * The price of the product.
   */
  price: number;
  /**
   * The popularity score for the product
   */
  popularity: number;
  /**
   * The rating score for the product
   */
  rating: number;
}

/**
 * Asynchronously retrieves a list of products based on a search term.
 *
 * @param searchTerm The term to search for in product names or descriptions. If null, return all products.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function searchProducts(searchTerm: string | null): Promise<Product[]> {
  // TODO: Implement this by calling an API.
  const products: Product[] = [
    {
      id: '1',
      name: 'Awesome product',
      imageUrl: 'https://example.com/product1.jpg',
      price: 20,
      popularity: 0,
      rating: 0
    },
    {
      id: '2',
      name: 'Another product',
      imageUrl: 'https://example.com/product2.jpg',
      price: 30,
      popularity: 0,
      rating: 0
    },
  ];
  if (!searchTerm) {
    return products;
  }
  return products.filter(product => product.name.includes(searchTerm));
}
