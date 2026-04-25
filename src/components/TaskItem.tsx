import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../types/types";
import { styles } from "../styles/taskItemStyles";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={task.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={task.completed ? "#4CAF50" : "#666"}
          style={styles.checkbox}
        />

        <Text
          style={[styles.taskText, task.completed && styles.completedText]}
          numberOfLines={2}
        >
          {task.text}
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
          activeOpacity={0.6}
        >
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TaskItem;
