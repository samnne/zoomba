import Card from "@/components/Card";
import { styled } from "nativewind";
import React, { useState } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
const data = [
  {
    key: 1,
    name: "Card 1",
    number: "0000-0000-0000-0000",
    bgColor: "red",
  },
  {
    key: 2,
    name: "Card 2",
    number: "0000-1111-0000-0000",
    bgColor: "purple",
  },
  {
    key: 3,
    name: "Card 3",
    number: "0000-0000-1111-0000",
    bgColor: "white",
  },
  {
    key: 4,
    name: "Card 4",
    number: "0000-0000-0000-1111",
    bgColor: "blue",
  },
  {
    key: 5,
    name: "Card 5",
    number: "1111-0000-0000-0000",
    bgColor: "violet",
  },
];
const SafeAreaView = styled(RNSAV);
const test = () => {
  const [curIdx, setCurIdx] = useState(0);
  const animatedValue = useSharedValue(0);
  // const translateX = useSharedValue(0);
  // const MAX = 3;
  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { translateX: translateX.value },
  //       {
  //         scale: 1 - index * 0.1,
  //       },
  //       { translateY: index * -30 },
  //     ],
  //   };
  // });
  return (
    <SafeAreaView className="flex-1  bg-gray-900">
      <View className="justify-center items-center flex-1">
        {data.map((d, index) => {
          if (index > curIdx + 3 || index < curIdx) {
            return null;
          }
          return (
            <Card
              index={index}
              curIdx={curIdx}
              item={d}
              maxItem={3}
              dataLength={data.length}
              setCurIdx={setCurIdx}
              animatedValue={animatedValue}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default test;
