import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/appStyles";

interface HeaderProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onAddTask: () => void;
  onSubmitEditing: () => void;
  textInputRef: React.RefObject<TextInput | null>;
}

const Header: React.FC<HeaderProps> = ({
  inputText,
  onInputChange,
  onAddTask,
  onSubmitEditing,
  textInputRef,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Taskly</Text>
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={onInputChange}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddTask}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
