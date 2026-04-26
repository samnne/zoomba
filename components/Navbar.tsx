import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "moti";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ROUTE_STYLES: Record<
  string,
  { bg: string; iconColor: string; buttonBg: string }
> = {
  viewer: { bg: "black", iconColor: "white", buttonBg: "#7c3aed" },
  "/home": { bg: "white", iconColor: "white", buttonBg: "#7c3aed" },
  "/date": { bg: "#f3e8ff", iconColor: "white", buttonBg: "#7c3aed" },
  "/album": { bg: "#f3e8ff", iconColor: "white", buttonBg: "#7c3aed" },
  "/sort": { bg: "#f3e8ff", iconColor: "white", buttonBg: "#7c3aed" },
  "/random": { bg: "#f3e8ff", iconColor: "white", buttonBg: "#7c3aed" },
};

const DEFAULT_STYLE = { bg: "white", iconColor: "white", buttonBg: "#7c3aed" };

const Navbar = () => {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [pressed, setPressed] = useState(false);

  // match by prefix so nested routes like /viewer/123 still match
  const routeStyle =
    Object.entries(ROUTE_STYLES).find(([key]) =>
      (q as string)?.includes(key),
    )?.[1] ?? DEFAULT_STYLE;

  return (
    <View
      animate={{ backgroundColor: routeStyle.bg }}
      transition={{ type: "timing", duration: 300 }}
      style={{ paddingTop: insets.top }}
      className="w-full p-2 h-30"
    >
      <View className="px-2 w-full flex-row justify-between  flex-1">
        <View
          animate={{ scale: pressed ? 1.3 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 8, mass: 0.8 }}
        >
          <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={() => setTimeout(() => router.back(), 100)}
            accessibilityHint="Goes back to previous screen"
            style={{ backgroundColor: routeStyle.buttonBg }}
            className="w-10 h-10 rounded-full justify-center items-center"
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={routeStyle.iconColor}
            />
          </Pressable>
        </View>
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => router.push("/delete/index")}
          accessibilityHint="Goes back to previous screen"
          style={{ backgroundColor: routeStyle.buttonBg }}
          className="w-10 h-10 rounded-full justify-center items-center"
        >
          <Ionicons name="trash" size={20} color={routeStyle.iconColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default Navbar;
