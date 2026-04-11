import { CatType } from "@/utils/constants";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text, View } from "moti";
import { TouchableOpacity } from "react-native";
export function CategoryCard({
  item,
  onPress,
}: {
  item: CatType;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`flex-1 relative  rounded-3xl p-5 min-h-40 overflow-hidden ${
        item.accent ? "bg-primary" : "bg-white border border-purple-200"
      }`}
    >
      {/* Icon pill */}
      <View
        className={`w-10 h-10 absolute right-5 top-5 rounded-xl items-center justify-center mb-2 ${
          item.accent ? "bg-white/20" : "bg-background"
        }`}
      >
        <FontAwesome6
          name={item.icon}
          size={16}
          color={item.accent ? "white" : "black"}
        />
      </View>

      <Text
        className={` text-6xl font-black ${
          item.accent ? "text-white" : "text-text"
        }`}
      >
        {item.label}
      </Text>

      <Text
        className={`text-lg leading-relaxed ${
          item.accent ? "text-purple-200" : "text-secondary"
        }`}
      >
        {item.subtitle}
      </Text>

      {/* Decorative circle */}
      <View
        className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full ${
          item.accent ? "bg-white/10" : "bg-background"
        }`}
      />
    </TouchableOpacity>
  );
}
