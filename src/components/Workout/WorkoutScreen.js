// src/components/Workout/WorkoutScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView
import { useWorkout } from "../../context/WorkoutProvider";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../header/CustomHeader";
import Icon from "react-native-vector-icons/MaterialIcons";

const WorkoutScreen = () => {
  const { workouts } = useWorkout();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredWorkouts(workouts);
    } else {
      const results = workouts.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredWorkouts(results);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredWorkouts(workouts);
  };

  const renderWorkout = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => navigation.navigate("WorkoutDetail", { workout: item })}
    >
      <Text style={styles.workoutName}>{item.name}</Text>
      <Text style={styles.workoutDetail}>Duration: {item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <CustomHeader
        title="Workouts"
        navigation={navigation}
        showBackButton={false}
        onRightPress={() => {}}
      />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workouts found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#212121",
  },
  clearButton: {
    padding: 5,
  },
  workoutCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  workoutDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default WorkoutScreen;
