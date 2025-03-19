import axios from "axios";

const API_URL = "http://192.168.0.101:9999";

export const fetchWorkouts = async () => {
  try {
    const response = await axios.get(`${API_URL}/workouts`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching workouts:", error.message);
    return [];
  }
};

export const fetchExercises = async () => {
  try {
    const response = await axios.get(`${API_URL}/exercises`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching exercises:", error.message);
    return [];
  }
};

export const fetchWorkoutExercises = async (workoutId) => {
  try {
    const [workoutExercisesResp, exercisesResp] = await Promise.all([
      axios.get(`${API_URL}/workout_exercises?workout_id=${workoutId}`),
      axios.get(`${API_URL}/exercises`),
    ]);
    const workoutExercises = workoutExercisesResp.data || [];
    const exercises = exercisesResp.data || [];

    const detailedExercises = workoutExercises.map((we) => {
      const exercise = exercises.find(
        (ex) => String(ex.id) === String(we.exercise_id)
      ) || {
        name: "Unknown Exercise",
        description: "No description available",
        video_urls: [],
        image_urls: [],
      };
      console.log(
        `Mapping exercise_id: ${we.exercise_id}, Found exercise:`,
        exercise
      );
      return { ...we, exercise };
    });

    return detailedExercises;
  } catch (error) {
    console.error("Error fetching workout exercises:", error.message);
    return [];
  }
};

export const fetchLevels = async () => {
  try {
    const response = await axios.get(`${API_URL}/levels`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching levels:", error.message);
    return [];
  }
};

export const fetchLevelExercises = async (levelId) => {
  try {
    const response = await axios.get(
      `${API_URL}/level_exercises?level_id=${levelId}`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching level exercises:", error.message);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }
};

export const saveUserData = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error saving user data:", error.message);
    throw error;
  }
};
