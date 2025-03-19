import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomHeader = ({ navigation, scene, previous }) => {
  if (!scene || !scene.descriptor) return null;

  const { options } = scene.descriptor;
  const title = options.title ?? options.headerTitle ?? "Fitness App";

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() =>
          previous ? navigation.goBack() : navigation.navigate("WorkoutScreen")
        }
        style={styles.headerIcon}
      >
        <Icon
          name={previous ? "arrow-back" : "home"}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("SearchScreen")}
        style={styles.headerIcon}
      >
        <Icon name="search" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  headerIcon: { padding: 5 },
});

export default CustomHeader;
