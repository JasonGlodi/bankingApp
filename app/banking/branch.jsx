import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "../components/header";
import Navbar from "../components/Navbar";

export default function BranchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Use the reusable Header component with back button */}
      <Header title="Branch" showBack={true} />

      <View style={styles.content}>
        <Text style={styles.contentText}>Branch search content goes here</Text>
      </View>

      {/* Add bottom padding to account for navbar */}
      <View style={styles.navbarSpacer} />

      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    color: "#666",
  },
  navbarSpacer: {
    height: 80, // Adjust based on navbar height
  },
});
