// src/navigation/AppNavigator.js
import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import Screens
import WelcomeScreen from "../page/welcome/WelcomeScreen";
import WorkoutScreen from "../components/Workout/WorkoutScreen";
import SearchScreen from "../components/Search/SearchScreen";
import FavoritesScreen from "../components/Workout/FavoritesScreen";
import ProfileScreen from "../components/Profile/ProfileScreen";
import SettingsScreen from "../components/Setting/SettingScreen";
import WorkoutDetail from "../components/Workout/WorkoutDetail";
import GenderScreen from "../page/welcome/GenderScreen";
import HeightScreen from "../page/welcome/HeightScreen";
import WeightScreen from "../page/welcome/WeightScreen";
import GoalScreen from "../page/welcome/GoalScreen";
import FitnessLevelScreen from "../page/welcome/FitnessLevelScreen";
import ExercisePreferenceScreen from "../page/welcome/ExercisePreferenceScreen";
import ExerciseFrequencyScreen from "../page/welcome/ExerciseFrequencyScreen";
import BMICalculatorScreen from "../page/welcome/BMICalculatorScreen";
import RewardScreen from "../page/welcome/RewardScreen";
import FinalScreen from "../page/welcome/FinalScreen";
// New Screens
import ProgressScreen from "../components/Progress/ProgressScreen";
import DietScreen from "../components/Diet/DietScreen";
import AchievementsScreen from "../components/Achievements/AchievementsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const LoadingScreen = ({ reloadApp }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FF6F61" />
    <Text style={styles.loadingText}>Getting ready...</Text>
    <Button title="Reload App" onPress={reloadApp} color="#FF6F61" />
  </View>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case "Workout":
            iconName = "fitness-center";
            break;
          case "Progress":
            iconName = "trending-up";
            break;
          case "Diet":
            iconName = "restaurant";
            break;
          case "Achievements":
            iconName = "star";
            break;
          case "Profile":
            iconName = "person";
            break;
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#FF6F61", // Coral color for weight loss theme
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
    })}
  >
    <Tab.Screen
      name="Progress"
      component={ProgressScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Workout"
      component={WorkoutScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Diet"
      component={DietScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Achievements"
      component={AchievementsScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export const AppNavigator = ({ initialRoute }) => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{
      headerStyle: {
        backgroundColor: "#FF6F61",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: { fontWeight: "600", fontSize: 18 },
      cardStyle: { backgroundColor: "#F5F5F5" },
    }}
  >
    {/* Onboarding Flow */}
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="GenderScreen"
      component={GenderScreen}
      options={{ title: "Your Gender" }}
    />
    <Stack.Screen
      name="HeightScreen"
      component={HeightScreen}
      options={{ title: "Your Height" }}
    />
    <Stack.Screen
      name="WeightScreen"
      component={WeightScreen}
      options={{ title: "Your Weight" }}
    />
    <Stack.Screen
      name="GoalScreen"
      component={GoalScreen}
      options={{ title: "Your Goal" }}
    />
    <Stack.Screen
      name="FitnessLevelScreen"
      component={FitnessLevelScreen}
      options={{ title: "Fitness Level" }}
    />
    <Stack.Screen
      name="ExercisePreferenceScreen"
      component={ExercisePreferenceScreen}
      options={{ title: "Exercise Preference" }}
    />
    <Stack.Screen
      name="ExerciseFrequencyScreen"
      component={ExerciseFrequencyScreen}
      options={{ title: "Exercise Frequency" }}
    />
    <Stack.Screen
      name="BMICalculatorScreen"
      component={BMICalculatorScreen}
      options={{ title: "BMI Calculator" }}
    />
    <Stack.Screen
      name="RewardScreen"
      component={RewardScreen}
      options={{ title: "Your Reward" }}
    />
    <Stack.Screen
      name="FinalScreen"
      component={FinalScreen}
      options={{ title: "Setup Complete", headerLeft: () => null }}
    />

    {/* Main App Flow */}
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="WorkoutDetail"
      component={WorkoutDetail}
      options={{ title: "Workout Details" }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ title: "Search Workouts" }}
    />
    <Stack.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{ title: "" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "" }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FF6F61",
    fontWeight: "500",
  },
});
