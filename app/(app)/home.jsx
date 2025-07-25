import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Link, router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "../components/Navbar";
import Header from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          username: parsed.username || "Guest User",
          email: parsed.email || "guest@example.com",
          balance: parsed.balance || 0,
          accountNumber: "**** **** **** 9018",
          cardType: "Virtual Debit Card",
          currency: "XAF",
        });
      } else {
        // fallback user
        setUserData({
          username: "Guest User",
          email: "guest@example.com",
          balance: 0,
          accountNumber: "**** **** **** 0000",
          cardType: "Virtual Debit Card",
          currency: "XAF",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserData({
        username: "Guest User",
        email: "guest@example.com",
        balance: 0,
        accountNumber: "**** **** **** 0000",
        cardType: "Virtual Debit Card",
        currency: "XAF",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleMenuPress = (itemId) => {
    switch (itemId) {
      case 1:
        router.push("/menu/accountandcard");
        break;
      case 2:
        router.push("/transfers");
        break;
      case 3:
        router.push("/menu/withdraw");
        break;
      case 4:
        router.push("/menu/mobile");
        break;
      case 5:
        router.push("/menu/bill");
        break;
      case 6:
        router.push("/transactions");
        break;
      case 7:
        router.push("/menu/beneficiary");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Account\nand Card",
      icon: "account-balance-wallet",
      color: "#6366F1",
    },
    { id: 2, title: "Transfer", icon: "swap-horiz", color: "#EF4444" },
    { id: 3, title: "Withdraw", icon: "atm", color: "#3B82F6" },
    {
      id: 4,
      title: "Mobile\nprepaid",
      icon: "phone-android",
      color: "#F59E0B",
    },
    { id: 5, title: "Pay the\nbill", icon: "receipt", color: "#10B981" },
    {
      id: 6,
      title: "Transaction\nreport",
      icon: "description",
      color: "#6366F1",
    },
    { id: 7, title: "Beneficiary", icon: "people", color: "#EC4899" },
  ];

  const formatBalance = (balance) => {
    return balance?.toLocaleString("en-US") || "0";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <Header title="Home" showBackButton={false} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      >
        {/* Credit Card Section */}
        <View style={styles.cardContainer}>
          <View style={styles.creditCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHolderName}>{userData?.username}</Text>
              <Text style={styles.cardType}>{userData?.cardType}</Text>
            </View>

            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>
                {userData?.accountNumber}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.balance}>
                {userData?.currency}
                {formatBalance(userData?.balance)}
              </Text>
              <Text style={styles.visaText}>VISA</Text>
            </View>

            <View style={styles.cardCircle1} />
            <View style={styles.cardCircle2} />
          </View>
        </View>

        {/* Menu Grids */}
        {[0, 3, 6].map((start) => (
          <View style={styles.menuGrid} key={start}>
            {menuItems.slice(start, start + 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.id)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Recent Transactions (Static for now) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push("/transactions")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Icon name="shopping-bag" size={20} color="#6366F1" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>Amazon Purchase</Text>
              <Text style={styles.transactionDate}>Today, 10:45 AM</Text>
            </View>
            <Text style={styles.transactionAmount}>- XAF 24,500</Text>
          </View>
        </View>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 40,
  },
  creditCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    height: 200,
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardHolderName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardType: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  cardNumber: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardNumberText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  balance: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },
  visaText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
  },
  cardCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  cardCircle2: {
    position: "absolute",
    bottom: -40,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuText: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  seeAll: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "500",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});

export default Home;
