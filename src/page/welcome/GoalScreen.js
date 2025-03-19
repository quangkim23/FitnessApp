// src/page/welcome/GoalScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";

const GoalScreen = ({ navigation }) => {
  const { updateUser } = useWorkout();
  const [goal, setGoal] = useState("lose_weight");
  const [targetWeight, setTargetWeight] = useState("");
  const [calorieGoal, setCalorieGoal] = useState(null);

  const handleNext = () => {
    if (!targetWeight && goal === "lose_weight") {
      alert("Please enter your target weight.");
      return;
    }
    // Calculate daily calorie goal (simplified formula for demo)
    if (goal === "lose_weight") {
      const weightLossPerWeek = 0.5; // 0.5 kg per week (safe weight loss rate)
      const calorieDeficit = (weightLossPerWeek * 7700) / 7; // 7700 calories = 1 kg
      const dailyCalorieGoal = 2000 - calorieDeficit; // Base of 2000 calories for simplicity
      setCalorieGoal(Math.round(dailyCalorieGoal));
      updateUser({
        goal,
        targetWeight: parseFloat(targetWeight),
        dailyCalorieGoal,
      });
    } else {
      updateUser({ goal });
    }
    navigation.navigate("FitnessLevelScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s Your Goal?</Text>
      <TouchableOpacity
        style={[styles.option, goal === "lose_weight" && styles.selectedOption]}
        onPress={() => setGoal("lose_weight")}
      >
        <Text style={styles.optionText}>Lose Weight</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.option,
          goal === "build_muscle" && styles.selectedOption,
        ]}
        onPress={() => setGoal("build_muscle")}
      >
        <Text style={styles.optionText}>Build Muscle</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, goal === "stay_fit" && styles.selectedOption]}
        onPress={() => setGoal("stay_fit")}
      >
        <Text style={styles.optionText}>Stay Fit</Text>
      </TouchableOpacity>

      {goal === "lose_weight" && (
        <View style={styles.targetWeightContainer}>
          <Text style={styles.label}>Target Weight (kg):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder="Enter your target weight"
          />
          {calorieGoal && (
            <Text style={styles.calorieGoal}>
              Estimated Daily Calorie Goal: {calorieGoal} kcal
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
    marginBottom: 30,
  },
  option: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    borderColor: "#FF6F61",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "500",
  },
  targetWeightContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "#212121",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    marginBottom: 15,
  },
  calorieGoal: {
    fontSize: 16,
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GoalScreen;
