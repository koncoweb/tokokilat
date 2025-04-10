'use client';

import React from 'react';
import TabBar from "@/components/TabBar";

const SearchPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-semibold mb-4">Search</h1>
          <p>This is the search page.  You can implement a search bar and display search results here.</p>
        </div>
      </div>
      <TabBar/>
    </div>
  );
};

export default SearchPage;
