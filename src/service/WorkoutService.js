// src/service/WorkoutService.js
import axios from "axios";

const API_URL = "http://192.168.0.101:9999";

export const fetchWorkouts = async () => {
  try {
    const response = await axios.get(`${API_URL}/workouts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
};

export const fetchExercises = async () => {
  try {
    const response = await axios.get(`${API_URL}/exercises`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

export const fetchWorkoutExercises = async (workoutId) => {
  try {
    const [workoutExercises, exercises] = await Promise.all([
      axios.get(`${API_URL}/workout_exercises?workout_id=${workoutId}`),
      axios.get(`${API_URL}/exercises`),
    ]);
    const workoutExerciseData = workoutExercises.data;
    const exerciseData = exercises.data;
    return workoutExerciseData.map((we) => {
      const exercise = exerciseData.find((ex) => ex.id === we.exercise_id);
      return { ...we, exercise };
    });
  } catch (error) {
    console.error("Error fetching workout exercises:", error);
    return [];
  }
};

export const fetchLevels = async () => {
  try {
    const response = await axios.get(`${API_URL}/levels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching levels:", error);
    return [];
  }
};

export const fetchLevelExercises = async (levelId) => {
  try {
    const response = await axios.get(
      `${API_URL}/level_exercises?level_id=${levelId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching level exercises:", error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const saveUserData = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};
