import ImageViewer from "@/components/ImageViewer";
import { View } from "moti";

import React from "react";

const Random = () => {
  return (
    <View className="flex-1 bg-black">
      <View className=" flex-1 p-4">
        <ImageViewer />
      </View>
    </View>
  );
};

export default Random;
