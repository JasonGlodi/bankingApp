import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

export default function BeneficiaryScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        title="Beneficiary"
        showBack={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.content}>
        <Text style={styles.contentText}>
          Beneficiary information goes here
        </Text>
        <Text style={styles.subText}>
          View current Beneficiary for various products
        </Text>
      </View>

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
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#888",
  },
  navbarSpacer: {
    height: 80, // Adjust based on navbar height
  },
});
