'use client';

import React from 'react';
import ProductList from "@/components/ProductList";

const ProductsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Products Management</h1>
      <ProductList/>
    </div>
  );
};

export default ProductsPage;
