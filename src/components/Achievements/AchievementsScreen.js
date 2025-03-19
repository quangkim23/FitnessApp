// src/components/Achievements/AchievementsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const storedAchievements = await AsyncStorage.getItem("achievements");
        if (storedAchievements) {
          setAchievements(JSON.parse(storedAchievements));
        } else {
          const defaultAchievements = [
            {
              id: "1",
              title: "First Workout",
              description: "Complete your first workout!",
              achieved: false,
            },
            {
              id: "2",
              title: "5 Days Streak",
              description: "Log meals for 5 consecutive days!",
              achieved: false,
            },
            {
              id: "3",
              title: "Weight Loss Milestone",
              description: "Lose 2 kg!",
              achieved: false,
            },
          ];
          setAchievements(defaultAchievements);
          await AsyncStorage.setItem(
            "achievements",
            JSON.stringify(defaultAchievements)
          );
        }
      } catch (error) {
        console.error("Error loading achievements:", error);
      }
    };
    loadAchievements();
  }, []);

  const renderAchievement = ({ item }) => (
    <View style={[styles.achievement, item.achieved && styles.achieved]}>
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Your Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No achievements yet.</Text>
        }
      />
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Daily Tip</Text>
        <Text style={styles.tipsText}>
          Drink at least 8 glasses of water today to stay hydrated!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
    marginBottom: 20,
  },
  achievement: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  achieved: {
    borderColor: "#FF6F61",
    borderWidth: 2,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  achievementDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  tipsContainer: {
    marginTop: 20,
    backgroundColor: "#FF6F61",
    padding: 15,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AchievementsScreen;
