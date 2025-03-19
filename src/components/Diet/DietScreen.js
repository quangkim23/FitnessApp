// src/components/Diet/DietScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const DietScreen = () => {
  const { user } = useWorkout();
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem("meals");
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error("Error loading meals:", error);
      }
    };
    loadMeals();
  }, []);

  const addMeal = async () => {
    if (!mealName || !calories) return;
    const meal = {
      name: mealName,
      calories: parseInt(calories),
      date: new Date().toISOString(),
    };
    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    await AsyncStorage.setItem("meals", JSON.stringify(updatedMeals));
    setMealName("");
    setCalories("");
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const renderMeal = ({ item }) => (
    <View style={styles.meal}>
      <Text style={styles.mealText}>
        {item.name}: {item.calories} kcal
      </Text>
      <Text style={styles.mealDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Track Your Diet</Text>
      {user && (
        <Text style={styles.info}>
          Daily Calorie Goal: {user.dailyCalorieGoal} kcal
        </Text>
      )}
      <Text style={styles.info}>
        Total Calories Today: {totalCalories} kcal
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={mealName}
          onChangeText={setMealName}
          placeholder="Enter meal name"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
          placeholder="Enter calories (kcal)"
        />
        <Button title="Add Meal" onPress={addMeal} color="#FF6F61" />
      </View>
      <FlatList
        data={meals}
        renderItem={renderMeal}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No meals logged yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    marginBottom: 10,
  },
  meal: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealText: {
    fontSize: 16,
    color: "#212121",
  },
  mealDate: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default DietScreen;
