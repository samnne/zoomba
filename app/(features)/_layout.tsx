import Navbar from "@/components/Navbar";
import { Slot, usePathname } from "expo-router";
import { View } from "moti";

export default function RootLayout() {
  const pathname = usePathname();
  return (
    <>
      <View className={`flex-1  ${pathname.includes("viewer") && "bg-black"}`}>
        <Navbar />
        <View className="flex-1  ">
          <Slot />
        </View>
      </View>
    </>
  );
}
