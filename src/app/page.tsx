
import TabBar from "@/components/TabBar";
import HomeTab from "@/components/HomeTab";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">
        <HomeTab/>
      </main>
      <TabBar />
    </div>
  );
}
