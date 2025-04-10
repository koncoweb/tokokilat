'use client';

import TabBar from "@/components/TabBar";
import HomeTab from "@/components/HomeTab";
import {useEffect} from "react";
import {auth} from "@/lib/firebase";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

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
           <header className="bg-secondary p-4">
        <Card className="w-full">
            <CardHeader>
                <CardTitle>TokoKilat</CardTitle>
                <CardDescription>Selamat datang di TokoKilat</CardDescription>
            </CardHeader>
            <CardContent>
            Nikmati pengalaman belanja yang menyenangkan dan cepat!
            </CardContent>
            <CardFooter>
              </CardFooter>
        </Card>
      </header>
      <main className="flex-1 overflow-y-auto">
        <HomeTab/>
      </main>
      <TabBar />
    </div>
  );
}


