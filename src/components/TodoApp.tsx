import React, { useState, useEffect, useRef, useCallback } from "react";
import { Keyboard, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";
import TaskList from "./TaskList";
import BottomBar from "./BottomBar";
import { useAuth } from "../context/AuthContext";
import { useFlashMessage } from "../context/FlashMessageContext";
import { Task, FilterType } from "../types/types";

const TodoApp: React.FC = () => {
  const { user, logout } = useAuth();
  const { showSuccess } = useFlashMessage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const textInputRef = useRef<TextInput>(null);

  const storageKey = `@todo_app_tasks_${user?.id}`;

  useEffect(() => {
    if (user?.id) {
      setTasks([]);
      loadTasks();
    }
  }, [user?.id]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(storageKey);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      saveTasks();
    }
  }, [tasks]);

  const addTask = useCallback(() => {
    const trimmedText = inputText.trim();

    if (!trimmedText) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setInputText("");
    Keyboard.dismiss();
    showSuccess("Task added successfully");
  }, [inputText, showSuccess]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const focusInput = useCallback(() => {
    textInputRef.current?.focus();
  }, []);

  const handleSubmitEditing = useCallback(() => {
    addTask();
  }, [addTask]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            showSuccess("Logged out successfully");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <StatusBar style="dark" />

      <Header
        inputText={inputText}
        onInputChange={setInputText}
        onAddTask={addTask}
        onSubmitEditing={handleSubmitEditing}
        textInputRef={textInputRef}
      />

      <TaskList
        tasks={tasks}
        activeFilter={activeFilter}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />

      <BottomBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddPress={focusInput}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};

export default TodoApp;
