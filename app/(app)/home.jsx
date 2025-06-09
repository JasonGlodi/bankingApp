import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";

// Import navbar with lowercase to match the filename
import Navbar from "../components/Navbar";
import Header from "../components/header";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Home" />
      <View style={styles.contentContainer}>
        <Text style={styles.screenText}>Home Screen</Text>
        <Text style={styles.infoText}>
          This is the main screen of your banking app
        </Text>
      </View>

      {/* No need to pass navigation props with Expo Router */}
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60, // Make room for the navbar
  },
  screenText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});
