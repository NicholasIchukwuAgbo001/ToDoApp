import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TaskItem from "./TaskItem";
import { Task, FilterType } from "../types/types";
import { styles } from "../styles/appStyles";

interface TaskListProps {
  tasks: Task[];
  activeFilter: FilterType;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeFilter,
  onToggleTask,
  onDeleteTask,
}) => {
  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "all":
      default:
        return tasks;
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem task={item} onToggle={onToggleTask} onDelete={onDeleteTask} />
  );

  const keyExtractor = (item: Task) => item.id;

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={
          tasks.length === 0 ? "clipboard-outline" : "checkmark-done-outline"
        }
        size={64}
        color="#CCC"
      />
      <Text style={styles.emptyText}>
        {tasks.length === 0
          ? "No tasks yet"
          : activeFilter === "completed"
            ? "No completed tasks"
            : "No tasks available"}
      </Text>
      {tasks.length === 0 && (
        <Text style={styles.emptySubtext}>
          Add your first task to get started!
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.listContainer}>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={getFilteredTasks()}
          renderItem={renderTaskItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState />}
        />
      )}
    </View>
  );
};

export default TaskList;
