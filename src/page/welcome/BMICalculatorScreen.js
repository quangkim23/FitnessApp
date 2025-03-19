// src/page/welcome/BMICalculatorScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BMICalculatorScreen = ({ navigation }) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHeight = await AsyncStorage.getItem("height");
        const storedWeight = await AsyncStorage.getItem("weight");
        if (storedHeight) setHeight(storedHeight);
        if (storedWeight) setWeight(storedWeight);
      } catch (err) {
        console.error("Error loading BMI data:", err);
      }
    };
    loadData();
  }, []);

  const calculateBMI = async () => {
    setError("");
    if (!height || !weight) {
      setError("Please enter both height and weight");
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters <= 0 || weightInKg <= 0) {
      setError("Height and weight must be positive numbers");
      return;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    let bmiCategory = "";

    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 25) bmiCategory = "Normal";
    else if (bmiValue < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setBmi(bmiValue);
    setCategory(bmiCategory);

    try {
      await Promise.all([
        AsyncStorage.setItem("height", height),
        AsyncStorage.setItem("weight", weight),
        AsyncStorage.setItem("bmi", bmiValue.toString()),
        AsyncStorage.setItem("bmiCategory", bmiCategory),
      ]);
    } catch (err) {
      console.error("Error saving BMI data:", err);
    }
  };

  const getCategoryMessage = () => {
    switch (category) {
      case "Underweight":
        return "Consider gaining weight with a balanced diet.";
      case "Normal":
        return "Great job! You have a healthy weight.";
      case "Overweight":
        return "Consider losing weight for better health.";
      case "Obese":
        return "Weight loss is recommended to reduce health risks.";
      default:
        return "";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calculate Your BMI</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>BMI: {bmi.toFixed(1)}</Text>
          <Text style={styles.result}>Category: {category}</Text>
          <Text style={styles.resultMessage}>{getCategoryMessage()}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RewardScreen")}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  error: { color: "#D32F2F", fontSize: 14, marginBottom: 10 },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  result: {
    fontSize: 18,
    fontWeight: "500",
    color: "#212121",
    marginVertical: 5,
  },
  resultMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default BMICalculatorScreen;
