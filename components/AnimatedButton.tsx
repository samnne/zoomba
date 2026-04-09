import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

export function AnimatedButton({ onPress, className, children }) {
  const scale = useSharedValue(1)
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onBegin(() => { scale.value = withSpring(0.9) })
    .onEnd(() => { scale.value = withSpring(1); onPress?.() })
    .onFinalize(() => { scale.value = withSpring(1) })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={style} className={className}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
