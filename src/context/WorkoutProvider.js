import React, { createContext, useState, useContext, useEffect } from "react";
import {
  fetchWorkouts,
  fetchUsers,
  saveUserData,
} from "../service/WorkoutService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);

  const fetchWorkoutsData = async () => {
    try {
      const workoutData = await fetchWorkouts();
      setWorkouts(workoutData);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await fetchUsers();
      if (userData.length > 0) {
        setUser(userData[0]); // Assuming single user for now
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchWorkoutsData(), fetchUserData()]);
    };
    loadInitialData();
  }, []);

  const addToFavorites = (workout) => {
    if (!favorites.find((item) => item.id === workout.id)) {
      setFavorites((prev) => [...prev, workout]);
    }
  };

  const removeFromFavorites = (workoutId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== workoutId));
  };

  const updateUserProfile = async (userData) => {
    try {
      // Ensure all required fields from the database are included
      const updatedUserData = {
        id: user?.id || userData.id, // Preserve the user ID
        gender: userData.gender,
        height: parseFloat(userData.height),
        weight: parseFloat(userData.weight),
        goal: userData.goal,
        exercise_preference: userData.exercise_preference,
        exercise_frequency: parseInt(userData.exercise_frequency),
        fitness_level: userData.fitness_level,
        reward: userData.reward,
        bmi: parseFloat(userData.bmi),
        bmi_category: userData.bmi_category,
      };

      const updatedUser = await saveUserData(updatedUserData);
      setUser(updatedUser); // Update the local state with the response
      await AsyncStorage.setItem("userInfoCompleted", "true");
      return updatedUser; // Return the updated user for potential use
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error; // Re-throw the error to be caught in the calling component
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        workouts,
        fetchWorkouts: fetchWorkoutsData,
        user,
        updateUserProfile,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

export default WorkoutProvider;
