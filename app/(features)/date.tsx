import ImageViewer from "@/components/ImageViewer";
import { View } from "moti";
import { styled } from "nativewind";
import React from "react";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSAV);
const Date = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className=" flex-1">
        <ImageViewer />
      </View>
    </SafeAreaView>
  );
};

export default Date;
