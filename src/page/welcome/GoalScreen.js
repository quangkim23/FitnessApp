// src/page/welcome/GoalScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GoalScreen = ({ navigation }) => {
  const [goal, setGoal] = useState(null);

  const options = [
    { label: "Giảm cân", value: "lose_weight" },
    { label: "Xây dựng cơ bắp", value: "build_muscle" },
    { label: "Giữ dáng", value: "stay_fit" },
  ];

  const handleSelect = async (value) => {
    setGoal(value);
    try {
      await AsyncStorage.setItem("goal", value);
      navigation.navigate("ExercisePreferenceScreen");
    } catch (err) {
      console.error("Error saving goal:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mục tiêu tập luyện của bạn là gì?</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              goal === option.value && styles.selectedButton,
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Text
              style={[
                styles.buttonText,
                goal === option.value && styles.selectedButtonText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 30,
    textAlign: "center",
  },
  optionsContainer: { width: "100%", alignItems: "center" },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    width: "80%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 2,
  },
  selectedButton: { backgroundColor: "#4CAF50", borderColor: "#388E3C" },
  buttonText: {
    fontSize: 16,
    color: "#212121",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedButtonText: { color: "#FFFFFF", fontWeight: "600" },
});

export default GoalScreen;
