// src/components/Profile/ProfileScreen.js
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";

const ProfileScreen = () => {
  const { user } = useWorkout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.detail}>Gender: {user.gender}</Text>
          <Text style={styles.detail}>Height: {user.height} cm</Text>
          <Text style={styles.detail}>Weight: {user.weight} kg</Text>
          <Text style={styles.detail}>Goal: {user.goal}</Text>
          <Text style={styles.detail}>
            BMI: {user.bmi} ({user.bmi_category})
          </Text>
        </>
      ) : (
        <Text style={styles.emptyText}>No profile data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  detail: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
