import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

export default function AccountnCarddScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Account");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserData({
            username: parsed.username || "Guest User",
            email: parsed.email || "guest@example.com",
            balance: parsed.balance || 0,
          });
        } else {
          setUserData({
            username: "Guest User",
            email: "guest@example.com",
            balance: 0,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUserData({
          username: "Guest User",
          email: "guest@example.com",
          balance: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBackPress = () => {
    router.push("/home");
  };

  const handleCardPress = (cardId) => {
    router.push(`/menu/cardDetail?cardId=${cardId}`);
  };

  const formatBalance = (balance) => {
    return balance?.toLocaleString("en-US") || "0";
  };

  const accounts = [
    {
      id: 1,
      name: "Main Account",
      number: "**** **** 1234",
      balance: `XAF ${formatBalance(userData?.balance)}`,
      type: "Current Account",
    },
    {
      id: 2,
      name: "Savings",
      number: "**** **** 5678",
      balance: "XAF 15,000",
      type: "Savings Account",
    },
    {
      id: 3,
      name: "Investment",
      number: "**** **** 9012",
      balance: "XAF 250,000",
      type: "Investment Account",
    },
  ];

  const cards = [
    {
      id: 1,
      name: userData?.username || "Card Holder",
      number: "**** **** **** 9018",
      balance: `XAF ${formatBalance(userData?.balance)}`,
      gradient: ["#2E1065", "#1E40AF", "#0EA5E9"],
      brand: "VISA",
    },
    {
      id: 2,
      name: userData?.username || "Card Holder",
      number: "**** **** **** 9019",
      balance: "XAF 3,469",
      gradient: ["#F59E0B", "#FB923C"],
      brand: "MASTERCARD",
    },
  ];

  const getInitials = (name) => {
    if (!name) return "GU";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const renderAccountTab = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContent}>
        {/* Profile Card Section with User Data */}
        <LinearGradient
          colors={["#1E293B", "#334155"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.cardDecorations}>
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
          </View>

          <View style={styles.profileContent}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(userData?.username)}
              </Text>
            </View>
            <Text style={styles.userName}>{userData?.username}</Text>
            <Text style={styles.userEmail}>{userData?.email}</Text>
          </View>
        </LinearGradient>

        {/* Accounts List */}
        <View style={styles.accountsList}>
          {accounts.map((account) => (
            <View key={account.id} style={styles.accountItem}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountType}>{account.type}</Text>
              </View>
              <View style={styles.accountBalance}>
                <Text style={styles.balanceAmount}>{account.balance}</Text>
                <Text style={styles.accountNumber}>{account.number}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderCardTab = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.cardsList}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card.id)}
            >
              <LinearGradient
                colors={card.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardItem}
              >
                <View style={styles.cardDecorations}>
                  <View style={[styles.decorativeCircle, styles.circle1]} />
                  <View style={[styles.decorativeCircle, styles.circle2]} />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <Text style={styles.cardBalance}>{card.balance}</Text>
                  <Text style={styles.cardBrand}>{card.brand}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addCardButton}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addCardGradient}
            >
              <Text style={styles.addCardText}>Add New Card</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        title="Account and Card"
        showBack={true}
        onBackPress={handleBackPress}
      />

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Account" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Account")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Account" && styles.activeTabText,
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Card" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Card")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Card" && styles.activeTabText,
              ]}
            >
              Card
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Account" ? renderAccountTab() : renderCardTab()}
      </View>

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
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 25,
    padding: 4,
    marginVertical: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: "#4F46E5",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  tabContent: {
    flex: 1,
  },
  // Profile Card Styles
  profileCard: {
    borderRadius: 16,
    padding: 20,
    height: 180,
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  profileContent: {
    alignItems: "center",
    zIndex: 1,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  // Card Decorations
  cardDecorations: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1000,
  },
  circle1: {
    width: 120,
    height: 120,
    top: -40,
    right: -20,
  },
  circle2: {
    width: 80,
    height: 80,
    top: 60,
    right: 30,
  },
  // Accounts List
  accountsList: {
    paddingTop: 10,
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  accountType: {
    fontSize: 12,
    color: "#6B7280",
  },
  accountBalance: {
    alignItems: "flex-end",
  },
  accountNumber: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
  },
  // Cards List
  cardsList: {
    paddingTop: 10,
  },
  cardItem: {
    borderRadius: 16,
    marginBottom: 16,
    height: 180,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    zIndex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
    fontStyle: "italic",
    alignSelf: "flex-end",
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginVertical: 8,
  },
  cardBalance: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addCardButton: {
    borderRadius: 12,
    marginTop: 16,
    overflow: "hidden",
  },
  addCardGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  addCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
