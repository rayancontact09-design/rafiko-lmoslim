import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useSmoothedRotation(targetDeg: number) {
  const anim = useRef(new Animated.Value(targetDeg)).current;
  const currentRef = useRef(targetDeg);

  useEffect(() => {
    let delta = (targetDeg - currentRef.current) % 360;
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;
    const newValue = currentRef.current + delta;
    currentRef.current = newValue;
    Animated.timing(anim, {
      toValue: newValue,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [targetDeg, anim]);

  return anim;
}

export function angularDistance(a: number, b: number): number {
  let diff = (a - b) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return Math.abs(diff);
}
