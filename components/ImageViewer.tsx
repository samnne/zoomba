import { useDefaultFeed, useImage, useRandomFeed } from "@/store/zustand";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ImagePickerExample from "./ImagePicker";
const fetchOptions: {
  random: Partial<MediaLibrary.AssetsOptions>;
} = {
  random: {
    sortBy: [],
  },
};
const ImageViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { curImage, setCurImage, images, removeImage } = useImage();
  const { fetchPhotos } = useDefaultFeed();
  const { fetchRandom } = useRandomFeed();
  const [fetching, setFetching] = useState(false);
  const [curDate, setCurDate] = useState("");
  const { q, type } = useLocalSearchParams<{ q: string; type: "random" }>();
  console.log(type);
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
  }, [currentIndex, images, setCurImage]);

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
      if (i === 0 && newLength === 0 && type !== "random") {
        fetchPhotos();
      } else if (i === 0 && newLength === 0 && type === "random") {
        fetchRandom(20);
      }

      if (i >= newLength - 1) {
        return 0;
      }

      return i + 1;
    });
  };

  useEffect(() => {
    if (images.length > 0) {
      return;
    }

    fetchRandom(20);
  }, []);

  useEffect(() => {
    if (curImage?.creationTime) {
      setCurDate(new Date(curImage.creationTime).toDateString());
    }
  }, [curImage]);
  return (
    <View className="flex-1 w-full px-4">
      <View
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 28,
          overflow: "hidden",
        }}
        className=""
      >
        <ImagePickerExample
          key={images[currentIndex]?.id || currentIndex} // Add a unique key here
          onKeep={next}
          curIndex={currentIndex}
          onDelete={handleDeleteImage}
        />
        {/* date overlay */}
        <View
          style={{ position: "absolute", bottom: 16, zIndex: 50, left: 18 }}
          pointerEvents="none"
        >
          <Text className="text-primary font-bold bg-white rounded-lg px-2 py-1 shadow">
            {curDate}
          </Text>
        </View>

        <View
          style={{ position: "absolute", top: 16, zIndex: 50, right: 18 }}
          pointerEvents="none"
        >
          <Text className="text-primary font-bold bg-white rounded-lg px-2 py-1 shadow">
            {images.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ImageViewer;
