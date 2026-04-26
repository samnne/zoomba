import { useImage } from "@/store/zustand";
import { Asset } from "expo-media-library";

import React, { useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

interface CardProps {
  dataLength: number;
  index: number;
  maxItem: number;
  item: Asset;
  curIdx: number;
  animatedValue: SharedValue<number>;
  functions: {
    onKeep: () => void;
    onDelete: () => void;
  };
}

const Card: React.FC<CardProps> = ({
  dataLength,
  index,
  maxItem,
  item,
  curIdx,
  animatedValue,
  functions,
}) => {
  const translateX = useSharedValue(0);
  const { width } = useWindowDimensions();
  const { setCurImage } = useImage();

  const isSwiping = useSharedValue(false);
  const direction = useSharedValue(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageOpacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(curIdx === index && imageLoaded ? 1 : 0, {
      duration: 200,
    }),
  }));
  useEffect(() => {
    setImageLoaded(false);
  }, [item?.uri]);
  useEffect(() => {
    if (curIdx === index) {
      setCurImage(item);
    }
  }, [curIdx, index, setCurImage, item]);
  const dismiss = (direction: "keep" | "delete") => {
    if (direction === "keep") functions?.onKeep();
    else functions?.onDelete();
  };
  const animatedStyle = useAnimatedStyle(() => {
    const curitem = index === curIdx;
    const rotateZ = interpolate(
      Math.abs(translateX.value),
      [0, width],
      [0, 20],
    );
    const translateY = interpolate(
      animatedValue.value,
      [index - 1, index],
      [-30, 0],
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index],
      [0.9, 1],
    );
    const opacity = interpolate(
      animatedValue.value + maxItem,
      [index, index + 1],
      [0, 1],
    );

    return {
      transform: [
        { translateX: translateX.value },
        {
          scale: curitem ? 1 : scale,
        },
        { translateY: curitem ? 0 : translateY },
        { rotateZ: curitem ? `${direction.value * rotateZ}deg` : "0deg" },
      ],
      opacity: index < maxItem + curIdx ? 1 : opacity,
    };
  });
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const isSwipeRight = e.translationX > 0;
      direction.value = isSwipeRight ? 1 : -1;
      if (curIdx === index) {
        translateX.value = e.translationX;
        animatedValue.value = interpolate(
          Math.abs(e.translationX),
          [0, width],
          [index, index + 1],
        );
      }
    })
    .onEnd((e) => {
      // if (isSwiping.value) return;

      if (curIdx === index) {
        if (Math.abs(e.translationX) > 150 || Math.abs(e.velocityX) > 1000) {
          isSwiping.value = true;

          translateX.value = withTiming(width * direction.value, {}, () => {
            if (direction.value < 0) {
              runOnJS(dismiss)("delete");
            } else {
            }
            runOnJS(dismiss)("keep");

            animatedValue.value = withTiming(curIdx + 1);
            translateX.value = withTiming(width * direction.value);

            // isSwiping.value = false;
          });
        } else {
          animatedValue.value = withTiming(curIdx);
          translateX.value = withTiming(0, { duration: 500 });
        }
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            zIndex: dataLength - index,
            elevation: dataLength - index,
          },
          animatedStyle,
        ]}
        className="flex-1 absolute  justify-between w-full h-full  "
      >
        <Animated.View
          style={[imageOpacityStyle]}
          className="flex-1  h-full w-full"
        >
          <Image
            className="flex-1 w-full h-full  rounded-2xl"
            source={item?.uri ? { uri: item.uri } : undefined}
            resizeMode="contain"
            // cachePolicy="memory-disk"
            onLoad={() => setImageLoaded(true)}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
