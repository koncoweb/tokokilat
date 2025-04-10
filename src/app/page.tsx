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
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {CardFooter} from "@/components/ui/card";

const DummySlider = () => {
    const slides = [
        {id: 1, imageUrl: 'https://picsum.photos/id/1047/600/200', altText: 'Slide 1'},
        {id: 2, imageUrl: 'https://picsum.photos/id/1048/600/200', altText: 'Slide 2'},
        {id: 3, imageUrl: 'https://picsum.photos/id/1049/600/200', altText: 'Slide 3'},
    ];

    return (
        <ScrollArea className="w-full">
            <div className="flex space-x-4 p-4">
                {slides.map(slide => (
                    <img
                        key={slide.id}
                        src={slide.imageUrl}
                        alt={slide.altText}
                        className="w-[600px] h-[200px] rounded-md"
                    />
                ))}
            </div>
        </ScrollArea>
    );
};

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
                <CardDescription>Nikmati pengalaman belanja yang menyenangkan dan cepat!</CardDescription>
            </CardHeader>
            <CardContent>
                <DummySlider />
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


