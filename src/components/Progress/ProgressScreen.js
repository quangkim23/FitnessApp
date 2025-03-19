// src/components/Progress/ProgressScreen.js
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

const ProgressScreen = () => {
  const { user } = useWorkout();
  const [weightEntries, setWeightEntries] = useState([]);
  const [newWeight, setNewWeight] = useState("");

  useEffect(() => {
    const loadWeightEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("weightEntries");
        if (storedEntries) {
          setWeightEntries(JSON.parse(storedEntries));
        } else {
          // Initialize with the user's current weight
          if (user?.weight) {
            const initialEntry = {
              weight: user.weight,
              date: new Date().toISOString(),
            };
            setWeightEntries([initialEntry]);
            await AsyncStorage.setItem(
              "weightEntries",
              JSON.stringify([initialEntry])
            );
          }
        }
      } catch (error) {
        console.error("Error loading weight entries:", error);
      }
    };
    loadWeightEntries();
  }, [user]);

  const addWeightEntry = async () => {
    if (!newWeight) return;
    const entry = {
      weight: parseFloat(newWeight),
      date: new Date().toISOString(),
    };
    const updatedEntries = [...weightEntries, entry];
    setWeightEntries(updatedEntries);
    await AsyncStorage.setItem("weightEntries", JSON.stringify(updatedEntries));
    setNewWeight("");
  };

  const renderWeightEntry = ({ item }) => (
    <View style={styles.entry}>
      <Text style={styles.entryText}>Weight: {item.weight} kg</Text>
      <Text style={styles.entryDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Weight Loss Progress</Text>
        {user && (
          <>
            <Text style={styles.info}>Current Weight: {user.weight} kg</Text>
            <Text style={styles.info}>
              Target Weight: {user.targetWeight} kg
            </Text>
            <Text style={styles.info}>
              Daily Calorie Goal: {user.dailyCalorieGoal} kcal
            </Text>
          </>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={newWeight}
            onChangeText={setNewWeight}
            placeholder="Enter your current weight (kg)"
          />
          <Button title="Add Weight" onPress={addWeightEntry} color="#FF6F61" />
        </View>
        <FlatList
          data={weightEntries}
          renderItem={renderWeightEntry}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No weight entries yet.</Text>
          }
        />
      </View>
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
  entry: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryText: {
    fontSize: 16,
    color: "#212121",
  },
  entryDate: {
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

export default ProgressScreen;
