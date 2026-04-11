import { useImage } from "@/store/zustand";
import { useRef } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Card from "./Card";

export default function ImagePickerExample({
  curIndex,
  onKeep,
  onDelete,
}: {
  curIndex: number;
  onKeep: () => void;
  onDelete: () => void;
}) {
  const { images } = useImage();

  const animatedValueRef = useRef(useSharedValue(curIndex));
  const animatedValue = animatedValueRef.current;

  return (
    <View className="justify-center items-center flex-1">
      {/* Back Card - always in DOM to prevent blink */}
      {/* <Animated.View
        style={[
          {
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            overflow: "hidden",
          },
          backCardAnimStyle,
        ]}
      >
        {nextImage && (
          <Image
            style={{ flex: 1 }}
            source={{ uri: nextImage.uri }}
            resizeMode="cover"
          />
        )}
      </Animated.View> */}
      {/* Top Card */}

      {images.map((image, relativeIndex) => {
        if (relativeIndex > curIndex + 2 || relativeIndex < curIndex) {
          return null;
        }

        return (
          <Card
            functions={{ onKeep, onDelete }}
            key={image.id}
            item={image}
            curIdx={curIndex}
            dataLength={images.length}
            maxItem={3}
            index={relativeIndex}
            animatedValue={animatedValue}
          />
        );
      })}
    </View>
  );
}
