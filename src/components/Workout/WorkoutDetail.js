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
  Image,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
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
      setIsLoading(true);
      try {
        const exercises = await fetchWorkoutExercises(workout.id);
        setWorkoutExercises(exercises);
      } catch (error) {
        console.error("Error loading workout exercises:", error);
        Alert.alert("Error", "Failed to load exercises. Please try again.");
      } finally {
        setIsLoading(false);
      }
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

  const extractVideoId = (url) => {
    if (!url) return null;
    try {
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
      Alert.alert("Invalid Video URL", "The video URL is not valid.");
      return;
    }
    setSelectedVideoId(videoId);
    setVideoError(false);
    setModalVisible(true);
  };

  const calculateCaloriesBurned = (item) => {
    const caloriesPerRep = item.exercise?.caloriesPerRep || 0;
    const totalReps = item.sets * item.reps;
    return Math.round(caloriesPerRep * totalReps);
  };

  const totalCaloriesBurned = workoutExercises.reduce(
    (sum, item) => sum + calculateCaloriesBurned(item),
    0
  );

  const renderExercise = ({ item }) => {
    const caloriesBurned = calculateCaloriesBurned(item);
    return (
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => playVideo(item.exercise?.video_urls?.[0])}
        disabled={!item.exercise?.video_urls?.length}
      >
        <View style={styles.exerciseHeader}>
          {item.exercise?.image_urls?.[0] ? (
            <Image
              source={{ uri: item.exercise.image_urls[0] }}
              style={styles.thumbnail}
              resizeMode="cover"
              onError={(e) =>
                console.log("Image load error:", e.nativeEvent.error)
              }
            />
          ) : (
            <View style={styles.placeholderThumbnail}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>
              {item.exercise?.name || "Unknown Exercise"}
            </Text>
            <Text style={styles.exerciseDetails}>
              {item.sets} sets x {item.reps} reps
            </Text>
            <Text style={styles.caloriesText}>
              Calories Burned: {caloriesBurned} kcal
            </Text>
          </View>
        </View>
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name || "Unnamed Workout"}</Text>
        <Text style={styles.detail}>Duration: {workout.duration || "N/A"}</Text>
        <Text style={styles.detail}>
          Total Calories Burned: {totalCaloriesBurned} kcal
        </Text>
      </View>
      <Text style={styles.description}>
        {workout.notes || "No notes available."}
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FF6F61" style={styles.loader} />
      ) : (
        <FlatList
          data={workoutExercises}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.exerciseList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No exercises found</Text>
          }
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isFavorite && styles.favoriteButton]}
          onPress={toggleFavorite}
        >
          <Text style={styles.buttonText}>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.favoriteButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Workouts</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isLoading && <ActivityIndicator size="large" color="#FF6F61" />}
            {videoError ? (
              <Text style={styles.errorText}>
                Failed to load video. Please try again.
              </Text>
            ) : (
              selectedVideoId && (
                <YoutubePlayer
                  height={height * 0.4}
                  width={width * 0.85}
                  videoId={selectedVideoId}
                  play={true}
                  onReady={() => setIsLoading(false)}
                  onError={(error) => {
                    setIsLoading(false);
                    setVideoError(true);
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
    backgroundColor: "#F0F4F8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  exerciseList: { paddingBottom: 20 },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  placeholderThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  placeholderText: {
    fontSize: 12,
    color: "#777",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#FF6F61",
    marginTop: 5,
  },
  caloriesText: {
    fontSize: 14,
    color: "#FF6F61",
    marginTop: 5,
  },
  exerciseDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  watchVideoText: {
    fontSize: 12,
    color: "#1E88E5",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  noVideoText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#FF6F61",
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 5,
    elevation: 2,
  },
  favoriteButton: {
    backgroundColor: "#F06292",
  },
  backButton: {
    backgroundColor: "#388E3C",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
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
    marginTop: 15,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
});

export default WorkoutDetail;
