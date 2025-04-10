'use client';

import React, {useState, useEffect} from 'react';
import {Product, getProducts} from "@/services/product-catalog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

const HomeTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'popularity' | 'ratings'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await getProducts(searchQuery, sortBy, sortOrder);
      setProducts(fetchedProducts);
    };

    loadProducts();
  }, [searchQuery, sortBy, sortOrder]);

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (newSortBy: 'price' | 'popularity' | 'ratings') => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = (newSortOrder: 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search for products..."
          className="flex-1"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Icons.filter className="h-4 w-4"/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="ratings">Ratings</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort Order"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <CardDescription>{product.description}</CardDescription>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</span>
                <Button size="sm" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeTab;
