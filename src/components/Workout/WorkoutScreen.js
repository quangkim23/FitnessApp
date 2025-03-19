// src/components/Workout/WorkoutScreen.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";

const WorkoutScreen = ({ navigation }) => {
  const { workouts, fetchWorkouts } = useWorkout();

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const renderWorkout = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => navigation.navigate("WorkoutDetail", { workout: item })}
    >
      <Text style={styles.workoutName}>{item.name || "Unnamed Workout"}</Text>
      <Text style={styles.workoutDuration}>{item.duration || "N/A"}</Text>
    </TouchableOpacity>
  );

  if (!workouts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Workout Plan</Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workouts available</Text>
        }
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Favorites")}
      >
        <Text style={styles.buttonText}>View Favorites</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  list: { paddingBottom: 20 },
  workoutCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutName: { fontSize: 16, fontWeight: "500", color: "#212121" },
  workoutDuration: { fontSize: 14, color: "#666" },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default WorkoutScreen;
