import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Header from "../components/header";
import Navbar from "../components/Navbar";

const MenuItem = ({ title, subtitle, href }) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <View style={styles.menuItemContent}>
          <View style={styles.textContainer}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          </View>
          <View style={styles.imagePlaceholder}>
            {/* Image placeholder - you would replace this with your actual images */}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default function BankingScreen() {
  const menuItems = [
    {
      id: "branch",
      title: "Branch",
      subtitle: "Search for branch",
      href: "/banking/branch",
    },
    {
      id: "interest",
      title: "Interest rate",
      subtitle: "Search for interest rate",
      href: "/banking/interest-rate",
    },
    {
      id: "exchangeRate",
      title: "Exchange rate",
      subtitle: "Search for exchange rate",
      href: "/banking/exchange-rate",
    },
    {
      id: "exchange",
      title: "Exchange",
      subtitle: "Exchange amount of money",
      href: "/banking/exchange",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header title="Banking Services" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            href={item.href}
          />
        ))}
      </ScrollView>

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
  scrollContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#9e9e9e",
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  navbarSpacer: {
    height: 80, // Adjust based on navbar height
  },
});
