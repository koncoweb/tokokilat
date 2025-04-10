'use client';

import React from 'react';
import TabBar from "@/components/TabBar";

const CartPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-semibold mb-4">Cart</h1>
          <p>This is your shopping cart page.  You can display the items in the cart and allow users to checkout.</p>
        </div>
      </div>
      <TabBar/>
    </div>
  );
};

export default CartPage;
