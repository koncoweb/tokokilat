'use client';

import React, {useState, useEffect} from 'react';
import {db} from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {Product} from '@/services/product-catalog'; // Adjust the import path as needed
import {Button} from "@/components/ui/button";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Icons} from "@/components/icons";
import ProductForm from "@/components/ProductForm";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsCollectionRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollectionRef);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsList);
      } catch (e: any) {
        console.error("Error fetching products:", e.message);
        setError(`Failed to fetch products: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const productsCollectionRef = collection(db, 'products');

    const unsubscribe = onSnapshot(productsCollectionRef,
      (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productList);
      },
      (error) => {
        console.error("Error listening to product updates:", error);
        setError(`Error listening to product updates: ${error.message}`);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);
      console.log(`Product with ID ${productId} deleted successfully!`);
      // setProducts(products.filter(product => product.id !== productId));
    } catch (e: any) {
      console.error(`Error deleting product with ID ${productId}:`, e.message);
      setError(`Failed to delete product: ${e.message}`);
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
            <Icons.plus className="w-4 h-4 mr-2"/>
            Add Product
          </Button>
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
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleEditProduct(product)}>
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
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
