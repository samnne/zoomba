import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView as RNSAV,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSAV);

interface OnboardingStep {
  id: number;
  headline: string;
  body: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
}

const STEPS: OnboardingStep[] = [
  {
    id: 1,
    headline: "Welcome to Zoomba!",
    body: "Tidy up your memories to make space for more of what matters.",
    iconName: "shopping-bag",
  },
  {
    id: 2,
    headline: "Swipe, Swipe, Sleep",
    body: "Swipe left to delete, right to keep, and sleep better with extra storage.",
    iconName: "search",
  },
  {
    id: 3,
    headline: "Declutter by Month",
    body: "We organize your gallery into bite-sized sessions so cleaning doesn't feel like a chore.",
    iconName: "dollar-sign",
  },
  {
    id: 4,
    headline: "Double Check",
    body: "Nothing is deleted forever until you review your 'Trash' pile. No accidental heartbreaks here.",
    iconName: "shield",
  },
  {
    id: 5,
    headline: "Ready to lose the junk?",
    body: "Let's get your account set up so you can start reclaiming your gigabytes.",
    iconName: "airplay",
  },
];

const Index = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ── Progress bar ── */}
      <View className="flex-row gap-1.5 px-6 pt-4">
        {STEPS.map((s, i) => (
          <MotiView
            key={s.id}
            animate={{
              backgroundColor: i <= currentStep ? "#9810fa" : "#e9d5ff",
              scaleY: i === currentStep ? 1.15 : 1,
            }}
            transition={{ type: "timing", duration: 300 }}
            style={{ flex: 1, height: 4, borderRadius: 99 }}
          />
        ))}
      </View>

      {/* ── Mascot ── */}
      {/* <View className="items-center mt-6">
        <Image
          source={require("../assets/images/zoomba_mascot.png")}
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />
      </View> */}

      {/* ── Slide content ── */}
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={currentStep}
          from={{ opacity: 0, translateX: direction * 60 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: direction * -60 }}
          transition={{ type: "timing", duration: 280 }}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
          className=""
        >
          {/* Icon bubble */}
          <MotiView
            from={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 80, delay: 100 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              backgroundColor: "#f3e8ff",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              shadowColor: "#9810fa",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Feather name={step.iconName} size={44} color="#9810fa" />
          </MotiView>

          <Text
            className="text-3xl font-bold text-text text-center"
            style={{ lineHeight: 38, marginBottom: 16 }}
          >
            {step.headline}
          </Text>

          <Text
            className="text-center text-gray-400 text-lg"
            style={{ lineHeight: 28, maxWidth: 300 }}
          >
            {step.body}
          </Text>
        </MotiView>
      </AnimatePresence>

      {/* ── Step counter ── */}
      <Text className="text-center text-gray-300 text-sm mb-4">
        {currentStep + 1} of {STEPS.length}
      </Text>

      {/* ── Buttons ── */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 16,
          gap: 12,
        }}
      >
        {/* Primary CTA */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={isLastStep ? handleFinish : nextStep}
          style={{
            backgroundColor: "#9810fa",
            borderRadius: 18,
            paddingVertical: 18,
            alignItems: "center",
            shadowColor: "#9810fa",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
            {isLastStep ? "Get Started 🎉" : "Continue"}
          </Text>
        </TouchableOpacity>

        {/* Back — fades in after step 1 */}
        <AnimatePresence>
          {!isFirstStep && (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 8 }}
              transition={{ type: "timing", duration: 220 }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={prevStep}
                style={{ paddingVertical: 14, alignItems: "center" }}
              >
                <Text
                  style={{ color: "#c084fc", fontWeight: "600", fontSize: 16 }}
                >
                  ← Back
                </Text>
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </SafeAreaView>
  );
};

export default Index;
