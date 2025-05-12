import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

const Search = ({ title, subtitle, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
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
  );
};

const FinancialMenuScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: "branch",
      title: "Branch",
      subtitle: "Search for branch",
      onPress: () => navigation.navigate("BranchSearch"),
    },
    {
      id: "interest",
      title: "Interest rate",
      subtitle: "Search for interest rate",
      onPress: () => navigation.navigate("InterestRateSearch"),
    },
    {
      id: "exchangeRate",
      title: "Exchange rate",
      subtitle: "Search for exchange rate",
      onPress: () => navigation.navigate("ExchangeRateSearch"),
    },
    {
      id: "exchange",
      title: "Exchange",
      subtitle: "Exchange amount of money",
      onPress: () => navigation.navigate("ExchangeMoney"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            onPress={item.onPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

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
});

export default Search;
