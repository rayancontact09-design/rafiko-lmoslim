import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  trackColor: string;
  progressColor: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  percent,
  size = 96,
  strokeWidth = 9,
  trackColor,
  progressColor,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const animatedPercent = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(animatedPercent, {
      toValue: clamped,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [clamped, animatedPercent]);

  const strokeDashoffset = animatedPercent.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={[styles.content, { width: size, height: size }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
