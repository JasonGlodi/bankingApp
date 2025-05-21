import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo vector-icons
import { useNavigation } from "expo-router";

/**
 * A reusable header component for React Native apps
 *
 * @param {string} title - The title to display in the header
 * @param {boolean} showBack - Whether to show the back button
 * @param {function} onBackPress - Function to call when the back button is pressed
 * @param {object} customStyles - Optional custom styles to override defaults
 * @param {ReactNode} rightComponent - Optional component to display on the right side
 * @param {boolean} showNotification - Whether to show the notification icon
 * @param {Array} notifications - Array of notification objects
 * @param {function} onNotificationPress - Function to call when a notification is pressed
 */

const Header = ({
  title,
  showBack = false,
  onBackPress = () => {},
  customStyles = {},
  rightComponent,
  showNotification = true,
  notifications = [],
  onNotificationPress = () => {},
}) => {
  const navigation = useNavigation();
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleNotificationMenu = () => {
    if (showNotificationMenu) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowNotificationMenu(false);
      });
    } else {
      setShowNotificationMenu(true);
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Notification count badge
  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => {
        onNotificationPress(item);
        toggleNotificationMenu();
      }}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.header, customStyles.header]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, customStyles.title]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {showNotification ? (
          <View>
            <TouchableOpacity
              style={styles.notificationIcon}
              onPress={toggleNotificationMenu}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="notifications-outline" size={24} color="#000" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          rightComponent
        )}
      </View>

      {/* Notification Dropdown */}
      {showNotificationMenu && (
        <Animated.View
          style={[styles.notificationDropdown, { opacity: fadeAnim }]}
        >
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationHeaderText}>Notifications</Text>
            {notifications.length > 0 && (
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.markAllRead}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </View>

          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyNotification}>
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color="#999"
              />
              <Text style={styles.emptyNotificationText}>
                No notifications yet
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Backdrop for closing dropdown when clicking outside */}
      {showNotificationMenu && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={toggleNotificationMenu}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 16,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 10,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  backButton: {
    padding: 4,
  },
  notificationIcon: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -3,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
  notificationDropdown: {
    position: "absolute",
    top: 56,
    right: 10,
    backgroundColor: "#fff",
    width: 300,
    maxHeight: 400,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationHeaderText: {
    fontWeight: "600",
    fontSize: 16,
  },
  markAllRead: {
    color: "#2196F3",
    fontSize: 12,
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  unreadNotification: {
    backgroundColor: "#f0f8ff",
  },
  notificationContent: {
    gap: 4,
  },
  notificationTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  notificationBody: {
    fontSize: 13,
    color: "#666",
  },
  notificationTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 3,
  },
  emptyNotification: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyNotificationText: {
    marginTop: 8,
    color: "#999",
  },
  notificationList: {
    maxHeight: 350,
  },
  backdrop: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    bottom: -1000, // Make it long enough to cover the screen
    backgroundColor: "transparent",
    zIndex: 999,
  },
});

export default Header;
