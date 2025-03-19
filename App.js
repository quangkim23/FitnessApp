import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastAndroid from "react-native";
import { WorkoutProvider } from "./src/context/WorkoutProvider";
import { LoadingScreen, AppNavigator } from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Welcome");

  const reloadApp = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userInfoCompleted");
      setInitialRoute("Welcome");
      ToastAndroid.show("App reset successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error resetting app:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem(
          "userInfoCompleted"
        );
        if (onboardingComplete === "true") {
          setInitialRoute("Main");
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  if (isLoading) return <LoadingScreen reloadApp={reloadApp} />;

  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <NavigationContainer>
          <AppNavigator initialRoute={initialRoute} />
          <StatusBar style="light" backgroundColor="#4CAF50" />
        </NavigationContainer>
      </WorkoutProvider>
    </SafeAreaProvider>
  );
};

export default App;
