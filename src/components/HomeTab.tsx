'use client';

import React from 'react';
import {Toaster} from "@/components/ui/toaster";
import {useEffect} from "react";
import {auth} from "@/lib/firebase";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import ProductList from "@/components/ProductList";

const HomeTab: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="container mx-auto py-6">
      <ProductList/>
      <Toaster/>
    </div>
  );
};

export default HomeTab;

