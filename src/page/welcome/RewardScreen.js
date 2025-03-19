// src/page/welcome/RewardScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RewardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Great Job!</Text>
      <Text style={styles.message}>
        You've earned a personalized workout plan based on your preferences.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FinalScreen")}
      >
        <Text style={styles.buttonText}>See Your Plan</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default RewardScreen;
