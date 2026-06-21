import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface FadeInScaleProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
}

export function FadeInScale({ children, delay = 0, style }: FadeInScaleProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, delay, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 280, delay, useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, scale]);

  return <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>{children}</Animated.View>;
}
