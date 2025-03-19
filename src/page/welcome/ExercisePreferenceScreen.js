// src/page/welcome/ExercisePreferenceScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExercisePreferenceScreen = ({ navigation }) => {
  const [preference, setPreference] = useState(null);

  const options = [
    { label: "On a mat", value: "mat" },
    { label: "On a bed", value: "bed" },
    { label: "Outdoors", value: "outdoors" },
    { label: "Anywhere", value: "anywhere" },
  ];

  const handleSelect = async (value) => {
    setPreference(value);
    try {
      await AsyncStorage.setItem("exercisePreference", value);
      navigation.navigate("ExerciseFrequencyScreen");
    } catch (err) {
      console.error("Error saving preference:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where do you prefer to exercise?</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              preference === option.value && styles.selectedButton,
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Text
              style={[
                styles.buttonText,
                preference === option.value && styles.selectedButtonText,
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

export default ExercisePreferenceScreen;
