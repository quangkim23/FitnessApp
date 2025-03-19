// src/page/welcome/HeightScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeightScreen = ({ navigation }) => {
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!height || parseFloat(height) <= 0) {
      setError("Please enter a valid height");
      return;
    }
    try {
      await AsyncStorage.setItem("height", height);
      navigation.navigate("WeightScreen");
    } catch (err) {
      console.error("Error saving height:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your height?</Text>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={(text) => {
          setHeight(text);
          setError("");
        }}
        keyboardType="numeric"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 30,
    textAlign: "center",
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
  error: { color: "#D32F2F", fontSize: 14, marginBottom: 10 },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default HeightScreen;
