import React, { useState, useCallback } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type FlashMessageType = "success" | "danger";

interface FlashMessageData {
  id: number;
  message: string;
  type: FlashMessageType;
}

interface FlashMessageProps {
  message: FlashMessageData | null;
  onHide: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ message, onHide }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideMessage();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const hideMessage = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!message) return null;

  const isSuccess = message.type === "success";
  const backgroundColor = isSuccess ? "#4CAF50" : "#FF5252";
  const iconName = isSuccess ? "checkmark-circle" : "alert-circle";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          backgroundColor,
        },
      ]}
    >
      <Ionicons name={iconName} size={24} color="#FFFFFF" />
      <Text style={styles.message}>{message.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
});

export default FlashMessage;
