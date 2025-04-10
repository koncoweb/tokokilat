// Use server directive to ensure this code runs only on the server.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing product recommendations based on the items in a user's shopping cart.
 *
 * - getProductRecommendations - A function that takes a list of product IDs in the cart and returns a list of recommended products.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function, which is an array of product IDs.
 * - ProductRecommendationsOutput - The output type for the getProductRecommendations function, which is an array of product objects.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Product, getProducts} from '@/services/product-catalog';

const ProductRecommendationsInputSchema = z.object({
  productIds: z
    .array(z.string())
    .describe('An array of product IDs currently in the shopping cart.'),
});
export type ProductRecommendationsInput = z.infer<
  typeof ProductRecommendationsInputSchema
>;

const ProductRecommendationsOutputSchema = z.array(z.object({
  id: z.string().describe('The unique identifier for the product.'),
  name: z.string().describe('The name of the product.'),
  imageUrl: z.string().describe('The URL of the product image.'),
  price: z.number().describe('The price of the product.'),
  description: z.string().describe('A short description of the product.'),
  rating: z.number().describe('The rating of the product from 1 to 5.'),
  popularity: z.number().describe('The popularity score of the product.'),
}));
export type ProductRecommendationsOutput = z.infer<
  typeof ProductRecommendationsOutputSchema
>;

export async function getProductRecommendations(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {
    schema: z.object({
      productIds: z
        .array(z.string())
        .describe('An array of product IDs currently in the shopping cart.'),
      products: z
        .array(z.string())
        .describe('An array of product names currently in the shopping cart.'),
    }),
  },
  output: {
    schema: z.array(z.string()).describe('An array of product IDs to recommend.'),
  },
  prompt: `Given the following products in the shopping cart:\n\n{{#each products}}\n- {{{this}}}\n{{/each}}\n\nRecommend other product IDs that the user might be interested in purchasing.  Do not include the productIDs already in the cart.  Return ONLY the productIDs.\n`,
});

const productRecommendationsFlow = ai.defineFlow<
  typeof ProductRecommendationsInputSchema,
  typeof ProductRecommendationsOutputSchema
>(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    // Fetch product details from the product catalog service.
    const productsInCart = await getProducts();
    const filteredProducts = productsInCart.filter(product =>
      input.productIds.includes(product.id)
    );
    const productNames = filteredProducts.map(product => product.name);

    const {output} = await productRecommendationsPrompt({
      productIds: input.productIds,
      products: productNames,
    });

    if (!output) {
      console.warn('No product recommendations received.');
      return [];
    }

    // Remove duplicate product IDs from the recommendations array
    const uniqueProductIds = [...new Set(output)];

    // Fetch the product details for the recommended product IDs
    const allProducts = await getProducts();
    const recommendedProducts = allProducts.filter(product =>
      uniqueProductIds.includes(product.id)
    );

    return recommendedProducts;
  }
);
