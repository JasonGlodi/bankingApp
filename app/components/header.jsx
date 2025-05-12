import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
 */

const Header = ({
  title,
  showBack = false,
  onBackPress = () => {},
  customStyles = {},
  rightComponent,
}) => {
  const navigation = useNavigation();
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

      <View style={styles.rightContainer}>{rightComponent}</View>
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
});

export default Header;
