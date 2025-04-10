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
import { Icons } from "@/components/icons";
import React from "react";

const GuaranteeItem = ({ icon, text, color }: { icon: keyof typeof Icons; text: string; color: string }) => (
    <div className="flex flex-col items-center justify-center p-2">
        {React.createElement(Icons[icon], { className: "w-8 h-8 mb-1", color: color })}
        <span className="text-xs text-center">{text}</span>
    </div>
);

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
      
      <main className="flex-1 overflow-y-auto">
      <Card className="w-full mb-4">
            <CardHeader className="p-2">
                <div className="flex justify-around">
                <GuaranteeItem icon="shield" text="Jaminan Keamanan" color="hsl(var(--primary))" />
                <GuaranteeItem icon="check" text="Originalitas Produk" color="hsl(var(--accent))" />
                <GuaranteeItem icon="arrowRight" text="Pengembalian Mudah" color="hsl(var(--destructive))" />
                </div>
            </CardHeader>
            <CardContent className="p-2">
                <DummySlider />
            </CardContent>
            <CardFooter>
              </CardFooter>
        </Card>
        <HomeTab/>
      </main>
      <TabBar />
    </div>
  );
}
