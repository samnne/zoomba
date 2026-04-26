import { useAlbumFeed } from "@/store/zustand";

import { useRouter } from "expo-router";
import { MotiView, ScrollView } from "moti";

import { useEffect } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

export default function App() {
  const router = useRouter();
  const { albums, fetchAlbums } = useAlbumFeed();

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <View className="flex-1 bg-pill">
      {/* Header */}
      <View className="px-5 pt-4  pb-4">
        <Text className="text-6xl font-bold text-text tracking-tight">
          Albums
        </Text>
      </View>

      {albums.length === 0 ? (
        <ActivityIndicator className="flex-1" />
      ) : (
        <ScrollView
          contentContainerClassName="px-4 pb-8"
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {/* 2-column grid */}
          <View className="flex-row flex-wrap gap-3">
            {albums?.map((album, index) => {
              if (album.assetCount === 0) return null;
              return (
                <MotiView
                  key={album.id}
                  from={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    delay: index * 60,
                    type: "timing",
                    duration: 300,
                  }}
                  style={{ width: "48.2%" }}
                >
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/album/[aid]?type=album",
                        params: { aid: album.id },
                      })
                    }
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    })}
                  >
                    {/* Thumbnail */}
                    <View
                      className="rounded-2xl overflow-hidden bg-secondary/20"
                      style={{
                        shadowColor: "#7c3aed",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 4,
                      }}
                    >
                      <Image
                        src={album?.firstPhoto?.[0]?.uri}
                        style={{ width: "100%", aspectRatio: 1 }}
                        resizeMode="cover"
                      />
                    </View>

                    {/* Label */}
                    <View className="mt-2 px-0.5">
                      <Text
                        className="text-sm font-semibold text-text"
                        numberOfLines={1}
                      >
                        {album.title}
                      </Text>
                      <Text className="text-xs text-secondary mt-0.5">
                        {album.assetCount}{" "}
                        {album.assetCount === 1 ? "photo" : "photos"}
                      </Text>
                    </View>
                  </Pressable>
                </MotiView>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
