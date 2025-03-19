// src/components/Search/SearchScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Mock data, replace with API call

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Mock search logic - replace with real data from your API
    const results = [
      { id: "1", name: "Morning Routine", duration: "45 mins" },
      { id: "2", name: "Home Workout", duration: "60 mins" },
    ].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(results);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemDetail}>{item.duration}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search workouts..."
        value={searchQuery}
        onChangeText={handleSearch}
        autoFocus={true}
      />
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  item: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  itemDetail: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default SearchScreen;
