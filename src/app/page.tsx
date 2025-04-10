'use client';

import TabBar from "@/components/TabBar";
import HomeTab from "@/components/HomeTab";
import {useEffect} from "react";
import {auth} from "@/lib/firebase";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";

export default function Home() {
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
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">
        <HomeTab/>
      </main>
      <TabBar />
    </div>
  );
}

