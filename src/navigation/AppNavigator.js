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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const LoadingScreen = ({ reloadApp }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
    <Text style={styles.loadingText}>Getting ready...</Text>
    <Button title="Reload App" onPress={reloadApp} color="#4CAF50" />
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
          case "Search":
            iconName = "search";
            break;
          case "Favorites":
            iconName = "favorite";
            break;
          case "Profile":
            iconName = "person";
            break;
          case "Settings":
            iconName = "settings";
            break;
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: { height: 60, paddingBottom: 10 },
    })}
  >
    <Tab.Screen name="Workout" component={WorkoutScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export const AppNavigator = ({ initialRoute }) => (
  <Stack.Navigator initialRouteName={initialRoute}>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="GenderScreen" component={GenderScreen} />
    <Stack.Screen name="HeightScreen" component={HeightScreen} />
    <Stack.Screen name="WeightScreen" component={WeightScreen} />
    <Stack.Screen name="GoalScreen" component={GoalScreen} />
    <Stack.Screen name="FitnessLevelScreen" component={FitnessLevelScreen} />
    <Stack.Screen
      name="ExercisePreferenceScreen"
      component={ExercisePreferenceScreen}
    />
    <Stack.Screen
      name="ExerciseFrequencyScreen"
      component={ExerciseFrequencyScreen}
    />
    <Stack.Screen name="BMICalculatorScreen" component={BMICalculatorScreen} />
    <Stack.Screen name="RewardScreen" component={RewardScreen} />
    <Stack.Screen name="FinalScreen" component={FinalScreen} />

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
    color: "#4CAF50",
    fontWeight: "500",
  },
});
