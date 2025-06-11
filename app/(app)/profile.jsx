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
} from "react-native";
import Navbar from "../components/Navbar";
import Header from "../components/header";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalDropdown from "react-native-modal-dropdown";

export default function Profile() {
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showHistory, setShowHistory] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false); // Modal for My Profile
  const [languages, setLanguages] = useState([]);

  // Notification message for language change
  const [notification, setNotification] = useState("");
  const notificationOpacity = useState(new Animated.Value(0))[0];

  const defaultLanguages = [
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
  ];

  useEffect(() => {
    setLanguages(defaultLanguages);
  }, []);

  // Show notification with fade in/out animation
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

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />

      {/* Notification message overlay */}
      {notification ? (
        <Animated.View
          style={[styles.notification, { opacity: notificationOpacity }]}
        >
          <Text style={styles.notificationText}>{notification}</Text>
        </Animated.View>
      ) : null}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
          <Text style={styles.userName}>Ngong Noee</Text>
          <Text style={styles.userHandle}>noeeyvanna14@gmail.com</Text>
        </View>

        {/* Personal Information Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.optionsContainer}>
          {/* "My Profile" button opens modal with profile info */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowMyProfile(true)}
          >
            <Icon name="user" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowHistory(true)}
          >
            <Icon name="clock" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>Transaction History</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.optionsContainer}>
          <View style={styles.optionItem}>
            <MaterialCommunityIcons
              name="face-recognition"
              size={20}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Face ID</Text>
            <Switch
              value={faceIdEnabled}
              onValueChange={() => setFaceIdEnabled(!faceIdEnabled)}
              style={styles.switch}
            />
          </View>

          <TouchableOpacity style={styles.optionItem}>
            <Icon name="lock" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icon name="unlock" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        {/* General Section */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="bell" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          {/* Language selector */}
          <View
            style={[styles.optionItem, { justifyContent: "space-between" }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="globe" size={20} style={styles.optionIcon} />
              <Text style={styles.optionText}>Languages</Text>
            </View>

            <ModalDropdown
              options={languages}
              defaultValue={selectedLanguage}
              onSelect={(index, value) => {
                const selected = value || languages[index];
                setSelectedLanguage(selected);
                showNotification(`Language changed to ${selected}`);
              }}
              renderButtonText={(rowData) => rowData} // Ensures displayed text updates
              textStyle={styles.dropdownText}
              dropdownTextStyle={styles.dropdownItem}
              dropdownStyle={styles.dropdownList}
              accessible={true}
            />
          </View>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowHelp(true)}
          >
            <Icon name="help-circle" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setShowTerms(true)}
          >
            <Icon name="file-text" size={20} style={styles.optionIcon} />
            <Text style={styles.optionText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: My Profile */}
      <Modal visible={showMyProfile} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My Profile</Text>
            <Text style={styles.modalText}>Name: Ngong Noee</Text>
            <Text style={styles.modalText}>Email: noeeyvanna14@gmail.com</Text>
            <Text style={styles.modalText}>Phone: +237 612 345 678</Text>
            <Text style={styles.modalText}>Member since: Jan 2022</Text>
            <Pressable onPress={() => setShowMyProfile(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal: Transaction History */}
      <Modal visible={showHistory} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Transaction History</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              <Text>• Jan 01 - Sent $200 to John</Text>
              <Text>• Jan 03 - Received $150 from PayPal</Text>
              <Text>• Jan 10 - Paid $50 to Netflix</Text>
            </ScrollView>
            <Pressable onPress={() => setShowHistory(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal: Terms and Conditions */}
      <Modal visible={showTerms} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              <Text style={styles.modalText}>
                Welcome to SecureBank. By using our services, you agree to
                comply with our terms...
              </Text>
            </ScrollView>
            <Pressable onPress={() => setShowTerms(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal: Help & Support */}
      <Modal visible={showHelp} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <Text>
              Email us at support@securebank.com or call +237 620 123 456
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: { alignItems: "center", marginBottom: 30 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  userName: { fontSize: 22, fontWeight: "600" },
  userHandle: { fontSize: 16, color: "#999" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 5,
    marginTop: 20,
  },
  optionsContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionIcon: { marginRight: 15, color: "#333" },
  optionText: { fontSize: 16, color: "#333", flex: 1 },
  switch: { marginLeft: "auto" },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "bold",
  },
  dropdownText: {
    fontSize: 14,
    color: "#007AFF",
    paddingHorizontal: 10,
  },
  dropdownItem: {
    fontSize: 14,
    padding: 10,
  },
  dropdownList: {
    width: 150,
    marginLeft: -20,
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
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalClose: {
    color: "#007AFF",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  notification: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 1000,
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
// npm install react-native-modal-dropdown
//npm  install react-native-vector-icons
// npm install react-native-gesture-handler react-native-reanimated
// npm install react-native-safe-area-context
