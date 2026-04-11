import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import {
  AnimatePresence,
  Image,
  MotiView,
  useAnimationState,
  View,
} from "moti";
import { MotiPressable as Pressable } from "moti/interactions";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import {
  SafeAreaView as RNSAV,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const SafeAreaView = styled(RNSAV);

interface OnboardingStep {
  id: number;
  headline: string;
  body: string;
  icon: React.ReactNode;
  color: string;
}
const icons = [
  <Feather key={20} name="shopping-bag" size={64} color={"#000"} />,
  <Feather key={21} name="search" size={64} color={"#000"} />,
  <Feather key={22} name="dollar-sign" size={64} color={"#000"} />,
  <Feather key={23} name="shield" size={64} color={"#000"} />,
  <Feather key={24} name="airplay" size={64} color={"#000"} />,
];
const STEPS: OnboardingStep[] = [
  {
    id: 1,
    headline: "Welcome to Zoomba!",
    body: "Tidy up your memories to make space for more of what matters.",
    icon: icons[0],
    color: "bg-primary",
  },
  {
    id: 2,
    headline: "Swipe, Swipe, Sleep",
    body: "Swipe left to delete, right to keep, and sleep better with extra storage.",
    icon: icons[1],
    color: "bg-secondary",
  },
  {
    id: 3,
    headline: "Declutter by Month",
    body: "We organize your gallery into bite-sized sessions so cleaning doesn't feel like a chore.",
    icon: icons[2],
    color: "bg-text",
  },
  {
    id: 4,
    headline: "Double Check",
    body: "Nothing is deleted forever until you review your 'Trash' pile. No accidental heartbreaks here.",
    icon: icons[3],
    color: "bg-primary",
  },
  {
    id: 5,
    headline: "Ready to lose the junk?",
    body: "Let’s get your account set up so you can start reclaiming your gigabytes.",
    icon: icons[4],
    color: "bg-secondary",
  },
];

STEPS.forEach((step, index) => {
  step.icon = icons[index];
});
const Index = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [pressed, setPressed] = useState(false);
  const router = useRouter();
  const buttonAnimState = useAnimationState({
    from: { width: "0%", opacity: 0 },
    hidden: { width: "0%", opacity: 0 },
    visible: { width: "33%", opacity: 1 },
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1); // sliding left = next
      setCurrentStep((prev) => prev + 1);
      if (currentStep === 0) buttonAnimState.transitionTo("visible");
      if (currentStep + 1 === STEPS.length - 1)
        buttonAnimState.transitionTo("hidden");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1); // sliding right = back
      setCurrentStep((prev) => prev - 1);
      if (currentStep === 1) buttonAnimState.transitionTo("hidden");
    }
  };

  function handleFinish() {
    router.replace("/home");
  }

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <SafeAreaView className="flex-1 justify-between p-8 bg-white">
      <AnimatePresence>
        <Pressable
          animate={{
            scale: pressed ? 0.5 : 1,
            opacity: pressed ? 0.5 : 1,
            // rotateZ: pressed ? "25deg" : "0deg",
          }}
          transition={{
            type: "spring",
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
            margin: "auto",
          }}
        >
          <Image
            width={200}
            height={200}
            className="w-30 h-30"
            source={require("../assets/images/zoomba_mascot.png")}
          />
        </Pressable>
      </AnimatePresence>
      {/* Key change forces AnimatePresence to unmount old, mount new */}
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={currentStep}
          from={{
            opacity: 0,
            translateX: direction * 300,
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          exit={{
            opacity: 0,
            translateX: direction * -300,
          }}
          transition={{
            type: "timing",

            duration: 500,
          }}
          className="flex-2 items-center w-full max-w-sm my-8"
        >
          <MotiView className="flex-1 gap-4 justify-center items-center">
            <View className="flex-row">
              <Text className="text-5xl font-bold text-primary">Zoomba</Text>
            </View>
            <Text className="text-3xl mt-4 text-text font-bold text-center">
              {step.headline}
            </Text>
          </MotiView>
          <View className="flex-1 gap-2 flex-wrap flex-row justify-center items-center">
            <Text className="text-center text-gray-500 text-xl w-3/4">
              {step.body}
            </Text>
          </View>
        </MotiView>
      </AnimatePresence>

      <View>
        <View className="flex-row gap-2 items-stretch">
          <MotiView
            state={buttonAnimState}
            transition={{ type: "timing" }}
            style={{ overflow: "hidden" }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={prevStep}
              className="flex-1 rounded-2xl bg-secondary px-6 py-4 justify-center items-center"
            >
              <Text className="font-bold text-white text-xl">← Back</Text>
            </TouchableOpacity>
          </MotiView>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={isLastStep ? handleFinish : nextStep}
            className="flex-1"
          >
            <View
              animate={{
                scale: pressed ? 0.95 : 1,
                opacity: pressed ? 0.9 : 1,
              }}
              transition={{ type: "timing" }}
              className="rounded-2xl shadow bg-primary px-6 py-4 justify-center items-center"
            >
              <Text className="font-bold text-white text-xl">
                {isLastStep ? "Get Started" : "Next"}{" "}
                <Feather name="arrow-right" size={20} color="white" />
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center mt-4 gap-2">
        {STEPS.map((s, i) => (
          <View
            key={s.body}
            animate={{
              backgroundColor: currentStep === i ? "#9810fa" : "#99a1af",
            }}
            className="h-4 w-8 rounded-full"
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Index;
