import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Header from "../components/header";
import Navbar from "../components/Navbar";

const MenuItem = ({ title, subtitle, href, imageSource }) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <View style={styles.menuItemContent}>
          <View style={styles.textContainer}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          </View>
          <Image source={imageSource} style={styles.image} />
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
      imageSource: require("../../assets/branch.jpg"),
    },
    {
      id: "interest",
      title: "Interest rate",
      subtitle: "Search for interest rate",
      href: "/banking/interest-rate",
      imageSource: require("../../assets/interest.jpg"),
    },
    {
      id: "exchangeRate",
      title: "Exchange rate",
      subtitle: "Search for exchange rate",
      href: "/banking/exchange-rate",
      imageSource: require("../../assets/interest-rate.jpg"),
    },
    {
      id: "exchange",
      title: "Exchange",
      subtitle: "Exchange amount of money",
      href: "/banking/exchange",
      imageSource: require("../../assets/exchange.jpg"),
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
            imageSource={item.imageSource}
          />
        ))}
      </ScrollView>

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
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 16,
    resizeMode: "cover",
  },
  navbarSpacer: {
    height: 80,
  },
});
