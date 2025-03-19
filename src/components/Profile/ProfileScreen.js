import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useWorkout } from "../../context/WorkoutProvider";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../header/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { user, updateUserProfile } = useWorkout(); // Changed updateUser to updateUserProfile
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    gender: user?.gender || "male",
    height: user?.height?.toString() || "",
    weight: user?.weight?.toString() || "",
    goal: user?.goal || "",
    exercise_preference: user?.exercise_preference || "mat",
    exercise_frequency: user?.exercise_frequency?.toString() || "",
    fitness_level: user?.fitness_level || "beginner",
    reward: user?.reward || "new_clothes",
    bmi: user?.bmi || "",
    bmi_category: user?.bmi_category || "",
  });

  // Sync form data with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        gender: user.gender || "male",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        goal: user.goal || "",
        exercise_preference: user.exercise_preference || "mat",
        exercise_frequency: user.exercise_frequency?.toString() || "",
        fitness_level: user.fitness_level || "beginner",
        reward: user.reward || "new_clothes",
        bmi: user.bmi || "",
        bmi_category: user.bmi_category || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    let bmi_category = "";
    if (bmi < 18.5) bmi_category = "underweight";
    else if (bmi < 25) bmi_category = "normal";
    else if (bmi < 30) bmi_category = "overweight";
    else bmi_category = "obese";
    return { bmi, bmi_category };
  };

  const handleSave = async () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const exercise_frequency = parseInt(formData.exercise_frequency);

    // Validation
    if (!weight || !height || !formData.goal || !exercise_frequency) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Weight, Height, Goal, Exercise Frequency)."
      );
      return;
    }
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      Alert.alert("Error", "Weight and Height must be valid positive numbers.");
      return;
    }
    if (isNaN(exercise_frequency) || exercise_frequency <= 0) {
      Alert.alert(
        "Error",
        "Exercise Frequency must be a valid positive number."
      );
      return;
    }

    // Calculate BMI
    const { bmi, bmi_category } = calculateBMI(weight, height);

    // Prepare updated user data
    const updatedUser = {
      ...user,
      gender: formData.gender,
      height,
      weight,
      goal: formData.goal,
      exercise_preference: formData.exercise_preference,
      exercise_frequency,
      fitness_level: formData.fitness_level,
      reward: formData.reward,
      bmi,
      bmi_category,
    };

    try {
      await updateUserProfile(updatedUser); // Use updateUserProfile
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Profile"
        navigation={navigation}
        showBackButton={false}
        rightIcon="settings"
        onRightPress={() => navigation.navigate("Settings")}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {user ? (
            <View style={styles.profileCard}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/100", // Placeholder as no avatar in DB
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>User ID: {user.id}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Gender:</Text>
                  {isEditing ? (
                    <Picker
                      selectedValue={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Male" value="male" />
                      <Picker.Item label="Female" value="female" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  ) : (
                    <Text style={styles.detail}>{formData.gender}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Height:</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputDetail}
                      value={formData.height}
                      onChangeText={(value) =>
                        handleInputChange("height", value)
                      }
                      placeholder="Height (cm)"
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={styles.detail}>{formData.height} cm</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight:</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputDetail}
                      value={formData.weight}
                      onChangeText={(value) =>
                        handleInputChange("weight", value)
                      }
                      placeholder="Weight (kg)"
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={styles.detail}>{formData.weight} kg</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Goal:</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputDetail}
                      value={formData.goal}
                      onChangeText={(value) => handleInputChange("goal", value)}
                      placeholder="Enter your goal"
                    />
                  ) : (
                    <Text style={styles.detail}>{formData.goal}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Exercise Preference:</Text>
                  {isEditing ? (
                    <Picker
                      selectedValue={formData.exercise_preference}
                      onValueChange={(value) =>
                        handleInputChange("exercise_preference", value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Mat" value="mat" />
                      <Picker.Item label="Bed" value="bed" />
                    </Picker>
                  ) : (
                    <Text style={styles.detail}>
                      {formData.exercise_preference}
                    </Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Exercise Frequency:</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputDetail}
                      value={formData.exercise_frequency}
                      onChangeText={(value) =>
                        handleInputChange("exercise_frequency", value)
                      }
                      placeholder="Days per week"
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={styles.detail}>
                      {formData.exercise_frequency} days/week
                    </Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fitness Level:</Text>
                  {isEditing ? (
                    <Picker
                      selectedValue={formData.fitness_level}
                      onValueChange={(value) =>
                        handleInputChange("fitness_level", value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Beginner" value="beginner" />
                      <Picker.Item label="Intermediate" value="intermediate" />
                      <Picker.Item label="Advanced" value="advanced" />
                    </Picker>
                  ) : (
                    <Text style={styles.detail}>{formData.fitness_level}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reward:</Text>
                  {isEditing ? (
                    <Picker
                      selectedValue={formData.reward}
                      onValueChange={(value) =>
                        handleInputChange("reward", value)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="New Clothes" value="new_clothes" />
                      <Picker.Item
                        label="Delicious Meal"
                        value="delicious_meal"
                      />
                    </Picker>
                  ) : (
                    <Text style={styles.detail}>{formData.reward}</Text>
                  )}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>BMI:</Text>
                  <Text style={styles.detail}>
                    {formData.bmi} ({formData.bmi_category})
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={toggleEditMode}>
                <Text style={styles.buttonText}>
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Text>
              </TouchableOpacity>
              {isEditing && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setFormData({
                      gender: user.gender || "male",
                      height: user.height?.toString() || "",
                      weight: user.weight?.toString() || "",
                      goal: user.goal || "",
                      exercise_preference: user.exercise_preference || "mat",
                      exercise_frequency:
                        user.exercise_frequency?.toString() || "",
                      fitness_level: user.fitness_level || "beginner",
                      reward: user.reward || "new_clothes",
                      bmi: user.bmi || "",
                      bmi_category: user.bmi_category || "",
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>No profile data available</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles remain the same as in your original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FF6F61",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 15,
  },
  infoContainer: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  detail: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  inputDetail: {
    fontSize: 16,
    color: "#212121",
    flex: 1,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 5,
  },
  picker: {
    flex: 1,
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    elevation: 2,
    width: "80%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
