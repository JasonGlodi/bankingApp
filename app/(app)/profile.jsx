import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import Header from "../components/header";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalDropdown from "react-native-modal-dropdown";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showHistory, setShowHistory] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch user data from AsyncStorage or fallback API
  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setSelectedLanguage(parsedUser.languagePreference || "English");
      } else {
        // fallback: fetch from API (adjust URL and data accordingly)
        const response = await fetch("http://192.168.1.175:8000/balance");
        const data = await response.json();

        setUser(data);
        setSelectedLanguage(data.languagePreference || "English");

        await AsyncStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // fallback default user
      setUser({
        username: "Guest User",
        email: "guest@example.com",
        phone_number: null,
        createdAt: null,
        languagePreference: "English",
      });
      setSelectedLanguage("English");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    setLanguages([
      "English",
      "French",
      "Spanish",
      "German",
      "Chinese",
      "Arabic",
      "Hindi",
      "Portuguese",
      "Russian",
      "Japanese",
      "Korean",
      "Italian",
      "Dutch",
      "Swedish",
      "Turkish",
      "Vietnamese",
      "Polish",
    ]);
  }, []);

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  // Update user profile on server and locally
  const updateUserData = async (updatedData) => {
    try {
      setUpdating(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Session expired. Please login again");
      }

      const response = await axios.put(
        "http://192.168.1.175:8000/users",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      setSelectedLanguage(response.data.languagePreference || "English");
      await storeUserData(response.data);
      return true;
    } catch (error) {
      console.error("Failed to update user:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const [notification, setNotification] = useState("");
  const notificationOpacity = useState(new Animated.Value(0))[0];

  const showNotification = (message) => {
    setNotification(message);
    Animated.timing(notificationOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(notificationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const getInitials = (name) => {
    if (!name) return "US";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const handleLanguageChange = async (index, value) => {
    const selected = value || languages[index];
    setSelectedLanguage(selected);
    showNotification(`Language changed to ${selected}`);

    if (user) {
      const updated = await updateUserData({
        ...user,
        languagePreference: selected,
      });
      if (!updated) {
        setSelectedLanguage(user.languagePreference || "English");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout properly");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />

      {notification ? (
        <Animated.View
          style={[styles.notification, { opacity: notificationOpacity }]}
        >
          <Text style={styles.notificationText}>{notification}</Text>
        </Animated.View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{getInitials(user?.username)}</Text>
          </View>
          <Text style={styles.userName}>{user?.username || "User"}</Text>
          <Text style={styles.userHandle}>
            {user?.email || "user@example.com"}
          </Text>
          {user?.phone_number ? (
            <Text style={styles.userPhone}>{user.phone_number}</Text>
          ) : null}
          {user?.createdAt ? (
            <Text style={styles.userSince}>
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          ) : null}
        </View>

        {/* Sections */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowMyProfile(true)}
          >
            <View style={styles.iconContainer}>
              <Icon name="user" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowHistory(true)}
          >
            <View style={styles.iconContainer}>
              <Icon name="clock" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>Transaction History</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.optionsContainer}>
          <View style={styles.optionItem}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="face-recognition"
                size={20}
                color="#3b82f6"
              />
            </View>
            <Text style={styles.optionText}>Face ID</Text>
            <Switch
              value={faceIdEnabled}
              onValueChange={() => setFaceIdEnabled(!faceIdEnabled)}
              style={styles.switch}
              trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.iconContainer}>
              <Icon name="lock" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.iconContainer}>
              <Icon name="unlock" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.iconContainer}>
              <Icon name="bell" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <View
            style={[styles.optionItem, { justifyContent: "space-between" }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.iconContainer}>
                <Icon name="globe" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.optionText}>Languages</Text>
            </View>

            {updating ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <ModalDropdown
                options={languages}
                defaultValue={selectedLanguage}
                onSelect={handleLanguageChange}
                renderButtonText={(rowData) => rowData}
                textStyle={styles.dropdownText}
                dropdownTextStyle={styles.dropdownItem}
                dropdownStyle={styles.dropdownList}
                accessible={true}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowHelp(true)}
          >
            <View style={styles.iconContainer}>
              <Icon name="help-circle" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowTerms(true)}
          >
            <View style={styles.iconContainer}>
              <Icon name="file-text" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.optionText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <Text style={styles.logoutText}>Log Out</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}

      <Modal visible={showMyProfile} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My Profile</Text>
            <Text style={styles.modalText}>
              Name: {user?.username || "User"}
            </Text>
            <Text style={styles.modalText}>
              Email: {user?.email || "user@example.com"}
            </Text>
            <Text style={styles.modalText}>
              Phone: {user?.phone_number || "Not provided"}
            </Text>
            <Text style={styles.modalText}>
              Member since:{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </Text>
            <Pressable onPress={() => setShowMyProfile(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showHistory} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Transaction History</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {user?.transactions?.length > 0 ? (
                user.transactions.map((txn, index) => (
                  <Text key={index} style={styles.modalText}>
                    • {new Date(txn.date).toLocaleDateString()} -{" "}
                    {txn.description} ({txn.amount})
                  </Text>
                ))
              ) : (
                <Text style={styles.modalText}>No transactions found</Text>
              )}
            </ScrollView>
            <Pressable onPress={() => setShowHistory(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showTerms} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              <Text style={styles.modalText}>
                Welcome to our service. By using our services, you agree to
                comply with our terms...
              </Text>
            </ScrollView>
            <Pressable onPress={() => setShowTerms(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showHelp} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <Text style={styles.modalText}>
              Email us at support@example.com or call +1 234 567 890
            </Text>
            <Pressable onPress={() => setShowHelp(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#3b82f6",
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#bfdbfe",
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1e40af",
    marginTop: 5,
  },
  userHandle: {
    fontSize: 16,
    color: "#60a5fa",
    marginTop: 5,
  },
  userPhone: {
    fontSize: 16,
    color: "#3b82f6",
    marginTop: 5,
  },
  userSince: {
    fontSize: 14,
    color: "#1e40af",
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: 5,
    marginTop: 20,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e7ff",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ff",
  },
  iconContainer: {
    backgroundColor: "#e0e7ff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#1e40af",
    flex: 1,
  },
  switch: {
    marginLeft: "auto",
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "bold",
  },
  dropdownText: {
    fontSize: 14,
    color: "#3b82f6",
    paddingHorizontal: 10,
  },
  dropdownItem: {
    fontSize: 14,
    padding: 10,
    color: "#1e40af",
  },
  dropdownList: {
    width: 150,
    marginLeft: -20,
    backgroundColor: "#fff",
    borderColor: "#e0e7ff",
    borderWidth: 1,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e40af",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#1e40af",
  },
  modalClose: {
    color: "#3b82f6",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  notification: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#3b82f6",
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 1000,
    alignItems: "center",
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  notificationText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
