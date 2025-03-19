import React from "react";
import { View, Text, StyleSheet, Switch, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const navigation = useNavigation();

  const resetApp = async () => {
    Alert.alert(
      "Reset App",
      "Are you sure you want to reset the app? This will erase all data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // Xóa toàn bộ dữ liệu
              navigation.replace("Welcome"); // Điều hướng về màn hình Welcome
            } catch (error) {
              console.error("Error resetting app:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          onValueChange={setNotificationsEnabled}
          value={notificationsEnabled}
        />
      </View>

      <Text style={styles.settingText}>Language: English (Future Feature)</Text>

      {/* Nút Reset */}
      <View style={styles.resetContainer}>
        <Button title="Reset App" onPress={resetApp} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    fontSize: 16,
    color: "#212121",
  },
  resetContainer: {
    marginTop: 30,
    alignItems: "center",
  },
});

export default SettingsScreen;
