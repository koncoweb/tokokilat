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
   * The category of the product.
   */
  category?: string;
  /**
   * The SKU (Stock Keeping Unit) of the product.
   */
  sku?: string;
  /**
   * The URL of the product's image.
   */
  imageUrl?: string;
  /**
   * The price of the product.
   */
  price?: number;
  /**
   * The stock quantity of the product
   */
  stock?: number;
  /**
   * A short description of the product.
   */
  description?: string;
  /**
   * The rating of the product from 1 to 5.
   */
  rating?: number;
  /**
   * The popularity score of the product.
   */
  popularity?: number;

  /**
   * The stocks location of product
   */
  stocks?:{warehouseName:string, quantity: number}[]
    createdAt?: any;
    updatedAt?: any;
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
  return []
}
