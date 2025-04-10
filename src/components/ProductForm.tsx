'use client';

import React, {useState, useEffect} from 'react';
import {db} from '@/lib/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import {Product} from '@/services/product-catalog'; // Adjust the import path as needed
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {SheetClose} from '@/components/ui/sheet';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onProductUpdated?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({product, onClose, onProductUpdated}) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [rating, setRating] = useState(product?.rating?.toString() || '');
  const [popularity, setPopularity] = useState(product?.popularity?.toString() || '');
  const [stocks, setStocks] = useState<
    {
      warehouseName: string;
      quantity: number;
    }[]
  >(product?.stocks || []);
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [newWarehouseQuantity, setNewWarehouseQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category || '');
      setSku(product.sku || '');
      setPrice(product.price?.toString() || '');
      setStock(product.stock?.toString() || '');
      setDescription(product.description);
      setImageUrl(product.imageUrl || '');
       setRating(product.rating != null ? product.rating.toString() : '');
       setPopularity(product.popularity != null ? product.popularity.toString() : '');
      setStocks(product.stocks || []);
    }
  }, [product]);

  const handleAddWarehouse = () => {
    if (newWarehouseName && newWarehouseQuantity) {
      setStocks([
        ...stocks,
        {
          warehouseName: newWarehouseName,
          quantity: parseInt(newWarehouseQuantity, 10),
        },
      ]);
      setNewWarehouseName('');
      setNewWarehouseQuantity('');
    }
  };

  const handleRemoveWarehouse = (index: number) => {
    const newStocks = [...stocks];
    newStocks.splice(index, 1);
    setStocks(newStocks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Safely parse the price, rating, and popularity
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);
    const parsedRating = parseFloat(rating);
    const parsedPopularity = parseFloat(popularity);

    const newProduct: any = {
      name,
      category,
      sku,
      description,
      stock: parsedStock,
      stocks,
      updatedAt: Timestamp.now(),
    };

    if (imageUrl) {
      newProduct.imageUrl = imageUrl;
    }

    if (!isNaN(parsedPrice)) {
      newProduct.price = parsedPrice;
    }
    if (!isNaN(parsedRating)) {
      newProduct.rating = parsedRating;
    }

    if (!isNaN(parsedPopularity)) {
      newProduct.popularity = parsedPopularity;
    }


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
        newProduct.createdAt = Timestamp.now(); // Only add createdAt on creation
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
          onChange={e => setName(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Input
          type="text"
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <Input
          type="text"
          id="sku"
          value={sku}
          onChange={e => setSku(e.target.value)}
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
          onChange={e => setPrice(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stock
        </label>
        <Input
          type="number"
          id="stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
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
          onChange={e => setDescription(e.target.value)}
          rows={3}
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
          onChange={e => setImageUrl(e.target.value)}
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
          onChange={e => setRating(e.target.value)}
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
          onChange={e => setPopularity(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Warehouse Stocks</h3>
        {stocks.map((warehouse, index) => (
          <div key={index} className="flex items-center justify-between mt-2">
            <div>
              {warehouse.warehouseName}: {warehouse.quantity}
            </div>
            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveWarehouse(index)}>
              Remove
            </Button>
          </div>
        ))}
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Warehouse Name"
            value={newWarehouseName}
            onChange={e => setNewWarehouseName(e.target.value)}
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newWarehouseQuantity}
            onChange={e => setNewWarehouseQuantity(e.target.value)}
            className="mb-2"
          />
          <Button type="button" onClick={handleAddWarehouse}>
            Add Warehouse
          </Button>
        </div>
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
