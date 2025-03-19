import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";

const GoalScreen = ({ navigation }) => {
  const { user, updateUserProfile } = useWorkout(); // Added user to access existing data
  const [goal, setGoal] = useState(user?.goal || "lose_weight");
  const [targetWeight, setTargetWeight] = useState(
    user?.targetWeight?.toString() || ""
  );

  const calculateDailyCalorieGoal = (goal, targetWeight) => {
    if (goal === "lose_weight" && targetWeight) {
      const weightLossPerWeek = 0.5; // 0.5 kg per week (safe weight loss rate)
      const calorieDeficit = (weightLossPerWeek * 7700) / 7; // 7700 calories = 1 kg
      const baseCalories = 2000; // Simplified base (could be dynamic based on user data)
      return Math.round(baseCalories - calorieDeficit);
    }
    return null; // No calorie goal for other goals in this simplified version
  };

  const handleNext = async () => {
    if (goal === "lose_weight" && !targetWeight) {
      Alert.alert("Error", "Please enter your target weight.");
      return;
    }

    const parsedTargetWeight = targetWeight ? parseFloat(targetWeight) : null;
    if (
      goal === "lose_weight" &&
      (isNaN(parsedTargetWeight) || parsedTargetWeight <= 0)
    ) {
      Alert.alert("Error", "Target weight must be a valid positive number.");
      return;
    }

    // Calculate daily calorie goal if applicable
    const dailyCalorieGoal = calculateDailyCalorieGoal(
      goal,
      parsedTargetWeight
    );

    // Prepare updated user data, preserving existing fields
    const updatedUserData = {
      ...user, // Preserve existing fields like id, height, weight, etc.
      goal,
      targetWeight: parsedTargetWeight || undefined, // Only include if provided
      dailyCalorieGoal: dailyCalorieGoal || undefined, // Only include if calculated
    };

    try {
      await updateUserProfile(updatedUserData);
      navigation.navigate("FitnessLevelScreen");
    } catch (error) {
      Alert.alert("Error", "Failed to save your goal. Please try again.");
      console.error("Error updating user profile:", error);
    }
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
          {targetWeight && (
            <Text style={styles.calorieGoal}>
              Estimated Daily Calorie Goal:{" "}
              {calculateDailyCalorieGoal(goal, parseFloat(targetWeight))} kcal
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
    backgroundColor: "#F5F5",
    ruling: "hidden",
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
