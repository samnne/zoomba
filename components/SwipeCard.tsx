import { useEffect } from "react";
import { Image, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function SwipeCard({
  image,
  onKeep,
  onDelete,
}: {
  image: any;
  onKeep: () => void;
  onDelete: () => void;
}) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const dismiss = (direction: "keep" | "delete") => {
    if (direction === "keep") onKeep();
    else onDelete();
  };

  //
  useEffect(() => {
    translateX.value = 0;
    rotate.value = 0;
  }, [image]); // Reset whenever the image object changes

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      rotate.value = e.translationX / 20;
    })
    .onEnd((e) => {
      if (e.translationX > 80) {
        translateX.value = withTiming(600, {}, () => runOnJS(dismiss)("keep"));
      } else if (e.translationX < -80) {
        translateX.value = withTiming(-600, {}, () =>
          runOnJS(dismiss)("delete"),
        );
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const keepLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [20, 100],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [{ rotate: "-8deg" }],
  }));

  const deleteLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-20, -100],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [{ rotate: "8deg" }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[cardStyle, { flex: 1, borderRadius: 28, overflow: "hidden" }]}
      >
        <Image
          className="flex-1 w-full"
          source={{ uri: image?.uri }}
          resizeMode="cover"
        />

        {/* warm cream overlay at bottom for metadata */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: "rgba(45, 27, 14, 0.45)",
            paddingHorizontal: 16,
            paddingVertical: 12,
            justifyContent: "flex-end",
          }}
        />

        {/* KEEP label — sage green */}
        <Animated.View
          style={[
            keepLabelStyle,
            {
              position: "absolute",
              top: 36,
              left: 18,
              borderWidth: 3,
              borderColor: "#5DBD8A",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: "rgba(253, 244, 236, 0.15)",
            },
          ]}
        >
          <Text
            style={{
              color: "#5DBD8A",
              fontSize: 26,
              fontWeight: "700",
              letterSpacing: 1,
            }}
          >
            ✦ KEEP
          </Text>
        </Animated.View>

        {/* DELETE label — terracotta */}
        <Animated.View
          style={[
            deleteLabelStyle,
            {
              position: "absolute",
              top: 36,
              right: 18,
              borderWidth: 3,
              borderColor: "#E8604C",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 6,
              backgroundColor: "rgba(253, 244, 236, 0.15)",
            },
          ]}
        >
          <Text
            style={{
              color: "#E8604C",
              fontSize: 26,
              fontWeight: "700",
              letterSpacing: 1,
            }}
          >
            ✕ DELETE
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
