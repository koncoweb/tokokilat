'use client';

import React, {useState, useEffect} from 'react';
import {db, auth} from '@/lib/firebase';
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {Product} from '@/services/product-catalog'; // Adjust the import path as needed
import {Button} from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger // Import AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {Icons} from '@/components/icons';
import ProductForm from '@/components/ProductForm';
import {onAuthStateChanged} from "firebase/auth";
import { cn } from "@/lib/utils";
import {useToast} from "@/hooks/use-toast";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const {toast} = useToast();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const productsCollectionRef = collection(db, 'products');

                const unsubscribe = onSnapshot(
                    productsCollectionRef,
                    snapshot => {
                        const productList = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        })) as Product[];
                        setProducts(productList);
                    },
                    error => {
                        console.error('Error listening to product updates:', error);
                        setError(`Error listening to product updates: ${error.message}`);
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: `Failed to fetch products: ${error.message}`,
                        });
                    }
                );
                return () => unsubscribe();

            } catch (e: any) {
                console.error('Error fetching products:', e.message);
                setError(`Failed to fetch products: ${e.message}`);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `Failed to fetch products: ${e.message}`,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [user, toast]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);
      console.log(`Product with ID ${productId} deleted successfully!`);
      setProducts(products.filter(product => product.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });

    } catch (e: any) {
      console.error(`Error deleting product with ID ${productId}:`, e.message);
      setError(`Failed to delete product: ${e.message}`);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete product: ${e.message}`,
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdated = () => {
    // This function will be called after a product is successfully updated.
    // It can be used to refresh the product list.
    // Re-fetching products after update
    // fetchProducts();
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="container mx-auto py-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Product List</h1>
          <Button onClick={handleCreateProduct}>
            <Icons.plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <Card key={product.id} className="bg-white shadow-md rounded-md">
              <CardHeader className="p-2">
                <CardTitle className="text-xs">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <img
                  src={product.imageUrl || 'https://picsum.photos/200/100'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
                <CardDescription>{product.description}</CardDescription>
                <div className="flex flex-col justify-between items-center mt-2">
                  <div>
                    <span className="block text-xs text-gray-500">Category: {product.category}</span>
                    <span className="block text-xs text-gray-500">SKU: {product.sku}</span>
                    <span className="block text-xs text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <span className="text-lg font-semibold text-primary">${product.price?.toFixed(2)}</span>
                      <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleEditProduct(product)}>
                      Edit
                      </Button>

                      <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                      Delete
                      </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                      <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the product from our servers.
                      </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                      </AlertDialogAction>
                      </AlertDialogContent>
                      </AlertDialog>
                      </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Form Modal */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Edit</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{selectedProduct ? 'Edit Product' : 'Create Product'}</SheetTitle>
            <SheetDescription>
              {selectedProduct ? 'Edit the product details.' : 'Create a new product.'}
            </SheetDescription>
          </SheetHeader>
          <ProductForm
            product={selectedProduct}
            onClose={handleFormClose}
            onProductUpdated={handleProductUpdated}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProductList;
