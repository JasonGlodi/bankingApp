import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 * A reusable bottom navigation bar that works with Expo Router
 * @returns {JSX.Element} - Navigation bar component
 */
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items with their routes and icons
  const navItems = [
    {
      label: "Home",
      route: "/home",
      icon: (isActive) => (
        <Ionicons name="home" size={22} color={isActive ? "#007AFF" : "#888"} />
      ),
    },
    {
      label: "Banking",
      route: "/banking",
      icon: (isActive) => (
        <Ionicons
          name="cash-outline"
          size={22}
          color={isActive ? "#007AFF" : "#888"}
        />
      ),
    },
    {
      label: "Transfers",
      route: "/transfers",
      icon: (isActive) => (
        <Ionicons
          name="swap-horizontal"
          size={22}
          color={isActive ? "#007AFF" : "#888"}
        />
      ),
    },
    {
      label: "Profile",
      route: "/profile",
      icon: (isActive) => (
        <Ionicons
          name="person"
          size={22}
          color={isActive ? "#007AFF" : "#888"}
        />
      ),
    },
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item, index) => {
        // Check if this route is active
        const isActive =
          (item.route === "/" && pathname === "/") ||
          (item.route !== "/" && pathname.startsWith(item.route));

        return (
          <TouchableOpacity
            key={index}
            style={[styles.navButton, isActive && styles.activeNavButton]}
            onPress={() => router.push(item.route)}
          >
            {item.icon && item.icon(isActive)}
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10, // Add padding for iOS home indicator
  },
  navButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  activeNavButton: {
    backgroundColor: "#f8f8f8",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#888",
  },
  activeNavText: {
    color: "#007AFF",
  },
});

export default Navbar;
