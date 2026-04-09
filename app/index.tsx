import ImagePickerExample from "@/components/ImagePicker";
import { useImage } from "@/store/zustand";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  SafeAreaView as RNSAV,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const SafeAreaView = styled(RNSAV);

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const { curImage, setCurImage, fetchPhotos, hasMore, images, removeImage } =
    useImage();
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const [curDate, setCurDate] = useState("");
  useEffect(() => {
    const getPermission = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Permission needed to delete photos");
          return;
        }
      } catch (error) {
        console.log("Delete failed", error);
      }
    };
    getPermission();
  }, []);
  // Keep curImage in sync with the index
  useEffect(() => {
    if (images.length > 0) {
      setFetching(false);
      setCurImage(images[currentIndex]);
    } else {
      setFetching(true);
      setCurImage(null);
    }
  }, [currentIndex, images]);

  const handleDeleteImage = async () => {
    if (!curImage?.id) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission needed to delete photos");
        return;
      }

      const success = await MediaLibrary.deleteAssetsAsync([curImage.id]);
    } catch (error) {
      next();
      console.log("Delete failed", error);
    }
  };

  const next = () => {
    // Remove only the current image from memory when moving to next
    removeImage(currentIndex);

    setCurrentIndex((i) => {
      const newLength = images.length - 1;
      if (i === 0 && newLength === 0 && hasMore) {
        fetchPhotos();
      }
      console.log(fetching);
      console.log(i, newLength);
      if (i >= newLength - 1) {
        return 0;
      }

      return i + 1;
    });
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (curImage?.creationTime) {
      setCurDate(new Date(curImage.creationTime).toDateString());
    }
  }, [curImage]);

  return (
    <SafeAreaView
      style={{ marginRight: insets.right, marginLeft: insets.left }}
      className="flex-1 items-center"
      style={{ backgroundColor: "#FDF4EC" }}
    >
      {/* header */}
      <View className="w-full px-5 pt-2 pb-1 flex-row items-center justify-between">
        <Text
          style={{
            fontSize: 32,
            fontWeight: "600",
            color: "#2D1B0E",
            letterSpacing: -0.5,
          }}
        >
          Cleanr
        </Text>
        <View
          style={{
            backgroundColor: "#E8604C",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FDF4EC", fontWeight: "600", fontSize: 13 }}>
            {images.length}
          </Text>
        </View>
      </View>

      {/* subheader */}
      <View className="w-full px-5 pb-3">
        <Text style={{ color: "#9B5E3B", fontSize: 13 }}>
          swipe right to keep · left to delete
        </Text>
      </View>

      {/* card area */}
      <View className="flex-1 w-full px-4">
        <View
          style={{
            flex: 1,
            width: "100%",
            borderRadius: 28,
            overflow: "hidden",
            backgroundColor: "#2D1B0E",
          }}
        >
          <ImagePickerExample
            key={images[currentIndex]?.id || currentIndex} // Add a unique key here
            onKeep={next}
            setCurIdx={setCurrentIndex}
            curIndex={currentIndex}
            onDelete={handleDeleteImage}
          />
          {/* date overlay */}
          <View
            style={{ position: "absolute", bottom: 16, left: 18 }}
            pointerEvents="none"
          >
            <Text
              style={{
                color: "rgba(253,244,236,0.8)",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {curDate}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
