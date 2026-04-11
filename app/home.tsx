import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/utils/constants";
import { useRouter } from "expo-router";
import { Image, ScrollView as SVMOTI } from "moti";
import { MotiPressable as Pressable } from "moti/interactions";
import { styled } from "nativewind";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  SafeAreaView as RNSAV,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const SafeAreaView = styled(RNSAV);
const ScrollView = styled(SVMOTI);

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        marginRight: insets.right,
        marginLeft: insets.left,
      }}
      className="flex-1 items-center"
    >
      {/* header */}
      <View className="w-full px-5 pt-2 pb-1 flex-row items-center justify-between">
        <Text className="text-primary  rounded-2xl  font-bold text-4xl">
          Zoomba
        </Text>
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          transition={{
            type: "spring",
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Image
            animate={{
              scale: pressed ? 1.2 : 1,
              rotateZ: pressed ? "25deg" : "0deg",
            }}
            width={50}
            height={50}
            className="w-8 h-8"
            source={require("../assets/images/zoomba_mascot.png")}
          />
        </Pressable>
      </View>

      {/* subheader */}
      <View className="w-full px-5 pb-3">
        <Text className="text-secondary" style={{ fontSize: 13 }}>
          swipe right to keep · left to delete
        </Text>
      </View>

      {/* card area */}
      <ScrollView
        className="flex-1 w-full"
        contentContainerClassName="grid grid-cols-1 gap-2 p-4"
        showsVerticalScrollIndicator={false}
      >
        <CategoryCard
          item={CATEGORIES[0]}
          onPress={() => router.push("/(features)/date")}
        />
        <CategoryCard
          item={CATEGORIES[1]}
          onPress={() => router.push("/(features)/album")}
        />

        <CategoryCard
          item={CATEGORIES[2]}
          onPress={() => router.push("/(features)/sort")}
        />
        <CategoryCard
          item={CATEGORIES[3]}
          onPress={() => router.push("/random?q=viewer&type=random")}
        />
      </ScrollView>

      {/* <ImageViewer {...{ curDate, currentIndex, handleDeleteImage, next }} /> */}
    </SafeAreaView>
  );
}
