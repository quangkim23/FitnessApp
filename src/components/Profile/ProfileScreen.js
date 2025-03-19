import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user } = useWorkout();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user.avatar || "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name || "Unnamed User"}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.detail}>🎯 Goal: {user.goal}</Text>
            <Text style={styles.detail}>⚖️ Weight: {user.weight} kg</Text>
            <Text style={styles.detail}>📏 Height: {user.height} cm</Text>
            <Text style={styles.detail}>
              🔢 BMI: {user.bmi} ({user.bmi_category})
            </Text>
            <Text style={styles.detail}>🧑 Gender: {user.gender}</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  profileCard: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  detail: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
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

export default ProfileScreen;
