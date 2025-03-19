// src/components/Workout/WorkoutDetail.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe"; // Import YouTube player
import { useWorkout } from "../../context/WorkoutProvider";
import { fetchWorkoutExercises } from "../../service/WorkoutService";

const { width, height } = Dimensions.get("window");

const WorkoutDetail = ({ route, navigation }) => {
  const { workout } = route.params;
  const { favorites, addToFavorites, removeFromFavorites } = useWorkout();
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isFavorite = favorites.some((item) => item.id === workout.id);

  useEffect(() => {
    const loadWorkoutExercises = async () => {
      const exercises = await fetchWorkoutExercises(workout.id);
      setWorkoutExercises(exercises);
    };
    loadWorkoutExercises();
  }, [workout.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(workout.id);
    } else {
      addToFavorites(workout);
    }
  };

  // Function to extract YouTube video ID from URL
  const extractVideoId = (url) => {
    if (!url) return null;
    try {
      // Handle different YouTube URL formats
      const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  };

  const playVideo = (videoUrl) => {
    if (!videoUrl) {
      Alert.alert("Error", "No video available for this exercise.");
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      Alert.alert(
        "Invalid Video URL",
        "The video URL is not a valid YouTube link. Please contact support."
      );
      return;
    }

    setSelectedVideoId(videoId);
    setVideoError(false); // Reset error state
    setModalVisible(true);
  };

  const renderExercise = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => playVideo(item.exercise?.video_urls?.[0])}
      disabled={!item.exercise?.video_urls?.length}
    >
      <Text style={styles.exerciseName}>
        {item.exercise?.name || "Unknown Exercise"}
      </Text>
      <Text style={styles.exerciseDetails}>
        {item.sets} sets x {item.reps} reps
      </Text>
      <Text style={styles.exerciseDescription}>
        {item.exercise?.description || "No description available."}
      </Text>
      {item.exercise?.video_urls?.length ? (
        <Text style={styles.watchVideoText}>Tap to watch video</Text>
      ) : (
        <Text style={styles.noVideoText}>No video available</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name || "Unnamed Workout"}</Text>
      <Text style={styles.detail}>Duration: {workout.duration || "N/A"}</Text>
      <Text style={styles.description}>
        {workout.notes || "No notes available."}
      </Text>

      <Text style={styles.sectionTitle}>Exercises</Text>
      <FlatList
        data={workoutExercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.exerciseList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No exercises found</Text>
        }
        nestedScrollEnabled={true} // Cho phép cuộn bên trong ScrollView
      />

      <TouchableOpacity style={styles.button} onPress={toggleFavorite}>
        <Text style={styles.buttonText}>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#388E3C" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Workouts</Text>
      </TouchableOpacity>

      {/* Video Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLoading && <ActivityIndicator size="large" color="#4CAF50" />}
            {videoError ? (
              <Text style={styles.errorText}>
                Failed to load video. Please try again or contact support.
              </Text>
            ) : (
              selectedVideoId && (
                <YoutubePlayer
                  height={height * 0.4}
                  width={width * 0.8}
                  videoId={selectedVideoId}
                  play={true}
                  onReady={() => setIsLoading(false)}
                  onError={(error) => {
                    setIsLoading(false);
                    setVideoError(true);
                    Alert.alert(
                      "Video Error",
                      "Failed to load YouTube video. Please try again or contact support."
                    );
                    console.error("YouTube video error:", error);
                  }}
                  onChangeState={(event) => {
                    if (event === "buffering") setIsLoading(true);
                    if (event === "playing" || event === "paused")
                      setIsLoading(false);
                  }}
                />
              )
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 10,
  },
  detail: { fontSize: 16, color: "#666", marginBottom: 10 },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    marginTop: 20,
    marginBottom: 10,
  },
  exerciseList: { paddingBottom: 20, width: "100%" },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  exerciseName: { fontSize: 16, fontWeight: "500", color: "#212121" },
  exerciseDetails: { fontSize: 14, color: "#666", marginVertical: 5 },
  exerciseDescription: { fontSize: 12, color: "#666" },
  watchVideoText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  noVideoText: { fontSize: 12, color: "#D32F2F", marginTop: 5 },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  closeButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});

export default WorkoutDetail;
