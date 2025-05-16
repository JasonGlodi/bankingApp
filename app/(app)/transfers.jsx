import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/header";

export default function Transfers() {
  return (
    <View style={styles.container}>
      <Header title="Transfers" />
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Transfers</Text>
        <Text style={styles.infoText}>
          This is where you'll manage your money transfers. You can create new
          transfers, view pending transfers, and see your transfer history.
        </Text>

        {/* Placeholder for transfer functionality */}
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            Transfer functionality coming soon!
          </Text>
        </View>
      </View>

      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60, // Make room for the navbar
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    lineHeight: 22,
  },
  placeholderBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
  },
});
