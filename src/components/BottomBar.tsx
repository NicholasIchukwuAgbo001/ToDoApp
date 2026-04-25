import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FilterType } from "../types/types";
import { styles } from "../styles/bottomBarStyles";

interface BottomBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddPress: () => void;
  onLogout: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  activeFilter,
  onFilterChange,
  onAddPress,
  onLogout,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onFilterChange("all")}
        activeOpacity={0.6}
      >
        <Ionicons
          name="list"
          size={28}
          color={activeFilter === "all" ? "#2196F3" : "#666"}
        />
        <Text
          style={[
            styles.buttonText,
            activeFilter === "all" && styles.activeButtonText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onAddPress}
        activeOpacity={0.6}
      >
        <View style={styles.addButton}>
          <Ionicons name="add-circle" size={40} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onFilterChange("completed")}
        activeOpacity={0.6}
      >
        <Ionicons
          name="checkmark-done"
          size={28}
          color={activeFilter === "completed" ? "#2196F3" : "#666"}
        />
        <Text
          style={[
            styles.buttonText,
            activeFilter === "completed" && styles.activeButtonText,
          ]}
        >
          Done
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onLogout}
        activeOpacity={0.6}
      >
        <Ionicons name="log-out-outline" size={28} color="#FF5252" />
        <Text style={[styles.buttonText, { color: "#FF5252" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
