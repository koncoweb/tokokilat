'use client';

import React from 'react';
import ProductList from "@/components/ProductList";
import TabBar from "@/components/TabBar";

const ProductsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <ProductList/>
      </div>
      <TabBar />
    </div>
  );
};

export default ProductsPage;
