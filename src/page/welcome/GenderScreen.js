// src/page/welcome/GenderScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GenderScreen = ({ navigation }) => {
  const [gender, setGender] = useState(null);

  const options = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const handleSelect = async (value) => {
    setGender(value);
    try {
      await AsyncStorage.setItem("gender", value);
      navigation.navigate("HeightScreen");
    } catch (err) {
      console.error("Error saving gender:", err);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem("gender", "other");
      navigation.navigate("HeightScreen");
    } catch (err) {
      console.error("Error skipping gender:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your gender?</Text>
      <Text style={styles.subtitle}>
        This helps us tailor your workout plan.
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              gender === option.value && styles.selectedButton,
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Text
              style={[
                styles.buttonText,
                gender === option.value && styles.selectedButtonText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip / Prefer not to say</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
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
  skipButton: { marginTop: 20 },
  skipText: { fontSize: 14, color: "#666", textDecorationLine: "underline" },
});

export default GenderScreen;
