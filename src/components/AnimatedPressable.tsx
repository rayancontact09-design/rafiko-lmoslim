import React, { useRef } from "react";
import { Animated, Pressable, PressableProps, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";

interface AnimatedPressableProps extends Omit<PressableProps, "children"> {
  style?: ViewStyle | ViewStyle[];
  haptic?: boolean;
  children?: React.ReactNode;
}

export function AnimatedPressable({ style, onPress, haptic = true, children, ...rest }: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPressIn={() => animateTo(0.96)}
      onPressOut={() => animateTo(1)}
      onPress={(event) => {
        if (haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(event);
      }}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
