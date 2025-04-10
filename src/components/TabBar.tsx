'use client';

import React from 'react';
import {Home, Search, ShoppingCart, List, User} from "@/components/icons";
import {useRouter, usePathname} from 'next/navigation';

const tabs = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    name: 'Cart',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    name: 'Products',
    href: '/products',
    icon: List,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
];

const TabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-secondary border-t border-border">
      <div className="container mx-auto">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-md
                ${pathname === tab.href
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'}`}
              onClick={() => router.push(tab.href)}
            >
              <tab.icon className="h-5 w-5 mb-1"/>
              <span className="text-xs">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
