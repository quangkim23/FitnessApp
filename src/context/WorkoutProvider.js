// src/context/WorkoutProvider.js
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
    const workoutData = await fetchWorkouts();
    setWorkouts(workoutData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchWorkoutsData();
      const userData = await fetchUsers();
      if (userData.length > 0) setUser(userData[0]); // Assuming single user for now
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
      const updatedUser = await saveUserData(userData);
      setUser(updatedUser);
      await AsyncStorage.setItem("userInfoCompleted", "true");
    } catch (error) {
      console.error("Error updating user profile:", error);
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

export const useWorkout = () => useContext(WorkoutContext);

export default WorkoutProvider;
