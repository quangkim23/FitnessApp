// src/components/header/CustomHeader.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomHeader = ({
  title,
  navigation,
  showBackButton = true,
  rightIcon = null,
  onRightPress = null,
}) => {
  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} /> // Placeholder to maintain layout
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Icon name={rightIcon} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButton} /> // Placeholder to maintain layout
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FF6F61", // Coral theme
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  rightButton: {
    padding: 5,
  },
});

export default CustomHeader;
