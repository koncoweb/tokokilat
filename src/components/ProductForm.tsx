'use client';

import React, {useState, useEffect} from 'react';
import {db} from '@/lib/firebase';
import {collection, addDoc, doc, updateDoc} from 'firebase/firestore';
import {Product} from '@/services/product-catalog'; // Adjust the import path as needed
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {SheetClose} from "@/components/ui/sheet";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onProductUpdated?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({product, onClose, onProductUpdated}) => {
  const [name, setName] = useState(product?.name || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [rating, setRating] = useState(product?.rating?.toString() || '');
  const [popularity, setPopularity] = useState(product?.popularity?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setImageUrl(product.imageUrl);
      setPrice(product.price?.toString() || '');
      setDescription(product.description);
      setRating(product.rating != null ? product.rating.toString() : '');
      setPopularity(product.popularity != null ? product.popularity.toString() : '');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newProduct: Omit<Product, 'id'> = {
      name,
      imageUrl,
      price: parseFloat(price),
      description,
      rating: parseFloat(rating),
      popularity: parseFloat(popularity),
    };

    try {
      if (product) {
        // Update existing product
        const productDocRef = doc(db, 'products', product.id);
        await updateDoc(productDocRef, newProduct);
        console.log('Product updated successfully!');
        if (onProductUpdated) {
          onProductUpdated(); // Notify the parent component to refresh the product list
        }
      } else {
        // Create new product
        const productsCollectionRef = collection(db, 'products');
        await addDoc(productsCollectionRef, newProduct);
        console.log('Product created successfully!');
      }
      onClose();
    } catch (error: any) {
      console.error('Error creating/updating product:', error.message);
      alert(`Failed to create/update product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <Input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <Input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <Input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="popularity" className="block text-sm font-medium text-gray-700">
          Popularity
        </label>
        <Input
          type="number"
          id="popularity"
          value={popularity}
          onChange={(e) => setPopularity(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>


      <div className="mt-6 flex justify-end">
        <SheetClose asChild>
          <Button type="button" variant="secondary" className="mr-2">
            Close
          </Button>
        </SheetClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
