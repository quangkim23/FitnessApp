// src/components/Workout/FavoritesScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useWorkout } from "../../context/WorkoutProvider";

const FavoritesScreen = ({ navigation }) => {
  const { favorites } = useWorkout();

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => navigation.navigate("WorkoutDetail", { workout: item })}
    >
      <Text style={styles.favoriteName}>{item.name || "Unnamed Workout"}</Text>
      <Text style={styles.favoriteDuration}>{item.duration || "N/A"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Workouts</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyMessage}>No favorites yet!</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  list: { paddingBottom: 20 },
  favoriteCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteName: { fontSize: 16, fontWeight: "500", color: "#212121" },
  favoriteDuration: { fontSize: 14, color: "#666" },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default FavoritesScreen;
